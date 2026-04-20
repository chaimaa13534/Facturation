import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  CircularProgress,
  Fade,
  Zoom
} from "@mui/material";

import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";

const Login = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { login, userRole } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },

    validationSchema: Yup.object({
      email: Yup.string().email("Email invalide").required("Requis"),
      password: Yup.string().required("Requis")
    }),

    onSubmit: async (values) => {
      try {
        setError("");
        setLoading(true);
        await login(values.email, values.password);

        navigate(userRole === "ADMIN" ? "/admin" : "/user");
      } catch {
        setError("Échec de la connexion. Vérifiez vos identifiants.");
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isDark 
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isDark
            ? 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            : 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          animation: 'float 20s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }}
    >
      <Container maxWidth="sm">
        <Zoom in={true} timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: "24px",
              background: isDark
                ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
                : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: isDark
                ? "0 32px 64px rgba(0, 0, 0, 0.4)"
                : "0 32px 64px rgba(0, 0, 0, 0.15)",
              border: isDark
                ? "1px solid rgba(255, 255, 255, 0.1)"
                : "1px solid rgba(255, 255, 255, 0.2)",
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #2563eb, #1d4ed8, #2563eb)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 3s ease-in-out infinite',
              },
              '@keyframes shimmer': {
                '0%': { backgroundPosition: '-200% 0' },
                '100%': { backgroundPosition: '200% 0' },
              }
            }}
          >
            {/* Logo Section */}
            <Fade in={true} timeout={1500}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mb: 4
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "24px",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 16px 32px rgba(37, 99, 235, 0.3)",
                    mb: 3,
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: '-2px',
                      borderRadius: '26px',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8, #60a5fa)',
                      zIndex: -1,
                      opacity: 0.5,
                    }
                  }}
                >
                  <BusinessRoundedIcon sx={{ color: "#fff", fontSize: 36 }} />
                </Box>

                <Typography
                  variant="h4"
                  align="center"
                  sx={{
                    fontWeight: 800,
                    color: isDark ? "#cbd5e1" : "#0f172a",
                    mb: 1,
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Facturation Pro
                </Typography>

                <Typography
                  align="center"
                  sx={{
                    color: isDark ? "#94a3b8" : "#64748b",
                    fontSize: '1.1rem',
                    fontWeight: 500
                  }}
                >
                  Connectez-vous à votre espace professionnel
                </Typography>
              </Box>
            </Fade>

            {error && (
              <Fade in={true}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: "12px",
                    fontWeight: 500
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            <form onSubmit={formik.handleSubmit}>
              <Fade in={true} timeout={1800}>
                <Box>
                  <TextField
                    fullWidth
                    label="Adresse Email"
                    name="email"
                    margin="normal"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailRoundedIcon sx={{ color: isDark ? "#94a3b8" : "#64748b" }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        color: isDark ? '#f1f5f9' : 'inherit',
                        '& fieldset': {
                          borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0, 0, 0, 0.1)'
                        }
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: isDark ? '#475569' : 'inherit'
                      },
                      '& .MuiFormHelperText-root': {
                        color: isDark ? '#f87171' : 'inherit'
                      }
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Mot de passe"
                    type="password"
                    name="password"
                    margin="normal"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    disabled={loading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockRoundedIcon sx={{ color: isDark ? "#94a3b8" : "#64748b" }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '14px',
                        color: isDark ? '#f1f5f9' : 'inherit',
                        '& fieldset': {
                          borderColor: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(0, 0, 0, 0.1)'
                        }
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: isDark ? '#475569' : 'inherit'
                      },
                      '& .MuiFormHelperText-root': {
                        color: isDark ? '#f87171' : 'inherit'
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mt: 2,
                      py: 1.8,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                      boxShadow: "0 12px 24px rgba(37, 99, 235, 0.25)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                        boxShadow: "0 16px 32px rgba(37, 99, 235, 0.32)",
                        transform: "translateY(-2px)",
                      },
                      "&:disabled": {
                        background: "#94a3b8",
                        color: "#ffffff",
                      }
                    }}
                    variant="contained"
                  >
                    {loading ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: 'white' }} />
                        Connexion en cours...
                      </Box>
                    ) : (
                      "Se connecter"
                    )}
                  </Button>
                </Box>
              </Fade>
            </form>

            
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
};

export default Login;