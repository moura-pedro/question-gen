import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QuizProvider } from './context/QuizContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <QuizProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
        <Toaster position="top-center" />
      </QuizProvider>
    </BrowserRouter>
  );
}

export default App;