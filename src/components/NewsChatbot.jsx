import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';

const NewsChatbot = ({ currentNews }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your news assistant. Ask me anything about the current news!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: 'system', 
              content: `You are a helpful news assistant. Current headlines: ${currentNews.map(article => article.title).join('. ')}`
            },
            ...messages,
            { role: 'user', content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.choices[0].message.content 
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I apologize, but I'm having trouble connecting right now. Please try again later." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      <div className="absolute right-0 bottom-0 p-8 pointer-events-auto">
        {/* Chat Toggle Button */}
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="absolute right-8 bottom-24 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>

        {/* Chat Window */}
        <div
          className={`absolute right-8 bottom-40 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-500 transform ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">News Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ask me about the latest news</p>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                  } animate-fadeIn`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg animate-pulse">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about the news..."
                className="flex-1 p-2 border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsChatbot;