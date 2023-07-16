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

function DiagramCompletion() {
  // we'll run/restart the subscription when the prompt changes (with a debounce).
  const [prompt, setPrompt] = useState("Diagram a redis-based chat app.");
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
  // base64 encoded version of the result:
  const srcb64 = btoa(result);

  // use tailwind to render a basic input box and a text box below it that shows results.
  return (
    <div style={{fontSize: 'small'}}>
      d2labs
      <pre>
        loading: {loading ? 'true' : 'false'}<br/>
      </pre>
      <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
        style={{width: '400px', height: '30px'}}
      />
      <br/>
      <div>
        <textarea readOnly value={result} style={{width: '400px', height: '200px'}} />
      </div>
        <img 
        style={{
          width: '400px', 
        }}
        src={`http://localhost:8080/render.png?src=${encodeURIComponent(srcb64)}`} alt='render' />
    </div>

  );
}

export default DiagramCompletion;
