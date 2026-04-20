import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { firebaseService } from "../../services/firebaseService";
import { generateInvoicePDF } from "../../utils/pdfGenerator";
import { exportFacturesExcel } from "../../utils/excelExport";

import {
  Button,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Fade,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TableChartIcon from "@mui/icons-material/TableChart";

const Factures = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

 
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState(null);
  const [trackingData, setTrackingData] = useState({
    statut: '',
    date_depot: '',
    date_encaissement: '',
    type_virement: ''
  });
  const [savingTracking, setSavingTracking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const facturesData = await firebaseService.getFactures();
        const clientsData = await firebaseService.getClients();

        setFactures(facturesData);
        setClients(clientsData);
        
        // Debug: vérifier la structure des données
        console.log('Sample facture:', facturesData[0]);
        console.log('Statut type:', typeof facturesData[0]?.statut, facturesData[0]?.statut);
      } catch (error) {
        console.error('❌ Factures loading error:', error);
        const errorMessage = error.message || 'Erreur inconnue lors du chargement des données';
        setSnackbar({ open: true, message: `❌ ${errorMessage}`, severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.nom : "Inconnu";
  };

  const getNormalizedStatus = (statut) => {
    if (typeof statut === 'string') {
      return statut;
    }
    if (typeof statut === 'object' && statut !== null) {
      return statut.label || statut.value || 'Inconnu';
    }
    return 'Inconnu';
  };

  const handleDownloadPDF = async (facture) => {
    try {
      const client = clients.find((c) => c.id === facture.client_id);
      generateInvoicePDF(facture, client);
      setSnackbar({ open: true, message: 'PDF généré avec succès', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la génération du PDF', severity: 'error' });
    }
  };

  const handleDeleteFacture = async (factureId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ? Cette action est irréversible.')) {
      try {
        await firebaseService.deleteFacture(factureId);
        setFactures(factures.filter(f => f.id !== factureId));
        setSnackbar({ open: true, message: 'Facture supprimée avec succès', severity: 'success' });
      } catch (error) {
        setSnackbar({ open: true, message: 'Erreur lors de la suppression de la facture', severity: 'error' });
      }
    }
  };

  const handleOpenTrackingDialog = (facture) => {
    setSelectedFacture(facture);
    setTrackingData({
      statut: facture.statut || '',
      date_depot: facture.date_depot || '',
      date_encaissement: facture.date_encaissement || '',
      type_virement: facture.type_virement || ''
    });
    setTrackingDialogOpen(true);
  };

  const handleCloseTrackingDialog = () => {
    setTrackingDialogOpen(false);
    setSelectedFacture(null);
    setTrackingData({
      statut: '',
      date_depot: '',
      date_encaissement: '',
      type_virement: ''
    });
  };

  const handleTrackingDataChange = (field, value) => {
    setTrackingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveTracking = async () => {
    if (!selectedFacture) return;

    try {
      setSavingTracking(true);
      await firebaseService.updateFactureTracking(selectedFacture.id, trackingData);
      
      
      setFactures(factures.map(f => 
        f.id === selectedFacture.id 
          ? { ...f, ...trackingData, date_mise_a_jour: new Date().toISOString() }
          : f
      ));
      
      setSnackbar({ open: true, message: 'Suivi de la facture mis à jour avec succès', severity: 'success' });
      handleCloseTrackingDialog();
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la mise à jour du suivi', severity: 'error' });
    } finally {
      setSavingTracking(false);
    }
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "Payée":
        return "success";
      case "En attente":
        return "warning";
      case "Rejetée":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: factures.length,
      payees: factures.filter(f => getNormalizedStatus(f.statut) === 'Payée').length,
      attente: factures.filter(f => getNormalizedStatus(f.statut) === 'En attente').length,
      rejetees: factures.filter(f => getNormalizedStatus(f.statut) === 'Rejetée').length,
      totalAmount: factures.reduce((sum, f) => sum + (f.total_ttc || 0), 0),
      paidAmount: factures.filter(f => getNormalizedStatus(f.statut) === 'Payée').reduce((sum, f) => sum + (f.total_ttc || 0), 0)
    };
    return stats;
  };

  const stats = getStatusStats();

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ p: { xs: 2, md: 4 }, background: isDark ? '#1e293b' : '#f8fafc', minHeight: '100vh' }}>
       


<Box
  display="flex"
  flexDirection={{ xs: 'column', md: 'row' }}
  justifyContent="space-between"
  alignItems={{ xs: 'flex-start', md: 'center' }}
  mb={4}
  gap={2}
>

  <Box>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <ReceiptLongRoundedIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
      <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>
        Gestion des Factures
      </Typography>
    </Box>
    <Typography sx={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '1.1rem' }}>
      Gérez et suivez toutes vos factures
    </Typography>
  </Box>

  
  <Box
    display="flex"
    gap={2}
    alignItems="center"
    justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
    width={{ xs: '100%', md: 'auto' }}
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
      }}
    >
      Exporter Excel
    </Button>

   
    <Button
      variant="contained"
      startIcon={<AddRoundedIcon />}
      onClick={() => navigate("/user/factures/create")}
      sx={{
        textTransform: "none",
        fontWeight: 700,
        px: 3,
        py: 1.5,
        borderRadius: "14px",
        background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
        boxShadow: "0 10px 24px rgba(37,99,235,0.25)",
        "&:hover": {
          background: "linear-gradient(135deg,#1d4ed8,#1e40af)",
          transform: 'translateY(-2px)',
          boxShadow: "0 12px 28px rgba(37,99,235,0.32)",
        },
        transition: 'all 0.3s ease',
      }}
    >
      Nouvelle facture
    </Button>
  </Box>
