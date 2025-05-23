import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UploadAIQuestions() {
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Por favor, selecione um arquivo.");

    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setShowResults(false);
    setScore(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setQuestions(data.questions);
    } catch (err) {
      console.error("Erro ao processar o arquivo", err);
      alert("Erro ao processar o arquivo");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gerador de Questões com IA</h1>
      <Card className="mb-4">
        <CardContent className="p-4 space-y-4">
          <Input type="file" accept=".pdf" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={loading}>
            {loading ? "Processando..." : "Enviar e Gerar Questões"}
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-6">
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="space-y-2">
                <h3 className="font-medium">
                  {questionIndex + 1}. {question.question}
                </h3>
                <div className="space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <label
                      key={optionIndex}
                      className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
                        showResults
                          ? optionIndex === question.correctAnswer
                            ? "bg-green-100"
                            : answers[questionIndex] === optionIndex
                            ? "bg-red-100"
                            : ""
                          : answers[questionIndex] === optionIndex
                          ? "bg-blue-100"
                          : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        checked={answers[questionIndex] === optionIndex}
                        onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                        disabled={showResults}
                        className="mr-2"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            {!showResults && (
              <Button onClick={handleSubmit} className="w-full">
                Verificar Respostas
              </Button>
            )}

            {showResults && (
              <div className="text-center p-4 bg-gray-100 rounded">
                <p className="text-lg font-medium">
                  Sua pontuação: {score} de {questions.length}
                </p>
                <p className="text-sm text-gray-600">
                  {score === questions.length
                    ? "Parabéns! Você acertou todas as questões!"
                    : "Continue estudando para melhorar seu desempenho!"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
