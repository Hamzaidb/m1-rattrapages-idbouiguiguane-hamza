import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;

  console.log("Requête reçue avec les messages :", messages);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5.4",
        messages
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur API OpenAI : ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Réponse de l'API OpenAI :", data);

    if (!data.choices || data.choices.length === 0) {
      throw new Error("Aucune réponse valide reçue de l'API OpenAI.");
    }

    res.json(data);
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API OpenAI :", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});