import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const location = useLocation();
  const { quizStarted, quizCompleted, resetQuiz } = useQuiz();
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-2"
              onClick={quizStarted && !quizCompleted ? (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to exit the quiz? Your progress will be lost.')) {
                  resetQuiz();
                }
              } : undefined}
            >
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">QuizGenius</span>
            </Link>
          </div>
          
          <div className="font-medium text-lg text-gray-700 hidden md:block">
            {title}
          </div>
          
          <div className="flex items-center space-x-4">
            {location.pathname !== '/' && !quizStarted && (
              <Link 
                to="/"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Home
              </Link>
            )}
            
            {quizStarted && quizCompleted && (
              <button
                onClick={resetQuiz}
                className="btn btn-secondary btn-sm"
              >
                New Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;