import './App.css';

import * as FullStory from '@fullstory/browser';

import DiagramCompletion from './DiagramCompletion'
// import Layout from './Layout'

FullStory.init({
  orgId: import.meta.env.REACT_APP_FULLSTORY_ORG_ID || 'o-1NMDBK-na1',
  devMode: import.meta.env.DEV,
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
