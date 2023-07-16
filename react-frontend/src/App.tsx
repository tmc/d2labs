import React from 'react';
import './App.css';

import * as FullStory from '@fullstory/browser';

import DiagramCompletion from './DiagramCompletion'

FullStory.init({
  orgId: process.env.REACT_APP_FULLSTORY_ORG_ID || 'o-1NMDBK-na1',
  devMode: process.env.NODE_ENV === 'development',
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DiagramCompletion />
      </header>
    </div>
  );
}

export default App;
