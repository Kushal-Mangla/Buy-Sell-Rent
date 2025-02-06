import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircleQuestion, Send, X, Paperclip } from 'lucide-react';

const SupportChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize Gemini AI
  const apiKey = "AIzaSyCWBjH9GC79LnU7YKBybE_uI_XDeVCph_w";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Initial welcome message
  useEffect(() => {
    setMessages([{
      text: "Welcome to our e-commerce support! I'm here to help you with any questions about our products, orders, or services.",
      sender: 'bot',
      type: 'welcome'
    }]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending messages
  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = { 
      text: inputMessage, 
      sender: 'user',
      type: 'message',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare context-aware prompt with conversation history
      const conversationContext = messages
        .slice(-5)  // Take last 5 messages for context
        .map(m => `${m.sender === 'user' ? 'Customer' : 'Support'}: ${m.text}`)
        .join('\n');

      const contextPrompt = `You are a support chatbot for an e-commerce website. 
      Provide helpful, concise, and friendly customer support.
      
      Conversation Context:
      ${conversationContext}
      
      User's Latest Query: ${inputMessage}
      
      Respond professionally and helpfully, referencing previous conversation if relevant.`;

      // Generate AI response
      const result = await model.generateContent(contextPrompt);
      const botResponse = {
        text: result.response.text(),
        sender: 'bot',
        type: 'message',
        timestamp: new Date().toISOString()
      };

      // Add bot response to messages
      setMessages(prevMessages => [...prevMessages, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prevMessages => [...prevMessages, {
        text: "I'm experiencing technical difficulties. Please try again or contact our support team.",
        sender: 'bot',
        type: 'error'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input submission
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Render message with styling based on type and sender
  const renderMessage = (msg) => {
    const isUser = msg.sender === 'user';
    let bgColor = 'bg-blue-100';
    let textColor = 'text-blue-800';

    if (msg.type === 'welcome') {
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
    } else if (msg.type === 'error') {
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
    }

    return (
      <div 
        key={msg.timestamp}
        className={`p-3 rounded-lg max-w-[80%] mb-2 
          ${isUser 
            ? 'bg-blue-100 ml-auto text-right' 
            : `${bgColor} ${textColor} mr-auto text-left`}`}
      >
        {msg.text}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Support Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
        >
          <MessageCircleQuestion size={24} />
        </button>
      )}

      {/* Chatbot Modal */}
      {isOpen && (
        <div className="w-96 bg-white border rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="bg-blue-500 text-white p-3 flex justify-between items-center rounded-t-lg">
            <h3 className="font-semibold">E-commerce Support</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-3 space-y-2 max-h-[400px]">
            {messages.map(renderMessage)}
            {isLoading && (
              <div className="text-gray-500 italic p-2">Support is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-3 border-t flex items-center">
            <input 
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="How can we help you today?"
              className="flex-grow border rounded-l-lg p-2"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SupportChatbot;