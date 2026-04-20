import axios from "axios";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Configuration du retry avec backoff exponentiel
const MAX_RETRIES = 3;
const INITIAL_DELAY = 1000; // 1 seconde
const MAX_DELAY = 32000; // 32 secondes

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const openaiService = {
  async sendMessage(messages, retryCount = 0) {
    if (!OPENAI_API_KEY) {
      throw new Error("Clé API OpenAI non configurée. Veuillez ajouter VITE_OPENAI_API_KEY dans le fichier .env");
    }

    try {
      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: "gpt-3.5-turbo",
          messages: messages,
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          timeout: 30000, // 30 secondes timeout
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error("Erreur OpenAI complète:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        retryCount,
      });

      // Messages d'erreur détaillés
      if (error.response?.status === 401) {
        throw new Error("❌ Clé API invalide ou expirée. Vérifiez votre clé dans le fichier .env");
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

      if (error.response?.status === 500) {
        throw new Error("🔥 Serveur OpenAI en erreur. Réessayez plus tard.");
      }

      if (error.response?.status === 429) {
        throw new Error("⏳ Limite d'utilisation de l'API. Vérifiez les limites de votre plan OpenAI.");
      }

      throw new Error(
        error.response?.data?.error?.message ||
        error.message ||
        "Erreur lors de la communication avec OpenAI"
      );
    }
  },
};
