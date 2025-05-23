import React, { useState } from 'react';
import { CheckCircle, Circle } from 'lucide-react';
import { useQuiz, QuizQuestion as QuestionType } from '../../context/QuizContext';
import { motion } from 'framer-motion';

interface QuizQuestionProps {
  question: QuestionType;
  index: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ question, index }) => {
  const { answers, handleAnswerSelect, showResults } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<number | null>(
    answers[index] !== undefined ? answers[index] : null
  );
  
  const handleOptionSelect = (optionIndex: number) => {
    if (showResults) return;
    
    setSelectedOption(optionIndex);
    handleAnswerSelect(index, optionIndex);
  };
  
  const getOptionClass = (optionIndex: number) => {
    if (!showResults) {
      return selectedOption === optionIndex 
        ? 'border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500' 
        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50';
    }
    
    if (optionIndex === question.correctAnswer) {
      return 'border-green-500 bg-green-50 ring-1 ring-green-500';
    }
    
    if (selectedOption === optionIndex && optionIndex !== question.correctAnswer) {
      return 'border-red-500 bg-red-50 ring-1 ring-red-500';
    }
    
    return 'border-gray-200 opacity-50';
  };
  
  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-medium text-gray-900">
        <span className="font-bold mr-2">{index + 1}.</span>
        {question.question}
      </h3>
      
      <div className="space-y-2">
        {question.options.map((option, optionIndex) => (
          <button
            key={optionIndex}
            className={`quiz-option group w-full flex items-center space-x-3 p-3 rounded-md border text-left transition-all focus:outline-none ${getOptionClass(optionIndex)}`}
            onClick={() => handleOptionSelect(optionIndex)}
            disabled={showResults}
          >
            <div className="flex-shrink-0">
              {selectedOption === optionIndex ? (
                <CheckCircle className={`h-5 w-5 check-icon transition-transform ${showResults && selectedOption !== question.correctAnswer ? 'text-red-500' : 'text-indigo-600'}`} />
              ) : (
                showResults && optionIndex === question.correctAnswer ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400 group-hover:text-indigo-500" />
                )
              )}
            </div>
            <span className="text-sm sm:text-base">{option}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default QuizQuestion;