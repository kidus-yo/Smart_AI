import ChatMessage from './components/ChatMessage.jsx';
import  { useState } from "react";


import ChatbotIcon from './components/Chatboticon.jsx';
import ChatForm from './components/ChatForm.jsx';

const App = () => {
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat : true,
      role: "model",
      text: "Hi, I am Smart City AI, how can I help you?",
    }
  ]);
  const generateBotResponse = async (history) => {
    const updateHistory = (text) => {
      setChatHistory(prev => [...prev.filter(msg => msg.text !== "thinking..."), {role: "model",text}]);
    }
    
    const lastMessage = history[history.length - 1];

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text:"give a different answer for every question" +"You are now a smart city asistant for Ethiopian gov also give some, assistance on the components like transportation services and also medical services, do not go out of context" + lastMessage.text }],
          },
        ],
      }),
    };

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error?.message || "Something went wrong!");
      console.log("Bot reply:", data);
      const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").
      trim()
      updateHistory(apiResponseText);

    } catch (error) {
      console.error("Error fetching bot response:", error);
    }
  };

  return (
    <div className="chatbot-popup">
      <div className="chat-container">
        {/* ChatBot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatbotIcon />
            <h2 className="logo-text">Smart City AI</h2>
          </div>
          <button className="material-symbols-outlined">
            keyboard_arrow_down
          </button>
        </div>

        <div className="chat-body">
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

