import React, { useState } from 'react';
import Login from './components/Login';
import Chatbot from './components/Chatbot';

function App() {
  const [token, setToken] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <h1>E-commerce Chatbot</h1>
      {token ? <Chatbot token={token} /> : <Login setToken={setToken} />}
    </div>
  );
}

export default App;
