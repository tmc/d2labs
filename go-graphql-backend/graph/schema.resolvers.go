package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.31

import (
	"context"
	"fmt"
	"time"

	"githib.com/tmc/d2lab/go-graphql-server/graph/model"
	model1 "githib.com/tmc/d2lab/go-graphql-server/graph/model"
)

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id string) (*model1.User, error) {
	return &model.User{
		ID:          id,
		Description: "User " + id + " description here. (coming from the Go backend)",
	}, nil
}

// Me is the resolver for the me field.
func (r *queryResolver) Me(ctx context.Context) (*model1.User, error) {
	panic(fmt.Errorf("not implemented: Me - me"))
}

// TestSubscription is the resolver for the testSubscription field.
func (r *subscriptionResolver) TestSubscription(ctx context.Context) (<-chan string, error) {
	ch := make(chan string, 1)
	go func() {
		for i := 0; i < 100; i++ {
			select {
			case ch <- fmt.Sprintf("Hello! These are generated from the go backend. (iter: %d)", i):
			default:
				return
			}
			time.Sleep(1 * time.Second)
		}
	}()
	return ch, nil
}

// GenericCompletion is the resolver for the genericCompletion field.
func (r *subscriptionResolver) GenericCompletion(ctx context.Context, prompt string) (<-chan *model1.CompletionChunk, error) {
	return r.genericCompletion(ctx, prompt)
}

// Query returns QueryResolver implementation.
func (r *Resolver) Query() QueryResolver { return &queryResolver{r} }

// Subscription returns SubscriptionResolver implementation.
func (r *Resolver) Subscription() SubscriptionResolver { return &subscriptionResolver{r} }

type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
