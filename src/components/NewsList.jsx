import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard';

const NewsList = ({ articles, isLoading }) => {
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    if (articles && articles.length > 0) {
      const showItems = () => {
        articles.forEach((_, index) => {
          setTimeout(() => {
            setVisibleItems(prev => [...prev, index]);
          }, index * 100);
        });
      };
      
      setVisibleItems([]);
      showItems();
    }
  }, [articles]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <div 
            key={index}
            className="animate-pulse"
          >
            <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4" />
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
        <div className="w-16 h-16 mb-4 border-2 border-gray-300 dark:border-gray-600 rounded-full animate-spin" />
        <p className="text-lg">No articles found</p>
        <p className="text-sm mt-2">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <div
          key={index}
          className={`transform transition-all duration-500 ${
            visibleItems.includes(index)
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          }`}
        >
          <NewsCard article={article} />
        </div>
      ))}
    </div>
  );
};

export default NewsList;