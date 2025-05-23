import React from 'react';
import { useQuiz } from '../../context/QuizContext';

const QuizProgress: React.FC = () => {
  const { questions, currentQuestion, answers } = useQuiz();
  
  // Calculate progress percentage
  const questionsAnswered = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const progressPercentage = Math.round((questionsAnswered / totalQuestions) * 100);
  
  // Generate steps for progress indicator
  const steps = Array.from({ length: totalQuestions }, (_, i) => i);
  
  return (
    <div className="mb-6 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          Questão {currentQuestion + 1} de {totalQuestions}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {progressPercentage}% Completo
        </span>
      </div>
      
      {/* Linear progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-600 transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex items-center justify-between px-2">
        {steps.map((step) => (
          <div 
            key={step}
            className={`h-2.5 w-2.5 rounded-full transition-colors duration-200 ${
              step === currentQuestion 
                ? 'bg-indigo-600 ring-2 ring-indigo-100' 
                : step in answers 
                  ? 'bg-indigo-500'
                  : 'bg-gray-300'
            }`}
            aria-label={`Questão ${step + 1} ${step in answers ? 'respondida' : 'não respondida'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuizProgress;