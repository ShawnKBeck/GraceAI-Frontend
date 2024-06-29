import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

interface Message {
  text: string;
  isUser: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add Grace's introduction when the component mounts
    setMessages([
      { text: "Hello", isUser: true },
      { text: "Hi, I'm Grace, a compassionate Christian therapy assistant here to provide support and encouragement. How can I assist you today? I'm here to listen with an open heart and offer guidance grounded in faith, hope and love.", isUser: false }
    ]);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message to chat
    setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);

    // Clear input field and set loading state
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('https://grace-ai-backend-ShawnBeck.replit.app/api/chat', {
        message: inputMessage,
        history: messages.map(msg => [msg.isUser ? msg.text : '', msg.isUser ? '' : msg.text])
      });

      // Add AI response to chat, replacing \n with actual newlines
      setMessages(prev => [...prev, { text: response.data.response.replace(/\\n/g, '\n'), isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { text: "Sorry, I couldn't process that message. Please try again.", isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🙏 GraceAI 💖 - Christian Therapy Assistant</h1>
      </header>
      <div className="chat-container" ref={chatContainerRef}>
        {messages.slice(1).map((message, index) => (
          <div key={index} className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}>
            {message.text.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < message.text.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
        ))}
        {isLoading && (
          <div className="message ai-message loading">
            <div className="loading-indicator">
              <div></div><div></div><div></div>
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          className="message-input"
          disabled={isLoading}
        />
        <button type="submit" className="send-button" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;