</Box>

        {/* Stats Cards */}
        {!loading && (
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: isDark ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: isDark ? '1px solid #475569' : '1px solid #e5e7eb',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>
                      {stats.total}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                      Total factures
                    </Typography>
                  </Box>
                  <ReceiptLongRoundedIcon sx={{ fontSize: 32, color: 'primary.main', opacity: 0.7 }} />
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: isDark ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: isDark ? '1px solid #475569' : '1px solid #e5e7eb',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'warning.main' }}>
                      {stats.attente}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                      En attente
                    </Typography>
                  </Box>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'warning.main', opacity: 0.7 }} />
                </Box>
              </Paper>

              <Paper
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  background: isDark ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: isDark ? '1px solid #475569' : '1px solid #e5e7eb',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary' }}>
                      {stats.totalAmount.toFixed(0)}€
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                      CA total
                    </Typography>
                  </Box>
                  <Box sx={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'primary.main', opacity: 0.7 }} />
                </Box>
              </Paper>
            </Box>
          </Box>
        )}

    
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
            backgroundColor: isDark ? '#334155' : '#ffffff'
          }}
        >
          <Table>
            <TableHead sx={{
              background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
              '& .MuiTableCell-head': {
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.95rem',
                borderBottom: 'none'
              }
            }}>
              <TableRow>
                <TableCell>N° Facture</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Montant TTC</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <CircularProgress sx={{ color: 'primary.main' }} />
                    <Typography sx={{ mt: 2, color: '#64748b' }}>
                      Chargement des factures...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : factures.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                    <ReceiptLongRoundedIcon sx={{ fontSize: 64, color: isDark ? '#64748b' : '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: isDark ? '#94a3b8' : '#64748b', mb: 1 }}>
                      Aucune facture trouvée
                    </Typography>
                    <Typography sx={{ color: isDark ? '#cbd5e1' : '#94a3b8', mb: 3 }}>
                      Créez votre première facture pour commencer
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddRoundedIcon />}
                      onClick={() => navigate("/user/factures/create")}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Créer une facture
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                factures.map((facture) => (
                  <TableRow
                    key={facture.id}
                    hover
                    sx={{
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: isDark ? '#475569' : '#f8fafc',
                        transform: 'scale(1.002)',
                      },
                      cursor: 'pointer',
                      backgroundColor: isDark ? '#334155' : '#ffffff'
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      {facture.numero}
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#cbd5e1' : '#374151' }}>
                      {new Date(facture.date_creation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#cbd5e1' : '#374151' }}>
                      {getClientName(facture.client_id)}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                      {facture.total_ttc?.toFixed(2)} €
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getNormalizedStatus(facture.statut)}
                        color={getStatusColor(getNormalizedStatus(facture.statut))}
                        size="small"
                        sx={{
                          fontWeight: 600,
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleDownloadPDF(facture)}
                        sx={{
                          color: "#0865f0",
                          "&:hover": {
                            background: "rgba(239, 68, 68, 0.1)",
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                        title="Télécharger PDF"
                      >
                        <PictureAsPdfRoundedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteFacture(facture.id)}
                        sx={{
                          color: "#dc2626",
                          "&:hover": {
                            background: "rgba(220, 38, 38, 0.1)",
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease',
                          ml: 1
                        }}
                        title="Supprimer la facture"
                      >
                        <DeleteRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

       
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default Factures;