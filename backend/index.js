// Backend básico com Express e OpenAI API
require('dotenv').config();
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { OpenAI } = require("openai");

const app = express();
const upload = multer({ dest: "uploads/" });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Add CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post("/api/analyze", upload.single("file"), async (req, res) => {
  try {
    console.log("Received file upload request");
    
    if (!req.file) {
      console.log("No file was uploaded");
      return res.status(400).send({ error: "Nenhum arquivo foi enviado." });
    }

    console.log("File received:", req.file);

    const filePath = req.file.path;
    console.log("Reading file from:", filePath);
    
    const fileBuffer = fs.readFileSync(filePath);
    console.log("File size:", fileBuffer.length, "bytes");

    const data = await pdfParse(fileBuffer);
    console.log("PDF parsed successfully");
    
    const text = data.text.slice(0, 4000).trim();
    console.log("Text extracted, length:", text.length);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);
    console.log("Temporary file cleaned up");

    if (!text || text.length < 100) {
      console.log("Text too short or invalid");
      return res.status(400).send({ error: "Texto muito curto ou inválido." });
    }

    console.log("Sending text to OpenAI");
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Você é um professor especialista. Retorne as questões em formato JSON com a seguinte estrutura: { questions: [{ question: string, options: string[], correctAnswer: number }] }" },
        { role: "user", content: `Gere 5 questões de múltipla escolha com base no conteúdo abaixo. Retorne APENAS o JSON, sem texto adicional:\n\n${text}` }
      ]
    });

    const questionsJson = completion.choices[0]?.message?.content;
    console.log("Questions generated successfully");
    
    try {
      const questions = JSON.parse(questionsJson);
      res.send({ questions: questions.questions });
    } catch (error) {
      console.error("Error parsing questions JSON:", error);
      res.status(500).send({ 
        error: "Erro ao processar as questões.",
        details: "Formato inválido das questões retornadas pela IA."
      });
    }

  } catch (error) {
    console.error("Detailed error:", error);
    // Send more detailed error information
    res.status(500).send({ 
      error: "Erro interno ao processar o arquivo.",
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
  });