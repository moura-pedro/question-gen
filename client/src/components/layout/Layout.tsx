import React, { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useQuiz } from '../../context/QuizContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { quizStarted } = useQuiz();
  const [pageTitle, setPageTitle] = useState('AI Quiz Generator');
  
  useEffect(() => {
    // Update page title based on route
    switch (location.pathname) {
      case '/':
        setPageTitle('AI Quiz Generator');
        break;
      case '/quiz':
        setPageTitle('Take Quiz');
        break;
      case '/results':
        setPageTitle('Quiz Results');
        break;
      default:
        setPageTitle('AI Quiz Generator');
    }
    
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title={pageTitle} />
      
      <main className={`flex-grow container mx-auto px-4 sm:px-6 pb-12 pt-6 page-transition ${quizStarted ? 'max-w-3xl' : 'max-w-4xl'}`}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;