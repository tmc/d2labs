import React from 'react';
import './App.css';

// import ExampleComponent from './ExampleComponent'
// import ExampleCompletion from './ExampleCompletion'
import DiagramPrompt from './DiagramPrompt'
import DiagramCompletion from './DiagramCompletion'

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
