import React from 'react';
import { Book, FileText, Upload, CheckCircle, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuiz } from '../context/QuizContext';
import FileUpload from '../components/quiz/FileUpload';

const HomePage: React.FC = () => {
  const { questions, startQuiz } = useQuiz();
  
  const features = [
    {
      icon: <FileText className="h-6 w-6 text-indigo-600" />,
      title: 'Envie Seu Material de Estudo',
      description: 'Envie qualquer documento PDF com seu conteúdo de estudo.',
    },
    {
      icon: <Brain className="h-6 w-6 text-indigo-600" />,
      title: 'Geração de Questões com IA',
      description: 'Nossa IA analisa seu conteúdo e cria questões de quiz relevantes.',
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-indigo-600" />,
      title: 'Teste Seu Conhecimento',
      description: 'Responda às questões e receba feedback imediato sobre seu entendimento.',
    },
  ];

  return (
    <div className="space-y-10">
      <section className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Gere Quizzes com IA <span className="text-indigo-600">Instantaneamente</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Envie seu material de estudo e deixe nossa IA criar questões personalizadas para testar seu conhecimento.
          </p>
        </motion.div>
      </section>
      
      <motion.section 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {features.map((feature, index) => (
          <div 
            key={index}
            className="card p-6 hover:shadow-md transition-shadow"
          >
            <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-full mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </motion.section>
      
      <motion.section 
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="card-header">
          <h2 className="text-lg font-medium text-gray-900">
            Envie Seu Documento
          </h2>
        </div>
        
        <div className="card-content">
          <FileUpload />
        </div>
      </motion.section>
      
      {questions.length > 0 && (
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={startQuiz}
            className="btn btn-primary btn-lg"
          >
            <Book className="h-5 w-5 mr-2" />
            Iniciar Quiz
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;