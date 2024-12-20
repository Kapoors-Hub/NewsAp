import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Mic, Share2, ThumbsUp, 
         ThumbsDown, Newspaper, FastForward, AlertTriangle } from 'lucide-react';

const EnhancedNewsChatbot = ({ currentNews }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hi! I'm your news assistant. I can help you understand the news, summarize articles, fact-check claims, and more! What would you like to know?",
      actions: ['summarize', 'trending', 'factcheck']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState([
    'Technology', 'Politics', 'Environment', 'Economy', 'Health'
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  const handleVoiceInput = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (!isListening) {
      recognition.start();
      setIsListening(true);
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const summarizeArticle = async (articleIndex) => {
    const article = currentNews[articleIndex];
    setMessages(prev => [...prev, {
      role: 'user',
      content: `Summarize this article: ${article.title}`,
      type: 'summary-request'
    }]);
    await handleOpenAIRequest(`Please provide a concise summary of this article: ${article.title} ${article.description}`);
  };

  const factCheck = async (message) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: `Fact check: ${message}`,
      type: 'fact-check'
    }]);
    await handleOpenAIRequest(`Please fact check this claim and provide sources if possible: ${message}`);
  };

  const handleOpenAIRequest = async (prompt) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer '
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { 
              role: 'system', 
              content: `You are a knowledgeable news assistant. Current headlines: ${currentNews.map(article => article.title).join('. ')}`
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.choices[0].message.content,
        actions: ['summarize', 'factcheck']
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

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() && !e.targetMessage) return;

    const userMessage = e.targetMessage || input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    await handleOpenAIRequest(userMessage);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="fixed right-8 bottom-24 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>

      {/* Chat Window */}
      <div
        className={`fixed right-8 bottom-40 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl transition-all duration-500 transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        } z-40`}
      >
        {/* Chat Header */}
        <div className="p-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            News Assistant
            {isListening && <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
          </h3>
          
          {/* Trending Topics */}
          <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
            {trendingTopics.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleSubmit({ targetMessage: `Tell me about ${topic} news` })}
                className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full whitespace-nowrap hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Container */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="space-y-2 max-w-[80%]">
                <div
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                  } animate-fadeIn`}
                >
                  {message.content}
                </div>

                {/* Message Actions */}
                {message.actions && (
                  <div className="flex gap-2">
                    {message.actions.includes('summarize') && (
                      <button
                        onClick={() => summarizeArticle(0)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <FastForward className="w-3 h-3" /> Summarize
                      </button>
                    )}
                    {message.actions.includes('factcheck') && (
                      <button
                        onClick={() => factCheck(message.content)}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        <AlertTriangle className="w-3 h-3" /> Fact Check
                      </button>
                    )}
                  </div>
                )}
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
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${
                isListening ? 'text-red-500 animate-pulse' : ''
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>
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
    </>
  );
};

export default EnhancedNewsChatbot;
