import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, Upload, AlertCircle } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import ProgressBar from '../ui/ProgressBar';

const FileUpload: React.FC = () => {
  const { uploadFile, isUploading, uploadProgress, error } = useQuiz();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isUploading,
  });
  
  const handleUpload = async () => {
    if (selectedFile) {
      await uploadFile(selectedFile);
    }
  };
  
  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${isUploading ? 'opacity-60 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-3">
          {selectedFile ? (
            <FileText className="h-12 w-12 text-indigo-500" />
          ) : (
            <Upload className="h-12 w-12 text-gray-400" />
          )}
          
          <div className="space-y-1">
            <p className="text-base font-medium text-gray-900">
              {selectedFile ? selectedFile.name : 'Envie um documento PDF'}
            </p>
            <p className="text-sm text-gray-500">
              {selectedFile 
                ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB · PDF` 
                : 'Arraste e solte ou clique para procurar'}
            </p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="flex items-center text-sm text-red-600 bg-red-50 p-3 rounded-md">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {isUploading && (
        <div className="space-y-2">
          <ProgressBar progress={uploadProgress} />
          <p className="text-sm text-gray-500 text-center">
            Analisando documento e gerando questões...
          </p>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className={`btn btn-primary ${!selectedFile || isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Processando...' : 'Gerar Questões'}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;