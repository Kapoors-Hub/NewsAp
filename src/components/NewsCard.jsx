import React, { useState } from 'react';
import { Calendar, Clock, ExternalLink, BookmarkPlus, Share2 } from 'lucide-react';

const NewsCard = ({ article }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  return (
    <div
      className={`group relative overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-gray-800 rounded-lg shadow-md h-[400px] w-[300px]`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={article.urlToImage || '/api/placeholder/400/320'}
          alt={article.title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ${
              isBookmarked ? 'bg-blue-500 text-white' : 'bg-white/90 hover:bg-blue-500 hover:text-white'
            }`}
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white/90 rounded-full transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-blue-500 hover:text-white"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col justify-between h-[calc(100%-150px)]">
        <div>
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 rounded-full">
              {article.source?.name || 'News'}
            </span>
          </div>

          <h2 className="text-lg font-semibold leading-tight mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
            {truncateText(article.title, 80)}
          </h2>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {truncateText(article.description, 120)}
          </p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {formatDate(article.publishedAt)}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {Math.ceil(article.content?.length / 1000) || 5} min read
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
        >
          Read More
          <ExternalLink className="w-4 h-4 ml-1 transform transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
