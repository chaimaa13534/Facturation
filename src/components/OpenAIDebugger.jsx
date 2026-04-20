import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Code,
} from "@mui/material";
import { openaiService } from "../services/openaiService";

const OpenAIDebugger = () => {
  const [testMessage, setTestMessage] = useState("Bonjour, es-tu là?");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENAI_API_KEY || "NOT FOUND");

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await openaiService.sendMessage([
        {
          role: "system",
          content: "Tu es un assistant IA utile.",
        },
        {
          role: "user",
          content: testMessage,
        },
      ]);

      setResponse(result);
    } catch (err) {
      setError({
        message: err.message,
        full: JSON.stringify(err, null, 2),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        🔧 OpenAI Debug
      </Typography>

      {/* Clé API */}
      <Paper sx={{ p: 3, mb: 3, background: "#f3f4f6" }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Clé API
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: "monospace",
            wordBreak: "break-all",
            color: apiKey === "NOT FOUND" ? "#dc2626" : "#059669",
            fontSize: "0.85rem",
          }}
        >
          {apiKey === "NOT FOUND" ? "❌ NON TROUVÉE" : `${apiKey.substring(0, 20)}...`}
        </Typography>
      </Paper>

      {/* Champs de test */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Message de test
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Entrez un message de test..."
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleTest}
          disabled={loading || apiKey === "NOT FOUND"}
          sx={{
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            textTransform: "none",
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Tester"}
        </Button>
      </Paper>

      {/* Réponse */}
      {response && (
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            ✅ Succès
          </Typography>
          <Typography variant="body2">{response}</Typography>
        </Alert>
      )}

      {/* Erreur */}
      {error && (
        <Box sx={{ mb: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              ❌ Erreur
            </Typography>
            <Typography variant="body2">{error.message}</Typography>
          </Alert>
          <Paper sx={{ p: 2, background: "#fef2f2", border: "1px solid #fecaca" }}>
            <Typography
              variant="caption"
              sx={{
                fontFamily: "monospace",
                fontSize: "0.75rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
                color: "#7f1d1d",
              }}
            >
              {error.full}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* Instructions */}
      <Paper sx={{ p: 3, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#1e40af" }}>
          📋 Dépannage
        </Typography>
        <Typography variant="body2" component="div" sx={{ "& ul": { pl: 2 } }}>
          <ul>
            <li>
              <strong>Clé non trouvée:</strong> Vérifiez que <code>.env</code> contient{" "}
              <code>VITE_OPENAI_API_KEY</code>
            </li>
            <li>
              <strong>Erreur d'authentification:</strong> La clé est invalide ou expirée
            </li>
            <li>
              <strong>Erreur de quota:</strong> Pas de crédits disponibles sur votre compte
            </li>
            <li>
              <strong>Redémarrer:</strong> Arrêtez et relancez le serveur après modifier{" "}
              <code>.env</code>
            </li>
          </ul>
        </Typography>
      </Paper>
    </Box>
  );
};

export default OpenAIDebugger;
