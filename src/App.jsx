import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  const [chat, setChat] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'Arial, sans-serif',
  };

  const headerStyle = {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    padding: '1rem',
    textAlign: 'center',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  };

  const mainStyle = {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '1rem',
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '768px',
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    background: 'white',
    overflow: 'hidden',
  };

  const cardHeaderStyle = {
    padding: '1rem',
    borderBottom: '1px solid #ddd',
    fontSize: '1.25rem',
    fontWeight: '600',
  };

  const messagesStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  };

  const userBubbleStyle = {
    alignSelf: 'flex-end',
    backgroundColor: '#10b981',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '1rem',
    maxWidth: '80%',
    wordWrap: 'break-word',
  };

  const assistantBubbleStyle = {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    color: 'black',
    padding: '0.5rem 1rem',
    borderRadius: '1rem',
    maxWidth: '80%',
    wordWrap: 'break-word',
  };

  const inputContainerStyle = {
    borderTop: '1px solid #ddd',
    padding: '1rem',
    display: 'flex',
    gap: '0.5rem',
  };

  const inputStyle = {
    flex: 1,
    padding: '0.5rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '0.5rem',
    fontSize: '1rem',
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  };

  const chatList = chat.map((el, index) => (
    <div key={index} style={el.stl ? userBubbleStyle : assistantBubbleStyle}>
      {el.input}
    </div>
  ));

  const handleText = () => {
    if (!text.trim()) return;
    setLoading(true);

    // Add user message
    setChat((prev) => [...prev, { input: text, stl: true }]);

    axios
      .post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: text },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        const reply = res.data.choices[0].message.content;
        setChat((prev) => [...prev, { input: reply, stl: false }]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    setText('');
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        Harir AI
      </header>

      <main style={mainStyle}>
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>Chat Session</div>

          <div style={messagesStyle}>
            {chat.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: 'auto', color: '#6b7280' }}>
                <h3>Welcome to Harir AI!</h3>
                <p>Ask me anything and I'll try to help.</p>
              </div>
            ) : (
              chatList
            )}
          </div>

          <div style={inputContainerStyle}>
            <input
              type="text"
              placeholder="Ask anything..."
              style={inputStyle}
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
            />
            <button style={buttonStyle} onClick={handleText} disabled={loading || !text.trim()}>
              {loading ? 'Loading...' : 'Send'}
            </button>
          </div>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
       design by Harir and Powered by React + Groq API
      </footer>
    </div>
  );
}

export default App;
