import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  CircularProgress,
  Tooltip,
  Fade,
  Badge,
  Stack,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import { geminiService } from "../services/geminiService";

const AIChatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour! 👋 Je suis votre assistant IA. Comment puis-je vous aider avec votre application de facturation?",
      sender: "AI",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === "" || loading) return;

    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: "USER",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      // Préparer les messages pour l'API OpenAI (format avec roles)
      const apiMessages = messages
        .filter((msg) => msg.sender !== "ERROR")
        .map((msg) => ({
          role: msg.sender === "USER" ? "user" : "assistant",
          content: msg.text,
        }));

      // Ajouter le nouveau message utilisateur
      apiMessages.push({
        role: "user",
        content: userMessage.text,
      });

      // Ajouter un contexte système
      const messagesWithContext = [
        {
          role: "system",
          content:
            "Tu es un assistant IA utile pour une application de gestion de factures. Tu aides les utilisateurs avec des questions sur la facturation, les produits, les clients et les fonctionnalités de l'application. Sois concis et précis dans tes réponses.",
        },
        ...apiMessages,
      ];

      const response = await openaiService.sendMessage(messagesWithContext);

      const aiMessage = {
        id: messages.length + 2,
        text: response,
        sender: "AI",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message);
      const errorMessage = {
        id: messages.length + 2,
        text: `❌ ${err.message}`,
        sender: "ERROR",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <Fade in={isOpen}>
      <Paper
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: { xs: "calc(100% - 40px)", sm: 420 },
          maxWidth: 420,
          height: 600,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
          borderRadius: 3,
          zIndex: 1300,
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "white",
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <SmartToyRoundedIcon fontSize="large" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Assistant IA
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Alimenté par Gemini
              </Typography>
            </Box>
          </Stack>
          <Tooltip title="Fermer">
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                color: "white",
                "&:hover": { background: "rgba(255,255,255,0.1)" },
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2.5,
            py: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            background: "white",
            backgroundImage: "radial-gradient(circle at 20% 50%, rgba(37, 99, 235, 0.05) 0%, transparent 50%)",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#cbd5e1",
              borderRadius: "4px",
              "&:hover": {
                background: "#94a3b8",
              },
            },
          }}
        >
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: msg.sender === "USER" ? "flex-end" : "flex-start",
                gap: 1,
              }}
            >
              <Paper
                sx={{
                  maxWidth: "85%",
                  px: 2.5,
                  py: 1.5,
                  background:
                    msg.sender === "USER"
                      ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
                      : msg.sender === "ERROR"
                      ? "#fee2e2"
                      : "#f0f9ff",
                  color:
                    msg.sender === "USER"
                      ? "white"
                      : msg.sender === "ERROR"
                      ? "#7f1d1d"
                      : "#1e293b",
                  borderRadius: 2.5,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {msg.text}
                </Typography>
              </Paper>
            </Box>
          ))}
          {loading && (
            <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1, alignItems: "center" }}>
              <CircularProgress size={20} sx={{ color: "#2563eb" }} />
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                L'IA réfléchit...
              </Typography>
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          sx={{
            p: 2,
            background: "white",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Posez votre question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            multiline
            maxRows={3}
            sx={{
              "& .MuiOutlinedInput-root": {
                background: "#f9fafb",
                borderRadius: 2,
                "&:hover": {
                  background: "#f3f4f6",
                },
              },
            }}
          />
          <Tooltip title={loading ? "En cours..." : "Envoyer"}>
            <span>
              <IconButton
                onClick={handleSendMessage}
                disabled={loading || input.trim() === ""}
                sx={{
                  background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                  color: "white",
                  "&:hover": {
                    background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                  },
                  "&:disabled": {
                    background: "#cbd5e1",
                  },
                }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : <SendRoundedIcon />}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Paper>
    </Fade>
  );
};

export default AIChatbot;
