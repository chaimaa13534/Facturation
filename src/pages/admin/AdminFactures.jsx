import { useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { firebaseService } from "../../services/firebaseService";
import { exportFacturesExcel } from "../../utils/excelExport";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Fade,
  Alert,
  Snackbar,
  Grid,
  Container,
  Paper,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import HourglassEmptyRoundedIcon from "@mui/icons-material/HourglassEmptyRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { KPICard, ModernAlert } from "../../components/UI";
import TableChartIcon from "@mui/icons-material/TableChart";

const AdminFactures = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });


  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);


  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const facturesData = await firebaseService.getFactures();
      const clientsData = await firebaseService.getClients();
      setFactures(facturesData);
      setClients(clientsData);
    } catch (error) {
      console.error("❌ Error loading factures:", error);
      setSnackbar({ open: true, message: "Erreur lors du chargement", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.nom : "Inconnu";
  };

  const getClientEmail = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.email : "N/A";
  };

  // Approuver une facture
  const handleApprove = async (factureId) => {
    try {
      setActionLoading(true);
      await firebaseService.updateFactureStatut(factureId, "Approuvée");
      setSnackbar({ open: true, message: " Facture approuvée", severity: "success" });
      await fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors de l'approbation", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      setSnackbar({ open: true, message: "Veuillez entrer une raison de refus", severity: "warning" });
      return;
    }

    try {
      setActionLoading(true);
      await firebaseService.updateFactureStatut(selectedFacture.id, "Rejetée");
      
      await firebaseService.updateFactureTracking(selectedFacture.id, {
        statut: "Rejetée",
        rejection_reason: rejectionReason,
        rejection_date: new Date().toISOString(),
      });

      setSnackbar({ open: true, message: " Facture rejetée", severity: "info" });
      setRejectDialogOpen(false);
      setRejectionReason("");
      await fetchData();
    } catch (error) {
      setSnackbar({ open: true, message: "Erreur lors du refus", severity: "error" });
    } finally {
      setActionLoading(false);
    }
  };

 
  const handleViewDetails = (facture) => {
    setSelectedFacture(facture);
    setDetailsDialogOpen(true);
  };


  const pendingFactures = factures.filter((f) => f.statut === "En attente");
  const approvedFactures = factures.filter((f) => f.statut === "Approuvée");
  const rejectedFactures = factures.filter((f) => f.statut === "Rejetée");

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography color="text.secondary">Chargement des factures...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ 
        p: { xs: 2, md: 4 }, 
        background: isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        minHeight: "100vh" 
      }}>
        <Container maxWidth="xl">
     


          <Box sx={{ mb: 5 }}>
<Box
  sx={{
    mb: 5,
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    justifyContent: "space-between",
    alignItems: { xs: "flex-start", md: "center" },
    gap: 2,
  }}
>
  {/* LEFT SIDE */}
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "12px",
        background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
      }}
    >
      <ReceiptLongRoundedIcon sx={{ fontSize: 28, color: "white" }} />
    </Box>

    <Box>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: isDark ? "#f1f5f9" : "#0f172a",
          lineHeight: 1.1,
        }}
      >
        Validation des Factures
      </Typography>
      <Typography
        sx={{
          color: isDark ? "#94a3b8" : "#64748b",
          fontSize: "0.95rem",
          fontWeight: 500,
        }}
      >
        Gérez et approuvez les factures en attente
      </Typography>
    </Box>
  </Box>


  <Box
    sx={{
      display: "flex",
      gap: 2,
      width: { xs: "100%", md: "auto" },
      justifyContent: { xs: "flex-start", md: "flex-end" },
    }}
  >
    <Button
      startIcon={<TableChartIcon />}
      onClick={() => exportFacturesExcel(factures, clients)}
      sx={{
        px: 2.5,
        py: 1.3,
        borderRadius: "14px",
        textTransform: "none",
        fontWeight: 700,
        fontSize: "0.9rem",

        // même style que page précédente
        background: isDark
          ? "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.15))"
          : "linear-gradient(135deg, #ecfdf5, #d1fae5)",

        color: "#059669",

        border: isDark
          ? "1px solid rgba(16,185,129,0.25)"
          : "1px solid #a7f3d0",

        backdropFilter: "blur(6px)",

        boxShadow: isDark
          ? "0 4px 20px rgba(16,185,129,0.15)"
          : "0 4px 12px rgba(16,185,129,0.12)",

        transition: "all 0.25s ease",

        "&:hover": {
          background: "linear-gradient(135deg, #10b981, #059669)",
          color: "#fff",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(16,185,129,0.35)",
        },

        "&:active": {
          transform: "translateY(0px)",
        },
      }}
    >
      Exporter Excel
    </Button>
  </Box>
