// Backend básico com Express e OpenAI API
require('dotenv').config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { OpenAI } = require("openai");
const cors = require("cors");

const app = express();

// Configure multer for memory storage instead of disk storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'https://gen-questions-frontend.vercel.app'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add body parser middleware
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    console.log("Received file upload request");
    
    if (!req.file) {
      console.log("No file was uploaded");
      return res.status(400).json({ error: "Nenhum arquivo foi enviado." });
    }

    console.log("File received:", req.file.originalname);
    
    const fileBuffer = req.file.buffer;
    console.log("File size:", fileBuffer.length, "bytes");

    const data = await pdfParse(fileBuffer);
    console.log("PDF parsed successfully");
    
    const text = data.text.slice(0, 4000).trim();
    console.log("Text extracted, length:", text.length);

    if (!text || text.length < 100) {
      console.log("Text too short or invalid");
      return res.status(400).json({ error: "Texto muito curto ou inválido." });
    }

    console.log("Sending text to OpenAI");
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { 
          role: "system", 
          content: "Você é um professor especialista. Retorne as questões em formato JSON com a seguinte estrutura: { questions: [{ question: string, options: string[], correctAnswer: number }] }" 
        },
        { 
          role: "user", 
          content: `Gere 5 questões de múltipla escolha com base no conteúdo abaixo. Retorne APENAS o JSON, sem texto adicional:\n\n${text}` 
        }
      ]
    });

    const questionsJson = completion.choices[0]?.message?.content;
    console.log("Questions generated successfully");
    
    try {
      const questions = JSON.parse(questionsJson);
      res.json({ questions: questions.questions });
    } catch (error) {
      console.error("Error parsing questions JSON:", error);
      res.status(500).json({ 
        error: "Erro ao processar as questões.",
        details: "Formato inválido das questões retornadas pela IA."
      });
    }

  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({ 
      error: "Erro interno ao processar o arquivo.",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Use the port provided by Render or fallback to 3001
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});