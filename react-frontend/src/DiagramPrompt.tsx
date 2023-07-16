import React from 'react';
import { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client'
import './App.css';
import { graphql } from '../src/gql-gen'


// Sample Query-- the codegen does not create code that compiles if there are
// no queries registered via the 'graphql' function
const getUserQueryDocument = graphql(`
  query GetUserX($userId: ID!) {
    user(id: $userId) {
      id
      description
    }
  }
`)

const testSubscription = graphql(`
  subscription TestSubScription {
    testSubscription
  }
`)

function DiagramComponent() {
  // 'data' is typed
  // const [subErrorState, setSubErrorState] = useState("");
  // const { data: subData, loading: subLoading } = useSubscription(testSubscription, { variables: {}, onError: (err) => {
  //   setSubErrorState(err.message)
  // },
  // })
  // const { data, loading, error, networkStatus } = useQuery(getUserQueryDocument, { variables: {"userId": 42}})
  const [prompt, setPrompt] = useState("");
  return (
    <div style={{fontSize: 'small'}}>
      <input type="text" />
    </div>
  );
}

export default DiagramComponent;