</Box>
          </Box>

        
          <Grid container spacing={3} sx={{ mb: 5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="En Attente"
                value={pendingFactures.length}
                icon={HourglassEmptyRoundedIcon}
                color="warning"
                change={`${pendingFactures.length} à valider`}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Approuvées"
                value={approvedFactures.length}
                icon={CheckCircleOutlineRoundedIcon}
                color="success"
                change={`+${approvedFactures.length}`}
                trend="up"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Rejetées"
                value={rejectedFactures.length}
                icon={CancelRoundedIcon}
                color="error"
                change={rejectedFactures.length > 0 ? `${rejectedFactures.length} refusées` : "0"}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPICard
                title="Total Factures"
                value={factures.length}
                icon={TrendingUpRoundedIcon}
                color="primary"
                change={`${((approvedFactures.length / factures.length) * 100).toFixed(0)}% approuvées`}
                trend="up"
              />
            </Grid>
          </Grid>

          {/* Tableau des Factures en Attente */}
          {pendingFactures.length > 0 && (
            <Box sx={{ mb: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                  overflow: "hidden",
                  animation: "fadeIn 0.3s ease-out",
                  backgroundColor: isDark ? '#334155' : '#ffffff'
                }}
              >
                {/* Header Section */}
                <Box
                  sx={{
                    p: 3,
                    background: isDark ? 'linear-gradient(135deg, #475569 0%, #64748b 100%)' : 'linear-gradient(135deg, #fff5e6 0%, #fff9f0 100%)',
                    borderBottom: isDark ? '2px solid #64748b' : '2px solid #fbbf24',
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <HourglassEmptyRoundedIcon sx={{ fontSize: 28, color: "#f59e0b" }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#fef3c7' : '#92400e' }}>
                       {pendingFactures.length} Facture{pendingFactures.length > 1 ? "s" : ""} en Attente
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#fcd34d' : '#b45309', fontSize: "0.85rem", mt: 0.5 }}>
                      Action requise pour validation
                    </Typography>
                  </Box>
                </Box>

                {/* Tableau */}
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: isDark ? '#475569' : '#f8fafc', borderBottom: isDark ? '2px solid #64748b' : '2px solid #e2e8f0' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.9rem", py: 2 }}>
                          N° Facture
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.9rem" }}>
                          Client
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.9rem" }} align="right">
                          Montant
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.9rem" }}>
                          Date
                        </TableCell>
                        <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.9rem", textAlign: "center" }}>
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pendingFactures.map((facture) => (
                        <TableRow
                          key={facture.id}
                          sx={{
                            borderBottom: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                            backgroundColor: isDark ? '#334155' : '#ffffff',
                            transition: "all 0.2s ease",
                            "&:hover": {
                              bgcolor: isDark ? '#475569' : "rgba(59, 130, 246, 0.04)",
                              transform: "scale(1.01)",
                            },
                            "&:last-child td": { borderBottom: "none" },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', py: 2 }}>
                            {facture.numero || facture.id}
                          </TableCell>
                          <TableCell sx={{ color: isDark ? '#cbd5e1' : '#1e293b', fontWeight: 500 }}>
                            {getClientName(facture.client_id)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#60a5fa' : '#3b82f6', fontSize: "1rem" }}>
                            {facture.total_ttc?.toFixed(2)} €
                          </TableCell>
                          <TableCell sx={{ color: isDark ? '#cbd5e1' : '#64748b', fontSize: "0.9rem" }}>
                            {new Date(facture.date_creation).toLocaleDateString("fr-FR")}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center" }}>
                              <IconButton
                                size="small"
                                onClick={() => handleViewDetails(facture)}
                                sx={{
                                  color: isDark ? '#60a5fa' : '#3b82f6',
                                  bgcolor: isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                  "&:hover": {
                                    bgcolor: isDark ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                    transform: "scale(1.1)",
                                  },
                                }}
                                title="Voir détails"
                              >
                                <VisibilityRoundedIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleApprove(facture.id)}
                                disabled={actionLoading}
                                sx={{
                                  color: isDark ? '#34d399' : '#10b981',
                                  bgcolor: isDark ? 'rgba(52, 211, 153, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                  "&:hover": {
                                    bgcolor: isDark ? 'rgba(52, 211, 153, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                                    transform: "scale(1.1)",
                                  },
                                  "&:disabled": { opacity: 0.5 },
                                }}
                                title="Approuver"
                              >
                                <CheckRoundedIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setSelectedFacture(facture);
                                  setRejectDialogOpen(true);
                                }}
                                disabled={actionLoading}
                                sx={{
                                  color: isDark ? '#f87171' : '#ef4444',
                                  bgcolor: isDark ? 'rgba(248, 113, 113, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                  "&:hover": {
                                    bgcolor: isDark ? 'rgba(248, 113, 113, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                    transform: "scale(1.1)",
                                  },
                                  "&:disabled": { opacity: 0.5 },
                                }}
                                title="Rejeter"
                              >
                                <CloseRoundedIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          )}

       
          {pendingFactures.length === 0 && (
            <ModernAlert
              type="success"
              title=" Excellent!"
              message="Aucune facture en attente. Tous les dossiers sont à jour."
              sx={{ mb: 5 }}
            />
          )}

          <Grid container spacing={3}>
           
            {approvedFactures.length > 0 && (
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                    overflow: "hidden",
                    animation: "fadeIn 0.3s ease-out",
                    backgroundColor: isDark ? '#334155' : '#ffffff'
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      background: isDark ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' : 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)',
                      borderBottom: isDark ? '2px solid #34d399' : '2px solid #86efac',
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <CheckCircleOutlineRoundedIcon sx={{ fontSize: 28, color: isDark ? '#34d399' : '#10b981' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#d1fae5' : '#065f46' }}>
                        {approvedFactures.length} Facture{approvedFactures.length > 1 ? "s" : ""} Approuvée{approvedFactures.length > 1 ? "s" : ""}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#86efac' : '#047857', fontSize: "0.85rem", mt: 0.5 }}>
                        Prêtes pour l'encaissement
                      </Typography>
                    </Box>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: isDark ? '#475569' : '#f8fafc', borderBottom: isDark ? '2px solid #64748b' : '2px solid #e2e8f0' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.85rem" }}>
                            N° Facture
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.85rem" }}>
                            Client
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.85rem" }}>
                            Montant
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {approvedFactures.map((facture) => (
                          <TableRow
                            key={facture.id}
                            sx={{
                              borderBottom: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                              backgroundColor: isDark ? '#334155' : '#ffffff',
                              "&:hover": { bgcolor: isDark ? '#475569' : "rgba(16, 185, 129, 0.04)" },
                              "&:last-child td": { borderBottom: "none" },
                            }}
                          >
                            <TableCell sx={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a', py: 1.5 }}>
                              {facture.numero || facture.id}
                            </TableCell>
                            <TableCell sx={{ color: isDark ? '#cbd5e1' : '#64748b' }}>
                              {getClientName(facture.client_id)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#34d399' : '#10b981' }}>
                              {facture.total_ttc?.toFixed(2)} €
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}

            {rejectedFactures.length > 0 && (
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                    overflow: "hidden",
                    animation: "fadeIn 0.3s ease-out",
                    backgroundColor: isDark ? '#334155' : '#ffffff'
                  }}
                >
                  <Box
                    sx={{
                      p: 3,
                      background: isDark ? 'linear-gradient(135deg, #475569 0%, #64748b 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fef5f5 100%)',
                      borderBottom: isDark ? '2px solid #f87171' : '2px solid #fca5a5',
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <CancelRoundedIcon sx={{ fontSize: 28, color: isDark ? '#f87171' : '#ef4444' }} />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: isDark ? '#fecaca' : '#7f1d1d' }}>
                         {rejectedFactures.length} Facture{rejectedFactures.length > 1 ? "s" : ""} Rejetée{rejectedFactures.length > 1 ? "s" : ""}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#fca5a5' : '#991b1b', fontSize: "0.85rem", mt: 0.5 }}>
                        À réviser avec les clients
                      </Typography>
                    </Box>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead sx={{ bgcolor: isDark ? '#475569' : '#f8fafc', borderBottom: isDark ? '2px solid #64748b' : '2px solid #e2e8f0' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.85rem" }}>
                            N° Facture
                          </TableCell>
                          <TableCell sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.85rem" }}>
                            Client
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', fontSize: "0.85rem" }}>
                            Montant
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rejectedFactures.map((facture) => (
                          <TableRow
                            key={facture.id}
                            sx={{
                              borderBottom: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                              backgroundColor: isDark ? '#334155' : '#ffffff',
                              "&:hover": { bgcolor: isDark ? '#475569' : "rgba(239, 68, 68, 0.04)" },
                              "&:last-child td": { borderBottom: "none" },
                            }}
                          >
                            <TableCell sx={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a', py: 1.5 }}>
                              {facture.numero || facture.id}
                            </TableCell>
                            <TableCell sx={{ color: isDark ? '#cbd5e1' : '#64748b' }}>
                              {getClientName(facture.client_id)}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: isDark ? '#f87171' : '#ef4444' }}>
                              {facture.total_ttc?.toFixed(2)} €
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>

   
          <Dialog
            open={detailsDialogOpen}
            onClose={() => setDetailsDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                backgroundColor: isDark ? '#334155' : '#ffffff'
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, bgcolor: isDark ? '#475569' : '#f8fafc', borderBottom: isDark ? '1px solid #64748b' : '1px solid #e2e8f0', color: isDark ? '#f1f5f9' : '#0f172a' }}>
               Détails de la Facture
            </DialogTitle>
            <DialogContent sx={{ pt: 3, backgroundColor: isDark ? '#334155' : '#ffffff' }}>
              {selectedFacture && (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, mb: 0.5 }}>
                      N° Facture
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      {selectedFacture.numero || selectedFacture.id}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: isDark ? '#475569' : '#f8fafc', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, mb: 1 }}>
                      Client
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      {getClientName(selectedFacture.client_id)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#60a5fa' : '#3b82f6', mt: 0.5 }}>
                      {getClientEmail(selectedFacture.client_id)}
                    </Typography>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: isDark ? '#475569' : '#f0fdf4', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, mb: 1 }}>
                      Montant Total
                    </Typography>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: isDark ? '#34d399' : '#10b981' }}>
                      {selectedFacture.total_ttc?.toFixed(2)} €
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, mb: 1 }}>
                      Articles ({selectedFacture.articles?.length || 0})
                    </Typography>
                    <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
                      {selectedFacture.articles?.map((art, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            p: 1.5,
                            mb: 1,
                            bgcolor: isDark ? '#475569' : '#f8fafc',
                            borderRadius: 1,
                            borderLeft: isDark ? '3px solid #60a5fa' : '3px solid #3b82f6',
                          }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                            {art.designation}
                          </Typography>
                          <Typography variant="caption" sx={{ color: isDark ? '#cbd5e1' : '#64748b', display: "block", mt: 0.5 }}>
                            {art.qte} x {art.prix_unitaire?.toFixed(2)} € = {(art.qte * art.prix_unitaire)?.toFixed(2)} €
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box sx={{ p: 2, bgcolor: isDark ? '#475569' : '#f1f5f9', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600, mb: 0.5 }}>
                      Date de Création
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      {new Date(selectedFacture.date_creation).toLocaleDateString("fr-FR")}
                    </Typography>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: isDark ? '#475569' : '#f8fafc', borderTop: isDark ? '1px solid #64748b' : '1px solid #e2e8f0' }}>
              <Button onClick={() => setDetailsDialogOpen(false)}>Fermer</Button>
            </DialogActions>
          </Dialog>

     
          <Dialog
            open={rejectDialogOpen}
            onClose={() => setRejectDialogOpen(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              sx: {
                borderRadius: 2,
                border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                backgroundColor: isDark ? '#334155' : '#ffffff'
              },
            }}
          >
            <DialogTitle sx={{ fontWeight: 700, bgcolor: isDark ? '#475569' : '#fef2f2', borderBottom: isDark ? '2px solid #f87171' : '2px solid #fca5a5', color: isDark ? '#fecaca' : '#7f1d1d' }}>
               Refuser la Facture
            </DialogTitle>
            <DialogContent sx={{ pt: 3, backgroundColor: isDark ? '#334155' : '#ffffff' }}>
              <ModernAlert
                type="warning"
                title="Attention"
                message="Vous êtes sur le point de refuser cette facture. Spécifiez la raison du refus."
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Expliquez les raisons du refus (motifs, anomalies, etc.)..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: isDark ? '#475569' : '#f8fafc',
                    color: isDark ? '#f1f5f9' : '#0f172a'
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    color: isDark ? '#94a3b8' : '#cbd5e1',
                    opacity: 1
                  }
                }}
              />
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: isDark ? '#475569' : '#f8fafc', borderTop: isDark ? '1px solid #64748b' : '1px solid #e2e8f0', gap: 1 }}>
              <Button onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason("");
              }}>
                Annuler
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: isDark ? '#f87171' : '#ef4444',
                  "&:hover": { backgroundColor: isDark ? '#dc2626' : '#dc2626' },
                }}
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? "Refus en cours..." : "Refuser la facture"}
              </Button>
            </DialogActions>
          </Dialog>

        
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </Fade>
  );
};

export default AdminFactures;
