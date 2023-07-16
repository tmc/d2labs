import React from 'react';
import { useState } from 'react';
import { useSubscription } from '@apollo/client'
import './App.css';
import { graphql } from '../src/gql-gen'

const diagramCompletionSubscription = graphql(`
  subscription DiagramSubscription($prompt: String!) {
    diagramCompletion(prompt: $prompt) {
      text
      isLast
    }
}
`)

// set render url based on node env
const RENDER_URL = process.env.NODE_ENV === 'production' ? '/render.png' : 'http://localhost:8080/render.png'

const SAMPLES = [
  "A typical 3 tier web architecture.",
  "A phylogenetic tree of lions including the genuses",
  "A typical microservice architecture",
  "A typical 3 tier web architecture with a load balancer",
  "A typical 3 tier web architecture with a load balancer and a database and a cache and a message queue",
  "A typical 3 tier web architecture with a load balancer and a database and a cache and a message queue and a search engine and a monitoring system and a logging system",
  "A typical 3 tier web architecture with a load balancer and a database and a cache and a message queue and a search engine and a monitoring system and a logging system and a container orchestration system",
  "A typical 3 tier web architecture with a load balancer and a database and a cache and a message queue and a search engine and a monitoring system and a logging system and a container orchestration system and a container registry",
]

function DiagramCompletion() {
  // we'll run/restart the subscription when the prompt changes (with a debounce).
  const [prompt, setPrompt] = useState("A typical 3 tier web architecture.");
  const [debouncedPrompt, setDebouncedPrompt] = useState(prompt);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setResult("");
      setDebouncedPrompt(prompt);
    }, 500);
    return () => clearTimeout(timeout);
  }, [prompt]);

  // result accumulator:
  const [result, setResult] = useState("");

  const { loading } = useSubscription(diagramCompletionSubscription, {
    variables: {
      prompt: debouncedPrompt,
    },
    onError: (err) => {
      console.error(err)
    },
   onData: (data) => {
     setResult(result + data.data.data?.diagramCompletion?.text);
    },
  });

  // base64 encoded version of the result (debcounced)
  // const srcb64 = btoa(result);
  const [srcb64, setSrcb64] = useState("");
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setSrcb64(btoa(result));
    }, 500);
    return () => clearTimeout(timeout);
  }, [result]);


  // use tailwind to render a basic input box and a text box below it that shows results.
  return (
    <div style={{fontSize: 'small'}}>
      <h1>d2labs: AI-assisted Architecture Diagramming</h1>
      <div>
        Sample diagrams:
        <ul>
          {SAMPLES.map((s) => <li><a href="#" onClick={(e) => {setPrompt((e.target as HTMLAnchorElement).text)}}>{s}</a></li>)}
        </ul> 
      </div>
      <div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
        style={{width: '400px', height: '80px'}}
      />
</div>
      <br/>
      <div>
        <textarea value={result} style={{width: '400px', height: '200px'}} />
      </div>
        <img 
        style={{
          width: '400px', 
        }}
        src={`${RENDER_URL}?src=${encodeURIComponent(srcb64)}`} alt='render' />
    </div>

  );
}

export default DiagramCompletion;
