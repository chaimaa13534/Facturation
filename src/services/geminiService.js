import axios from "axios";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

// Configuration du retry avec backoff exponentiel
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 seconde
const MAX_DELAY = 32000; // 32 secondes

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const geminiService = {
  async sendMessage(messages, retryCount = 0) {
    if (!GEMINI_API_KEY) {
      throw new Error("Clé API Gemini non configurée. Veuillez ajouter VITE_GEMINI_API_KEY dans le fichier .env");
    }

    // Construire l'URL complète
    const url = `${GEMINI_BASE_URL}/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

    try {
      // Convertir le format OpenAI vers Gemini
      const geminiContents = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await axios.post(
        url,
        {
          contents: geminiContents,
          generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000, // 30 secondes timeout
        }
      );

      // Extraire la réponse Gemini
      const content = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error("Réponse Gemini malformée");
      }

      return content;
    } catch (error) {
      console.error("Erreur Gemini complète:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        retryCount,
      });

      // Messages d'erreur détaillés
      if (error.response?.status === 400) {
        throw new Error("❌ Requête invalide. Vérifiez le format des messages.");
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error("❌ Clé API invalide ou sans permissions. Vérifiez votre clé dans le fichier .env");
      }

      if (error.response?.status === 429) {
        // Rate limit - retry avec backoff exponentiel
        if (retryCount < MAX_RETRIES) {
          const delay = Math.min(INITIAL_DELAY * Math.pow(2, retryCount), MAX_DELAY);
          const waitSeconds = Math.round(delay / 1000);
          
          console.warn(`⏳ Rate limit détecté. Attente de ${waitSeconds}s avant nouvelle tentative (${retryCount + 1}/${MAX_RETRIES})...`);
          await sleep(delay);
          
          // Retry automatique
          return this.sendMessage(messages, retryCount + 1);
        } else {
          throw new Error("⏳ Limite d'utilisation atteinte. Réessayez dans quelques minutes ou vérifiez votre quota API.");
        }
      }

      if (error.response?.status >= 500) {
        throw new Error("🔥 Serveur Gemini en erreur. Réessayez plus tard.");
      }

      throw new Error(
        error.response?.data?.error?.message ||
        error.message ||
        "Erreur lors de la communication avec Gemini"
      );
    }
  },
};
