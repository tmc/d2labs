package graph

import (
	"context"
	"fmt"
	"strings"
	"time"

	"githib.com/tmc/d2lab/go-graphql-server/graph/model"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/openai"
	"github.com/tmc/langchaingo/schema"
)

func (r *subscriptionResolver) genericCompletion(ctx context.Context, prompt string) (<-chan *model.CompletionChunk, error) {
	llm, err := openai.New()
	if err != nil {
		fmt.Println("Error creating openai client", err)
		return r.fakeGenericCompletion(ctx, prompt)
	}
	ch := make(chan *model.CompletionChunk, 1)
	go func() {
		defer close(ch)
		_, err := llm.Chat(ctx, []schema.ChatMessage{
			schema.HumanChatMessage{Text: prompt + " (be concise)"},
		}, llms.WithStreamingFunc(func(ctx context.Context, chunk []byte) error {
			ch <- &model.CompletionChunk{
				Text: string(chunk),
			}
			return nil
		}),
		)
		if err != nil {
			fmt.Println(err)
		}
		ch <- &model.CompletionChunk{
			Text:   "",
			IsLast: true,
		}
	}()
	return ch, nil
}

func example(s string) string {
	return fmt.Sprintf("```d2\n%v\n```\n", s)
}

var tripleBacktick = "```"
var diagramSystemPrompt = `
You are an architecture diagramming assistant. You are helping a software engineer create a diagram of their system. The engineer will provide you with a list of components.

You will outout the D2 language.

Here is the core syntax of the D2 Language:
D2 provides four connection operators: -> (forward connector), <- (backward connector), -- (straight line), and <-> (both sides connector). 

Here are some basic examples:

` + example("x -> y: hello world") + `
This declares a connection between two shapes, x and y, with the label, hello world.

` + example(`Write Replica Canada <-> Write Replica Australia

Read Replica <- Master
Write Replica -> Master

Read Replica 1 -- Read Replica 2
`) + `
This shows how to declare connections. The first line declares a connection between two shapes, Write Replica Canada and Write Replica Australia. The second line declares a connection between two shapes, Read Replica and Master. The third line declares a connection between two shapes, Write Replica and Master. The fourth line declares a connection between two shapes, Read Replica 1 and Read Replica 2.

` + example(`server
# Declares a shape inside of another shape
server.process

# Can declare the container and child in same line
im a parent.im a child

# Since connections can also declare keys, this works too
apartment.Bedroom.Bathroom -> office.Spare Room.Bathroom: Portal
`) + `
This shows how to declare shapes inside of other shapes. The first line declares a shape called server. The second line declares a shape called process inside of server. The third line declares a shape called child inside of a shape called parent. The fourth line declares a connection between two shapes, apartment.Bedroom.Bathroom and office.Spare Room.Bathroom, with the label, Portal.


` + example(`clouds: {
  aws: {
    load_balancer -> api
    api -> db
  }
  gcloud: {
    auth -> db
  }

  gcloud -> aws
}
`) + `
This shows how to declare shapes inside of other shapes. The first line declares a shape called clouds with sub-shapes aws and gcloud. The second line declares a connection between two shapes, aws.load_balancer and aws.api. The third line declares a connection between two shapes, aws.api and aws.db. The fourth line declares a connection between two shapes, gcloud.auth and gcloud.db. The fifth line declares a connection between two shapes, gcloud and aws.

Only print out the d2 diagram text. Do not print out "` + "```d2" + `" or "` + "```" + `" around your response.`

var (
	fewshots = [][]string{
		[]string{
			"A typical 3 tier web architecture.",
			`Client: {
    label: 'Client'
}
WebServer: {
    label: 'Web Server'
	icon: 'https://icons.terrastruct.com/essentials%2F112-server.svg'
}
DatabaseServer: {
    label: 'Database Server'
    icon: 'https://icons.terrastruct.com/essentials%2F119-database.svg'
}
Client -> WebServer: 'Request'
WebServer -> DatabaseServer: 'Query data'
DatabaseServer -> WebServer: 'Response data'
WebServer -> Client: 'Serve requested data'`,
		},
		[]string{
			"A phylogenetic tree of salamanders",
			`Salamanders: {
  Ambystomatidae
  Plethodontidae
  Salamandridae
  Cryptobranchidae
  Hynobiidae

  Ambystomatidae -- Plethodontidae
  Plethodontidae -- Salamandridae 
  Salamandridae -- Cryptobranchidae
  Cryptobranchidae -- Hynobiidae
}`,
		},
		[]string{
			"User inputs the description of the diagram desired using the English language. This description will be processed by GPT-4. GPT-4 is trained (externally) on D2 documentation. GPT will generate the D2 code and feed it back into the User Interface. The user interface will generate the diagram rendering in real time using graphql subscription, as well as show the D2 code to the user.",
			`System: {
  UserInterface: {
    shape: rectangle
    label: 'User Interface'
  }

  GPT4: {
    shape: rectangle
    label: 'GPT-4'
  }

  D2_Documentation: {
    shape: rectangle
    label: 'D2 Documentation'
  }

  GraphQL: {
    shape: rectangle
    label: 'Rendering Server'
  }

  UserInterface -> GPT4: 'English description of diagram'
  D2_Documentation -> GPT4: 'Train on D2 documentation'
  GPT4 -> GraphQL: 'Generated D2 code'
  GraphQL -> UserInterface: 'GraphQL real-time rendering'
}`,
		},
	}
)

func (r *subscriptionResolver) diagramCompletion(ctx context.Context, prompt string) (<-chan *model.CompletionChunk, error) {
	llm, err := openai.New(openai.WithModel("gpt-4"))
	if err != nil {
		fmt.Println("Error creating openai client", err)
		return r.fakeGenericCompletion(ctx, prompt)
	}
	ch := make(chan *model.CompletionChunk, 1)

	messages := []schema.ChatMessage{
		schema.SystemChatMessage{Text: diagramSystemPrompt},
	}
	for _, fs := range fewshots {
		messages = append(messages, schema.HumanChatMessage{Text: fs[0]})
		messages = append(messages, schema.AIChatMessage{Text: fs[1]})
	}
	messages = append(messages, schema.HumanChatMessage{Text: prompt})

	go func() {
		defer close(ch)
		_, err := llm.Chat(ctx, messages, llms.WithModel("gpt-4"), llms.WithStreamingFunc(func(ctx context.Context, chunk []byte) error {
			ch <- &model.CompletionChunk{
				Text: string(chunk),
			}
			return nil
		}),
		)
		if err != nil {
			fmt.Println(err)
		}
		ch <- &model.CompletionChunk{
			Text:   "",
			IsLast: true,
		}
	}()
	return ch, nil
}
func (r *subscriptionResolver) fakeGenericCompletion(ctx context.Context, prompt string) (<-chan *model.CompletionChunk, error) {
	ch := make(chan *model.CompletionChunk, 1)
	response := "Hello! These are generated from the go backend. This is not a very funny joke"
	go func() {
		for i, word := range strings.Split(response, " ") {
			isLast := i == len(response)-1
			text := fmt.Sprintf("%v ", word)
			if isLast {
				text = word
			}
			select {
			case ch <- &model.CompletionChunk{
				Text:   text,
				IsLast: isLast,
			}:
			default:
				return
			}
			time.Sleep(200 * time.Millisecond)
		}
	}()
	return ch, nil
}
