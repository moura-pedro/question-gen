import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import QuizQuestion from '../components/quiz/QuizQuestion';
import QuizProgress from '../components/quiz/QuizProgress';
import QuizNavigation from '../components/quiz/QuizNavigation';

const QuizPage: React.FC = () => {
  const { questions, currentQuestion, quizStarted } = useQuiz();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If no questions are loaded or quiz hasn't started, redirect to home
    if (questions.length === 0 || !quizStarted) {
      navigate('/');
    }
  }, [questions, quizStarted, navigate]);
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p>Carregando questões do quiz...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <QuizProgress />
      
      {questions[currentQuestion] && (
        <div className="card">
          <div className="card-content">
            <QuizQuestion 
              question={questions[currentQuestion]} 
              index={currentQuestion} 
            />
          </div>
        </div>
      )}
      
      <QuizNavigation />
    </div>
  );
};

export default QuizPage;