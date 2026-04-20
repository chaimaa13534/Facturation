import { useState, useEffect } from "react";
import { firebaseService } from "../../services/firebaseService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useTheme } from "@mui/material/styles";

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Fade,
  Alert,
  Snackbar,
  InputAdornment,
  Divider
} from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

const Clients = () => {
  const theme = useTheme();
  const [clients, setClients] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editClient, setEditClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await firebaseService.getClients();
      setClients(data);
    } catch (error) {
      console.error('Detailed error:', error);
      const errorMessage = error.message || 'Erreur inconnue lors du chargement des clients';
      setSnackbar({ open: true, message: `❌ ${errorMessage}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) return;

    try {
      setActionLoading(true);
      await firebaseService.deleteClient(id);
      await fetchClients();
      setSnackbar({ open: true, message: 'Client supprimé avec succès', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la suppression', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditClient(client);
    formik.setValues(client);
    setOpenModal(true);
  };

  const handleUpdate = async (values, resetForm) => {
    try {
      setActionLoading(true);
      await firebaseService.updateClient(editClient.id, values);
      await fetchClients();
      setOpenModal(false);
      setEditClient(null);
      resetForm();
      setSnackbar({ open: true, message: 'Client modifié avec succès', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Erreur lors de la modification', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { nom: "", email: "", tel: "", adresse: "" },

    validationSchema: Yup.object({
      nom: Yup.string().required("Le nom est requis"),
      email: Yup.string().email("Email invalide").required("Requis"),
      tel: Yup.string().required("Requis"),
      adresse: Yup.string().required("Requis")
    }),

    onSubmit: async (values, { resetForm }) => {
      if (editClient) {
        await handleUpdate(values, resetForm);
      } else {
        try {
          setActionLoading(true);
          await firebaseService.addClient(values);
          await fetchClients();
          setOpenModal(false);
          resetForm();
          setSnackbar({ open: true, message: 'Client ajouté avec succès', severity: 'success' });
        } catch (error) {
          setSnackbar({ open: true, message: 'Erreur lors de l\'ajout', severity: 'error' });
        } finally {
          setActionLoading(false);
        }
      }
    }
  });

  return (
    <Fade in={true} timeout={500}>
      <Box sx={{ p: { xs: 2, md: 4 }, background: theme.palette.mode === 'dark' ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", minHeight: "100vh" }}>
        
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
              <GroupsRoundedIcon sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 800, color: theme.palette.mode === 'dark' ? "#f1f5f9" : "#0f172a" }}>
                Gestion des Clients
              </Typography>
            </Box>
            <Typography sx={{ color: theme.palette.mode === 'dark' ? "#94a3b8" : "#64748b", fontSize: '1.1rem' }}>
              Gérez votre base de clients et leurs informations
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<PersonAddRoundedIcon />}
            onClick={() => {
              setEditClient(null);
              formik.resetForm();
              setOpenModal(true);
            }}
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
            Nouveau client
          </Button>
        </Box>

        
        {!loading && (
          <Box sx={{ mb: 4 }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: '16px',
                background: theme.palette.mode === 'dark' 
                  ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)" 
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: theme.palette.mode === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {clients.length}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.palette.mode === 'dark' ? "#94a3b8" : '#64748b', fontWeight: 500 }}>
                    {clients.length === 1 ? 'Client enregistré' : 'Clients enregistrés'}
                  </Typography>
                </Box>
                <Chip
                  label={`${clients.length} client${clients.length !== 1 ? 's' : ''}`}
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    px: 2,
                    py: 1,
                    borderRadius: '12px'
                  }}
                />
              </Box>
            </Paper>
          </Box>
        )}

    
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "20px",
            boxShadow: theme.palette.mode === 'dark' 
              ? "0 8px 32px rgba(0, 0, 0, 0.4)" 
              : "0 8px 32px rgba(0, 0, 0, 0.08)",
            overflow: 'hidden',
            background: theme.palette.mode === 'dark' ? "#1e293b" : "#ffffff"
          }}
        >
          <Table>
            <TableHead sx={{
              background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
              '& .MuiTableCell-head': {
                color: "#fff",
                fontWeight: 700,
                fontSize: '0.95rem',
                borderBottom: 'none'
              }
            }}>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Téléphone</TableCell>
                <TableCell>Adresse</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8, borderBottom: theme.palette.mode === 'dark' ? "1px solid #334155" : "1px solid #e2e8f0" }}>
                    <CircularProgress sx={{ color: 'primary.main' }} />
                    <Typography sx={{ mt: 2, color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b' }}>
                      Chargement des clients...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 8, borderBottom: theme.palette.mode === 'dark' ? "1px solid #334155" : "1px solid #e2e8f0" }}>
                    <GroupsRoundedIcon sx={{ fontSize: 64, color: theme.palette.mode === 'dark' ? '#475569' : '#cbd5e1', mb: 2 }} />
                    <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b', mb: 1 }}>
                      Aucun client trouvé
                    </Typography>
                    <Typography sx={{ color: theme.palette.mode === 'dark' ? '#64748b' : '#94a3b8', mb: 3 }}>
                      Commencez par ajouter votre premier client
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<PersonAddRoundedIcon />}
                      onClick={() => {
                        setEditClient(null);
                        formik.resetForm();
                        setOpenModal(true);
                      }}
                      sx={{
                        borderRadius: '12px',
                        textTransform: 'none',
                        fontWeight: 600
                      }}
                    >
                      Ajouter un client
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
                  <TableRow
                    key={client.id}
                    hover
                    sx={{
                      transition: "all 0.2s ease",
                      backgroundColor: theme.palette.mode === 'dark' ? "#1e293b" : "white",
                      "&:hover": {
                        background: theme.palette.mode === 'dark' ? "#334155" : "#f8fafc",
                        transform: 'scale(1.002)',
                      },
                      cursor: 'pointer',
                      borderBottom: theme.palette.mode === 'dark' ? "1px solid #334155" : "1px solid #e2e8f0"
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a' }}>
                      {client.nom}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#374151' }}>{client.email}</TableCell>
                    <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#374151' }}>{client.tel}</TableCell>
                    <TableCell sx={{ color: theme.palette.mode === 'dark' ? '#cbd5e1' : '#374151' }}>{client.adresse}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => handleEdit(client)}
                        sx={{
                          color: "#2563eb",
                          mr: 1,
                          "&:hover": {
                            background: "rgba(37, 99, 235, 0.1)",
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <EditRoundedIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(client.id)}
                        disabled={actionLoading}
                        sx={{
                          color: "#ef4444",
                          "&:hover": {
                            background: "rgba(239, 68, 68, 0.1)",
                            transform: 'scale(1.1)'
                          },
                          transition: 'all 0.2s ease'
                        }}
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

 
        <Dialog
          open={openModal}
          onClose={() => !actionLoading && setOpenModal(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: "24px",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.25)"
            }
          }}
        >
          <Box sx={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: '24px 24px 0 0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)'
              }}>
                <PersonAddRoundedIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Box>
                <Typography sx={{
                  fontWeight: 800,
                  color: 'white',
                  fontSize: '1.3rem'
                }}>
                  {editClient ? "Modifier le client" : "Nouveau client"}
                </Typography>
                <Typography sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.85rem',
                  fontWeight: 500
                }}>
                  {editClient ? "Mettez à jour les informations" : "Complétez votre base clients"}
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => !actionLoading && setOpenModal(false)}
              disabled={actionLoading}
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white'
                }
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <DialogContent dividers={false} sx={{
              p: 4,
              background: theme.palette.mode === 'dark' ? "#1e293b" : '#f8fafc'
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Nom Field */}
                <Box>
                  <Typography sx={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a',
                    mb: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <PersonRoundedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                    Nom complet / Entreprise
                  </Typography>
                  <TextField
                    fullWidth
                    name="nom"
                    placeholder="Ex: Jean Dupont ou SARL ABC"
                    value={formik.values.nom}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.nom && Boolean(formik.errors.nom)}
                    helperText={formik.touched.nom && formik.errors.nom}
                    disabled={actionLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonRoundedIcon sx={{ color: '#cbd5e1', fontSize: 22 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: theme.palette.mode === 'dark' ? '#334155' : 'white',
                        color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a',
                        fontSize: '0.95rem',
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#475569' : '#e2e8f0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb !important'
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: theme.palette.mode === 'dark' ? '#f87171' : undefined
                      }
                    }}
                  />
                </Box>

          
                <Box>
                  <Typography sx={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a',
                    mb: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <EmailRoundedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                    Adresse email
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    disabled={actionLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailRoundedIcon sx={{ color: '#cbd5e1', fontSize: 22 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: theme.palette.mode === 'dark' ? '#334155' : 'white',
                        color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a',
                        fontSize: '0.95rem',
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#475569' : '#e2e8f0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb !important'
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: theme.palette.mode === 'dark' ? '#f87171' : undefined
                      }
                    }}
                  />
                </Box>

     
                <Box>
                  <Typography sx={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a',
                    mb: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <PhoneRoundedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                    Téléphone
                  </Typography>
                  <TextField
                    fullWidth
                    name="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={formik.values.tel}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.tel && Boolean(formik.errors.tel)}
                    helperText={formik.touched.tel && formik.errors.tel}
                    disabled={actionLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneRoundedIcon sx={{ color: '#cbd5e1', fontSize: 22 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: theme.palette.mode === 'dark' ? '#334155' : 'white',
                        color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a',
                        fontSize: '0.95rem',
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#475569' : '#e2e8f0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb !important'
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: theme.palette.mode === 'dark' ? '#f87171' : undefined
                      }
                    }}
                  />
                </Box>

        
                <Box>
                  <Typography sx={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a',
                    mb: 1.2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <LocationOnRoundedIcon sx={{ fontSize: 20, color: '#2563eb' }} />
                    Adresse complète
                  </Typography>
                  <TextField
                    fullWidth
                    name="adresse"
                    placeholder="Rue, code postal, ville"
                    multiline
                    rows={3}
                    value={formik.values.adresse}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.adresse && Boolean(formik.errors.adresse)}
                    helperText={formik.touched.adresse && formik.errors.adresse}
                    disabled={actionLoading}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ mt: 1 }}>
                          <LocationOnRoundedIcon sx={{ color: '#cbd5e1', fontSize: 22 }} />
                        </InputAdornment>
                      )
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        background: theme.palette.mode === 'dark' ? '#334155' : 'white',
                        color: theme.palette.mode === 'dark' ? '#f1f5f9' : '#0f172a',
                        fontSize: '0.95rem',
                        '& fieldset': {
                          borderColor: theme.palette.mode === 'dark' ? '#475569' : '#e2e8f0'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2563eb !important'
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: theme.palette.mode === 'dark' ? '#f87171' : undefined
                      }
                    }}
                  />
                </Box>
              </Box>
            </DialogContent>

            <Divider sx={{ borderColor: theme.palette.mode === 'dark' ? '#334155' : 'inherit' }} />

            <DialogActions sx={{
              px: 4,
              py: 2.5,
              background: theme.palette.mode === 'dark' ? '#1e293b' : 'white',
              gap: 2,
              borderRadius: '0 0 24px 24px'
            }}>
              <Button
                onClick={() => setOpenModal(false)}
                disabled={actionLoading}
                sx={{
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: '12px',
                  px: 3,
                  py: 1.2,
                  color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                  '&:hover': {
                    background: theme.palette.mode === 'dark' ? '#334155' : '#f1f5f9'
                  }
                }}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={actionLoading}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  borderRadius: "12px",
                  px: 3.5,
                  py: 1.2,
                  background: "linear-gradient(135deg,#2563eb,#1d4ed8)",
                  boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
                  "&:hover": {
                    background: "linear-gradient(135deg,#1d4ed8,#1e40af)",
                    transform: 'translateY(-1px)',
                    boxShadow: "0 10px 24px rgba(37,99,235,0.32)",
                  },
                  transition: 'all 0.3s ease',
                  minWidth: '140px',
                  fontSize: '0.95rem'
                }}
              >
                {actionLoading ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  editClient ? "Modifier" : "Enregistrer"
                )}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

 
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

export default Clients;