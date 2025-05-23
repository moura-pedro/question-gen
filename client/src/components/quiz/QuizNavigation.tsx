import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

const QuizNavigation: React.FC = () => {
  const { 
    questions, 
    currentQuestion, 
    answers, 
    nextQuestion, 
    prevQuestion, 
    submitQuiz 
  } = useQuiz();
  
  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;
  
  return (
    <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-6">
      <button
        onClick={prevQuestion}
        disabled={isFirstQuestion}
        className={`btn btn-secondary ${isFirstQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-label="Questão anterior"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Anterior
      </button>
      
      {isLastQuestion ? (
        <button
          onClick={submitQuiz}
          disabled={!allQuestionsAnswered}
          className={`btn btn-accent ${!allQuestionsAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Enviar quiz"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Enviar Quiz
        </button>
      ) : (
        <button
          onClick={nextQuestion}
          className="btn btn-primary"
          aria-label="Próxima questão"
        >
          Próxima
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      )}
    </div>
  );
};

export default QuizNavigation;