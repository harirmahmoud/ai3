import { useState } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [chat, setChat] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const style1 = {
    position: "relative",
    left: "85%",
    background: "blue",
    borderRadius: "5px",
    color: "white",
    padding: "5px",
    marginBottom: "5px",
  width:"10%"
  };

  const style2 = {
    position: "relative",
    width:"50%",
    left: "10px",
    background: "#333",
    borderRadius: "5px",
    color: "white",
    padding: "5px",
    marginBottom: "5px"
  };
 const styleContainer = {
  display: "flex",
  flexDirection: "column",
 justifyContent: "center",
  alignItems: "center",
  backgroundColor: '#000',        // Black background
  color: '#fff',                  // White text
  minHeight: '100vh',
  width:"100%",             // Full screen height
  padding: '20px',
  fontFamily: 'Arial, sans-serif',
  
  
};

const styleList = {
  height: '300px',
  overflowY: 'scroll',
  border: '1px solid #444',
  padding: '10px',
  marginTop: '100px',
  background: '#111',             // Dark gray chat area
  borderRadius: '8px',
  width:"70%"
};

const styleInput = {
  padding: '8px',
  borderRadius: '5px',
  width:"300px",
  border: '1px solid #555',
  backgroundColor: '#222',
  color: '#fff',
  marginRight: '10px'
};

const styleButton = {
  padding: '8px 16px',
  borderRadius: '5px',
  border: 'none',
  backgroundColor: '#1e90ff',
  color: '#fff',
  cursor: 'pointer'
};

  const list = chat.map((el, index) => (
    <li key={index} style={el.stl ? style1 : style2}>{el.input}</li>
  ));

  const handleText = () => {
    if (!text.trim()) return;
    setLoading(true);

    // Add user input to chat
    setChat(prev => [...prev, {
      input: text,
      stl: true,
    }]);

    axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: text },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    ).then((res) => {
      setLoading(false);
      const reply = res.data.choices[0].message.content;
      setChat(prev => [...prev, {
        input: reply,
        stl: false,
      }]);
    }).catch(e => {
      setLoading(false);
      console.error(e);
    });

    setText(""); // Clear input box
  }

  return (
    <div style={styleContainer}>
  <h1>Harir AI</h1>
  <div style={styleList}>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {list}
    </ul>
  </div>
  <div style={{margin:"auto"}}>
    <input
      placeholder='Ask anything ...'
      style={styleInput}
      value={text}
      onChange={(e) => setText(e.target.value)}
      type="text"
    />
    <button style={styleButton} onClick={handleText}>
      {loading ? "loading ..." : "send"}
    </button>
  </div>
</div>
  );
}

export default App;
