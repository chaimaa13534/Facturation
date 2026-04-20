import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';
import { firebaseService } from "../../services/firebaseService";
import { jsonService } from "../../services/jsonService";
import { factureValidators } from "../../utils/factureValidators";

import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  TextField,
  IconButton,
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import CalculateRoundedIcon from "@mui/icons-material/CalculateRounded";

const CreateFacture = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [clients, setClients] = useState([]);
  const [articlesDb, setArticlesDb] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activeStep, setActiveStep] = useState(0);

  const [selectedClient, setSelectedClient] = useState("");

  const [totaux, setTotaux] = useState({ ht: 0, tva: 0, ttc: 0 });

  const [lignes, setLignes] = useState([
    { id: Date.now(), articleId: "", designation: "", prix_unitaire: 0, qte: 1 }
  ]);

  const [validationErrors, setValidationErrors] = useState([]);


  useEffect(() => {
    const errors = validateFacture();
    setValidationErrors(errors);
  }, [selectedClient, lignes, totaux, clients]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const clientsData = await firebaseService.getClients();
        setClients(clientsData);
      } catch (error) {
        setSnackbar({ open: true, message: 'Erreur lors du chargement des clients', severity: 'error' });
      }

      try {
        const articlesData = await jsonService.getArticles();
        setArticlesDb(articlesData);
      } catch (error) {
        setSnackbar({ open: true, message: 'Erreur lors du chargement des articles (API JSON)', severity: 'warning' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateFacture = () => {
    const factureData = {
      client_id: selectedClient,
      articles: lignes.filter(l => l.articleId),
      total_ht: totaux.ht,
      tva: totaux.tva,
      total_ttc: totaux.ttc
    };

    return factureValidators.validateFactureData(factureData, clients);
  };

  useEffect(() => {
    let ht = 0;
    lignes.forEach((ligne) => {
      ht += ligne.prix_unitaire * ligne.qte;
    });
    const tva = ht * 0.2;
    setTotaux({
      ht,
      tva,
      ttc: ht + tva
    });
  }, [lignes]);

  const handleAddLigne = () => {
    setLignes([
      ...lignes,
      { id: Date.now(), articleId: "", designation: "", prix_unitaire: 0, qte: 1 }
    ]);
  };

  const handleRemoveLigne = (id) => {
    if (lignes.length > 1) {
      setLignes(lignes.filter((l) => l.id !== id));
    }
  };

  const handleArticleChange = (index, articleId) => {
    const selectedArticle = articlesDb.find((a) => String(a.id) === String(articleId));

    const newLignes = [...lignes];
    newLignes[index] = {
      ...newLignes[index],
      articleId: String(articleId),
      designation: selectedArticle ? selectedArticle.designation : "",
      prix_unitaire: selectedArticle ? Number(selectedArticle.prix_unitaire) : 0
    };
    setLignes(newLignes);
  };

  const handleQteChange = (index, qte) => {
    const newLignes = [...lignes];
    newLignes[index].qte = Number(qte);
    setLignes(newLignes);
  };

  const handleSaveFacture = async () => {
    // Validation complète
    const validationErrors = validateFacture();

    if (validationErrors.length > 0) {
      setSnackbar({
        open: true,
        message: `Erreurs de validation:\n${validationErrors.join('\n')}`,
        severity: 'error'
      });
      return;
    }

    try {
      setSaving(true);
      const factureData = {
        numero: `F${Date.now().toString().slice(-6)}`,
        client_id: selectedClient,
        articles: lignes.filter(l => l.articleId), // Only save lines with articles
        total_ht: totaux.ht,
        tva: totaux.tva,
        total_ttc: totaux.ttc,
        statut: "En attente",
        date_creation: new Date().toISOString()
      };

      await firebaseService.addFacture(factureData);
      setSnackbar({ open: true, message: 'Facture créée avec succès', severity: 'success' });

      setTimeout(() => {
        navigate("/user/factures");
      }, 1500);
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la création de la facture', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const steps = ['Client', 'Articles', 'Récapitulatif'];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ p: { xs: 2, md: 4 }, background: isDark ? '#1e293b' : '#f8fafc', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => navigate("/user/factures")}
            sx={{
              mb: 2,
              textTransform: 'none',
              color: 'primary.main',
              '&:hover': { backgroundColor: 'rgba(37, 99, 235, 0.1)' }
            }}
          >
            Retour aux factures
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ReceiptLongRoundedIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a' }}>
              Nouvelle Facture
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Paper
          sx={{
            p: 4,
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            background: isDark ? 'linear-gradient(135deg, #334155 0%, #475569 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            color: isDark ? '#f1f5f9' : '#0f172a'
          }}
        >
          {/* Step 1: Client Selection */}
          {activeStep === 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PersonRoundedIcon sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Sélection du client
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 4 }}>
                <InputLabel>Client</InputLabel>
                <Select
                  value={selectedClient}
                  label="Client"
                  onChange={(e) => setSelectedClient(e.target.value)}
                  sx={{ borderRadius: '12px' }}
                  disabled={clients.length === 0}
                  error={validationErrors.some(error => error.includes('client'))}
                >
                  {clients.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{c.nom}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {c.email}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {clients.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Aucun client trouvé. Veuillez ajouter un client avant de créer une facture.
                  </Typography>
                )}
                {validationErrors.some(error => error.includes('client')) && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {validationErrors.find(error => error.includes('client'))}
                  </Typography>
                )}
              </FormControl>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(1)}
                  disabled={!selectedClient}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Suivant
                </Button>
              </Box>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <ShoppingCartRoundedIcon sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Sélection des articles
                </Typography>
              </Box>

              {articlesDb.length === 0 ? (
                <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                  Impossible de charger la référence des articles. Démarrez le service JSON (`npm run server`) et rechargez.
                </Typography>
              ) : null}

              {validationErrors.some(error => error.includes('article')) && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    {validationErrors.filter(error => error.includes('article') || error.includes('Ligne')).join('\n')}
                  </Typography>
                </Alert>
              )}

              {lignes.map((ligne, index) => (
              <Card key={ligne.id} sx={{ mb: 2, borderRadius: '12px', backgroundColor: isDark ? '#475569' : '#ffffff' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                          <InputLabel>Article</InputLabel>
                          <Select
                            value={ligne.articleId}
                            label="Article"
                            onChange={(e) => handleArticleChange(index, e.target.value)}
                            sx={{ borderRadius: '8px' }}
                            disabled={articlesDb.length === 0}
                          >
                            {articlesDb.map((a) => (
                              <MenuItem key={a.id} value={a.id}>
                                <Box>
                                  <Typography sx={{ fontWeight: 600 }}>{a.designation}</Typography>
                                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {a.prix_unitaire} € HT
                                  </Typography>
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="Prix U. HT"
                          type="number"
                          value={ligne.prix_unitaire}
                          disabled
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="Quantité"
                          type="number"
                          value={ligne.qte}
                          onChange={(e) => handleQteChange(index, e.target.value)}
                          inputProps={{ min: 1 }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Grid>

                      <Grid item xs={12} md={2}>
                        <TextField
                          fullWidth
                          label="Total HT"
                          value={(ligne.prix_unitaire * ligne.qte).toFixed(2) + ' €'}
                          disabled
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                        />
                      </Grid>

                      <Grid item xs={12} md={1}>
                        <IconButton
                          onClick={() => handleRemoveLigne(ligne.id)}
                          disabled={lignes.length === 1}
                          sx={{
                            color: "#ef4444",
                            "&:hover": {
                              background: "rgba(239, 68, 68, 0.1)",
                            }
                          }}
                        >
                          <DeleteRoundedIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}

              <Button
                startIcon={<AddRoundedIcon />}
                onClick={handleAddLigne}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  mb: 4,
                  borderRadius: '12px'
                }}
              >
                Ajouter un article
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={() => setActiveStep(0)}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Précédent
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setActiveStep(2)}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Suivant
                </Button>
              </Box>
            </Box>
          )}

          {/* Step 3: Summary */}
          {activeStep === 2 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <CalculateRoundedIcon sx={{ fontSize: 24, color: 'primary.main', mr: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Récapitulatif de la facture
                </Typography>
              </Box>

             
              {validationErrors.length > 0 && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Erreurs à corriger :
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {validationErrors.map((error, index) => (
                      <li key={index}>
                        <Typography variant="body2">{error}</Typography>
                      </li>
                    ))}
                  </Box>
                </Alert>
              )}

          
              <Card sx={{ mb: 3, borderRadius: '12px', backgroundColor: isDark ? '#475569' : '#ffffff' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Client sélectionné
                  </Typography>
                  {(() => {
                    const client = clients.find(c => c.id === selectedClient);
                    return client ? (
                      <Box>
                        <Typography sx={{ fontWeight: 600 }}>{client.nom}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {client.email} • {client.tel}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {client.adresse}
                        </Typography>
                      </Box>
                    ) : null;
                  })()}
                </CardContent>
              </Card>

           
              <Card sx={{ mb: 3, borderRadius: '12px', backgroundColor: isDark ? '#475569' : '#ffffff' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: isDark ? '#f1f5f9' : '#0f172a' }}>
                    Articles ({lignes.filter(l => l.articleId).length})
                  </Typography>
                  {lignes.filter(l => l.articleId).map((ligne, index) => (
                    <Box key={ligne.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                      <Typography>{ligne.designation}</Typography>
                      <Typography sx={{ fontWeight: 600 }}>
                        {ligne.qte} × {ligne.prix_unitaire.toFixed(2)} € = {(ligne.prix_unitaire * ligne.qte).toFixed(2)} €
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>

             
              <Card sx={{ mb: 4, borderRadius: '12px', background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>Total HT</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{totaux.ht.toFixed(2)} €</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography>TVA (20%)</Typography>
                    <Typography sx={{ fontWeight: 600 }}>{totaux.tva.toFixed(2)} €</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#2563eb" }}>
                      Total TTC
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#2563eb" }}>
                      {totaux.ttc.toFixed(2)} €
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  onClick={() => setActiveStep(1)}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5
                  }}
                >
                  Précédent
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveRoundedIcon />}
                  onClick={handleSaveFacture}
                  disabled={saving || validationErrors.length > 0}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    background: validationErrors.length > 0 ? 'grey.400' : "linear-gradient(135deg,#2563eb,#1d4ed8)",
                    boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
                    "&:hover": {
                      background: validationErrors.length > 0 ? 'grey.400' : "linear-gradient(135deg,#1d4ed8,#1e40af)",
                      transform: validationErrors.length > 0 ? 'none' : 'translateY(-2px)',
                      boxShadow: validationErrors.length > 0 ? 'none' : "0 10px 24px rgba(37,99,235,0.32)",
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {saving ? 'Création en cours...' : validationErrors.length > 0 ? 'Corriger les erreurs' : 'Créer la facture'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

     
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

export default CreateFacture;