import React, { useMemo, useState, useEffect } from "react";
import { useTheme } from '@mui/material/styles';
import { jsonService } from "../../services/jsonService";
import { getDarkModeColors } from "../../utils/darkModeColors";
import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  TextField,
  MenuItem,
  Stack,
  Divider,
  IconButton,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Fade
} from "@mui/material";

import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  inStock: true,
};

const Products = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const colors = getDarkModeColors(isDark);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [stockFilter, setStockFilter] = useState("all");
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const articlesData = await jsonService.getArticles();
        const categoriesData = await jsonService.getCategories();

        const adaptedProducts = articlesData.map((article) => ({
          id: article.id,
          name: article.designation,
          description: article.designation,
          price: Number(article.prix_unitaire) || 0,
          inStock: true,
          category:
            categoriesData.find((cat) => cat.id === article.categorie_id)?.nom ||
            "Non catégorisé",
        }));

        setProducts(adaptedProducts);
        setCategories(categoriesData);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Erreur lors du chargement des produits",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (stockFilter === "inStock") return products.filter((p) => p.inStock);
    if (stockFilter === "outOfStock") return products.filter((p) => !p.inStock);
    return products;
  }, [products, stockFilter]);

  const handleChange = (field) => (event) => {
    const value =
      field === "inStock"
        ? event.target.value === "true"
        : event.target.value;

    setFormData((prev) => ({
      ...prev,
      [field]: field === "price" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.description.trim()) return;

    if (viewMode === "edit" && editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, ...formData } : p
        )
      );
    } else {
      setProducts((prev) => [
        { id: Date.now(), ...formData },
        ...prev,
      ]);
    }

    resetForm();
    setViewMode("list");
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData(product);
    setViewMode("edit");
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: 4, background: colors.background.primary, minHeight: '100vh' }}>
       
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
          <Typography variant="h4" fontWeight={800} sx={{ color: colors.text.primary }}>
            Gestion des Produits
          </Typography>
          {viewMode === "list" ? (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={() => setViewMode("add")}
              sx={{
                backgroundColor: '#2563eb',
                "&:hover": { backgroundColor: '#1d4ed8' }
              }}
            >
              Ajouter
            </Button>
          ) : (
            <Button
              startIcon={<ArrowBackRoundedIcon />}
              onClick={() => setViewMode("list")}
              sx={{ color: colors.text.primary }}
            >
              Retour
            </Button>
          )}
        </Box>
        {(viewMode === "add" || viewMode === "edit") && (
          <Paper sx={{
            p: 3,
            backgroundColor: colors.card.background,
            border: `1px solid ${colors.card.border}`,
            mb: 3
          }}>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Nom"
                    fullWidth
                    value={formData.name}
                    onChange={handleChange("name")}
                    slotProps={{
                      input: {
                        sx: {
                          backgroundColor: colors.input.background,
                          color: colors.input.text,
                          '& fieldset': { borderColor: colors.input.border },
                          '&:hover fieldset': { borderColor: colors.input.border },
                          '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                        }
                      }
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: colors.text.secondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={formData.description}
                    onChange={handleChange("description")}
                    slotProps={{
                      input: {
                        sx: {
                          backgroundColor: colors.input.background,
                          color: colors.input.text,
                          '& fieldset': { borderColor: colors.input.border },
                          '&:hover fieldset': { borderColor: colors.input.border },
                          '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                        }
                      }
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: colors.text.secondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="number"
                    label="Prix"
                    fullWidth
                    value={formData.price}
                    onChange={handleChange("price")}
                    slotProps={{
                      input: {
                        sx: {
                          backgroundColor: colors.input.background,
                          color: colors.input.text,
                          '& fieldset': { borderColor: colors.input.border },
                          '&:hover fieldset': { borderColor: colors.input.border },
                          '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                        }
                      }
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: colors.text.secondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label="Catégorie"
                    fullWidth
                    value={formData.category}
                    onChange={handleChange("category")}
                    slotProps={{
                      input: {
                        sx: {
                          backgroundColor: colors.input.background,
                          color: colors.input.text,
                          '& fieldset': { borderColor: colors.input.border },
                          '&:hover fieldset': { borderColor: colors.input.border },
                          '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                        }
                      }
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: colors.text.secondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    select
                    label="Disponibilité"
                    fullWidth
                    value={String(formData.inStock)}
                    onChange={handleChange("inStock")}
                    slotProps={{
                      input: {
                        sx: {
                          backgroundColor: colors.input.background,
                          color: colors.input.text,
                          '& fieldset': { borderColor: colors.input.border },
                          '&:hover fieldset': { borderColor: colors.input.border },
                          '&.Mui-focused fieldset': { borderColor: '#2563eb' },
                        }
                      }
                    }}
                    sx={{
                      '& .MuiInputLabel-root': { color: colors.text.secondary },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#2563eb' }
                    }}
                  >
                    <MenuItem value="true">En stock</MenuItem>
                    <MenuItem value="false">Rupture</MenuItem>
                  </TextField>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" spacing={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: '#2563eb',
                        color: '#fff',
                        "&:hover": { backgroundColor: '#1d4ed8' }
                      }}
                    >
                      {viewMode === "edit" ? "Mettre à jour" : "Ajouter"}
                    </Button>
                    <Button
                      onClick={() => setViewMode("list")}
                      sx={{
                        color: colors.text.primary,
                        border: `1px solid ${colors.border.light}`,
                        "&:hover": { backgroundColor: colors.card.hover }
                      }}
                    >
                      Annuler
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        )}
        
        {viewMode === "list" && (
          <Paper
            sx={{
              borderRadius: 3,
              border: `1px solid ${colors.border.light}`,
              overflow: "hidden",
              backgroundColor: colors.card.background,
            }}
          >
            {filteredProducts.length === 0 ? (
              <Box sx={{ p: 5, textAlign: "center" }}>
                <Inventory2RoundedIcon sx={{ fontSize: 50, color: colors.text.secondary, mb: 1 }} />
                <Typography fontWeight={700} sx={{ color: colors.text.primary }}>Aucun produit</Typography>
                <Typography sx={{ color: colors.text.secondary }}>
                  Ajoutez un produit pour commencer
                </Typography>
              </Box>
            ) : (
              filteredProducts.map((p, index) => (
                <Box key={p.id}>
                  <Box
                    sx={{
                      px: 3,
                      py: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "0.2s",
                      backgroundColor: colors.card.background,
                      borderBottom: `1px solid ${colors.border.light}`,
                      "&:hover": {
                        backgroundColor: colors.card.hover,
                      },
                    }}
                  >
                  
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: colors.text.primary,
                        }}
                      >
                        {p.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: colors.text.secondary,
                          fontSize: "0.9rem",
                          mt: 0.5,
                        }}
                      >
                        {p.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        <Chip
                          label={p.inStock ? "En stock" : "Rupture"}
                          size="small"
                          color={p.inStock ? "success" : "error"}
                          sx={{
                            fontWeight: 600,
                            backgroundColor: p.inStock
                              ? (isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.1)')
                              : (isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)'),
                            color: p.inStock ? '#22c55e' : '#ef4444'
                          }}
                        />
                        {p.category && (
                          <Chip
                            label={p.category}
                            size="small"
                            sx={{
                              backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : 'rgba(37, 99, 235, 0.1)',
                              color: "#2563eb",
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                 
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#2563eb",
                          minWidth: "80px",
                          textAlign: "right",
                        }}
                      >
                        {Number(p.price).toFixed(2)} €
                      </Typography>
                    
                      <IconButton
                        onClick={() => handleEdit(p)}
                        sx={{
                          border: `1px solid ${colors.border.light}`,
                          borderRadius: 2,
                          color: "#2563eb",
                          backgroundColor: isDark ? 'rgba(37, 99, 235, 0.1)' : '#eff6ff',
                          "&:hover": {
                            backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : "#dbeafe",
                          },
                        }}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    
                      <IconButton
                        onClick={() => handleDelete(p.id)}
                        sx={{
                          border: `1px solid ${colors.border.light}`,
                          borderRadius: 2,
                          color: "#dc2626",
                          backgroundColor: isDark ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2',
                          "&:hover": {
                            backgroundColor: isDark ? 'rgba(220, 38, 38, 0.2)' : "#fee2e2",
                          },
                        }}
                      >
                        <DeleteRoundedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                
                  {index !== filteredProducts.length - 1 && <Divider sx={{ borderColor: colors.border.light }} />}
                </Box>
              ))
            )}
          </Paper>
        )}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            severity={snackbar.severity}
            sx={{
              backgroundColor: snackbar.severity === 'error'
                ? (isDark ? 'rgba(220, 38, 38, 0.9)' : '#fee2e2')
                : (isDark ? 'rgba(34, 197, 94, 0.9)' : '#dcfce7'),
              color: snackbar.severity === 'error' ? '#dc2626' : '#22c55e'
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default Products;