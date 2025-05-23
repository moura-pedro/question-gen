import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 space-y-6">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700">Página Não Encontrada</h2>
      <p className="text-gray-600 max-w-md">
        A página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/" className="btn btn-primary">
        <Home className="h-4 w-4 mr-2" />
        Voltar para o Início
      </Link>
    </div>
  );
};

export default NotFoundPage;