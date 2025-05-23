import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizContextType {
  questions: QuizQuestion[];
  answers: Record<number, number>;
  currentQuestion: number;
  loading: boolean;
  isUploading: boolean;
  uploadProgress: number;
  error: string | null;
  score: number;
  showResults: boolean;
  quizStarted: boolean;
  quizCompleted: boolean;
  uploadFile: (file: File) => Promise<void>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  handleAnswerSelect: (questionIndex: number, optionIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  startQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Reset progress when new questions are loaded
    if (questions.length > 0) {
      setCurrentQuestion(0);
      setAnswers({});
      setScore(0);
      setShowResults(false);
      setQuizCompleted(false);
    }
  }, [questions]);

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 200);
    
    return () => clearInterval(interval);
  };

  const uploadFile = async (file: File): Promise<void> => {
    if (!file) {
      toast.error('Por favor, selecione um arquivo para enviar');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    
    const cleanupProgressSimulation = simulateUploadProgress();
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar o arquivo');
      }
      
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error('Formato de resposta inválido do servidor');
      }
      
      setUploadProgress(100);
      setQuestions(data.questions);
      toast.success('Questões geradas com sucesso');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido');
      toast.error('Falha ao gerar questões');
    } finally {
      cleanupProgressSimulation();
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setShowResults(true);
    setQuizCompleted(true);
    navigate('/results');
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
    setQuizStarted(false);
    setQuizCompleted(false);
    navigate('/');
  };

  const startQuiz = () => {
    setQuizStarted(true);
    navigate('/quiz');
  };

  const value = {
    questions,
    answers,
    currentQuestion,
    loading,
    isUploading,
    uploadProgress,
    error,
    score,
    showResults,
    quizStarted,
    quizCompleted,
    uploadFile,
    setAnswers,
    handleAnswerSelect,
    nextQuestion,
    prevQuestion,
    submitQuiz,
    resetQuiz,
    startQuiz
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};