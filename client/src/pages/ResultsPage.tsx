import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import QuizResults from '../components/quiz/QuizResults';

const ResultsPage: React.FC = () => {
  const { questions, quizCompleted } = useQuiz();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no questions are loaded or quiz isn't completed, redirect to home
    if (questions.length === 0 || !quizCompleted) {
      navigate('/');
    }
  }, [questions, quizCompleted, navigate]);
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p>Nenhum resultado de quiz disponível.</p>
      </div>
    );
  }
  
  return <QuizResults />;
};

export default ResultsPage;