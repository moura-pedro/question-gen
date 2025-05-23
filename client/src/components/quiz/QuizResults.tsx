import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

const QuizResults: React.FC = () => {
  const { questions, answers, score, resetQuiz } = useQuiz();
  const [showConfetti, setShowConfetti] = React.useState(false);
  const totalQuestions = questions.length;
  const percentageScore = Math.round((score / totalQuestions) * 100);
  const perfectScore = score === totalQuestions;
  
  useEffect(() => {
    if (perfectScore) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [perfectScore]);
  
  const getFeedbackMessage = () => {
    if (percentageScore >= 90) return "Excelente! Você dominou este material!";
    if (percentageScore >= 75) return "Ótimo trabalho! Você tem um bom entendimento.";
    if (percentageScore >= 60) return "Bom esforço! Continue estudando para melhorar.";
    return "Continue praticando! Revise o material e tente novamente.";
  };
  
  return (
    <div className="space-y-8">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
          <Award className="h-10 w-10 text-indigo-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Quiz Concluído!
        </h2>
        
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {getFeedbackMessage()}
        </p>
        
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100">
          <span className="text-xl font-bold text-gray-900">
            {score} / {totalQuestions}
          </span>
          <span className="mx-2 text-gray-400">|</span>
          <span className={`text-xl font-bold ${
            percentageScore >= 70 ? 'text-green-600' : 
            percentageScore >= 50 ? 'text-amber-600' : 'text-red-600'
          }`}>
            {percentageScore}%
          </span>
        </div>
      </motion.div>
      
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <h3 className="text-base font-medium text-gray-900">
            Resumo das Questões
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {questions.map((question, index) => {
            const isCorrect = answers[index] === question.correctAnswer;
            
            return (
              <div key={index} className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {index + 1}. {question.question}
                    </p>
                    
                    <div className="mt-2 text-sm">
                      <p className="text-gray-600">
                        <span className="font-medium">Sua resposta: </span>
                        <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                          {question.options[answers[index]]}
                        </span>
                      </p>
                      
                      {!isCorrect && (
                        <p className="text-gray-600 mt-1">
                          <span className="font-medium">Resposta correta: </span>
                          <span className="text-green-600">
                            {question.options[question.correctAnswer]}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={resetQuiz}
          className="btn btn-primary"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Iniciar Novo Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResults;