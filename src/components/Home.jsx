import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RefreshCcw, AlertCircle, ArrowUp } from 'lucide-react';
import NewsList from './NewsList';
import Navbar from './Navbar';
import NewsChatbot from './NewsChatbot';
import EnhancedNewsChatbot from './EnhancedNewsChatbot';

const Home = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fetchNews = async () => {
    try {
      setError(null);
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${import.meta.env.VITE_NEWS_API_KEY}`
      );
      setNews(response.data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNews();
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Top Headlines
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Stay informed with the latest news
              </p>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 disabled:opacity-50"
            >
              <RefreshCcw 
                className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} 
              />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 mb-6 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg animate-fadeIn">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          )}

          {/* Content Section */}
          <div className="transform transition-opacity duration-300 ease-in-out">
            <NewsList 
              articles={news} 
              isLoading={loading}
            />
          </div>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className={`fixed right-8 bottom-8 p-3 bg-blue-500 text-white rounded-full shadow-lg transform transition-all duration-300 hover:bg-blue-600 ${
              showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* Footer Section */}
          <div className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>Data provided by NewsAPI.org</p>
            <p className="mt-1">© {new Date().getFullYear()} NewsChat. All rights reserved.</p>
          </div>
        </div>
      </main>
        <NewsChatbot currentNews={news} />
        {/* <EnhancedNewsChatbot currentNews={news} /> */}
    </div>
  );
};  

export default Home;