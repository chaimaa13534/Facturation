import React, { useState, useEffect } from "react";
import { Box, AppBar, Toolbar, Typography, Stack, Button, Drawer, IconButton, useMediaQuery, useTheme, Fade, Badge, Tooltip } from "@mui/material";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useDarkMode } from "../contexts/DarkModeContext";
import { firebaseService } from "../services/firebaseService";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import logo from "../assets/lo.png";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import Groups2RoundedIcon from "@mui/icons-material/Groups2Rounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SmartToyRoundedIcon from "@mui/icons-material/SmartToyRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";

const drawerWidth = 280;
const headerHeight = 72;

const Layout = () => {
  const { logout, userRole } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingFacturesCount, setPendingFacturesCount] = useState(0);

  // Charger le nombre de factures en attente (pour les admins)
  useEffect(() => {
    if (userRole === "ADMIN") {
      const fetchPendingFactures = async () => {
        try {
          const factures = await firebaseService.getFactures();
          const pending = factures.filter(f => f.statut === "En attente").length;
          setPendingFacturesCount(pending);
        } catch (error) {
          console.error("Error fetching pending factures:", error);
        }
      };
      fetchPendingFactures();
    
      const interval = setInterval(fetchPendingFactures, 30000);
      return () => clearInterval(interval);
    }
  }, [userRole]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const menuItems = [
    { label: "Tableau de bord", icon: <DashboardRoundedIcon fontSize="small" />, path: "/user" },
    { label: "Produits", icon: <StorefrontRoundedIcon fontSize="small" />, path: "/user/produits" },
    { label: "Clients", icon: <Groups2RoundedIcon fontSize="small" />, path: "/user/clients" },
    { label: "Calendrier", icon: <EventNoteRoundedIcon fontSize="small" />, path: "/user/calendrier" },
    { label: "Factures à valider", icon: <ReceiptLongRoundedIcon fontSize="small" />, path: "/user/factures" },
    { label: "Mes factures", icon: <ReceiptLongRoundedIcon fontSize="small" />, path: "/user/factures/list" },
  ];

  const SidebarContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', px: 3, py: 4 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 6,
            cursor: "pointer",
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
          onClick={() => handleNavigation(userRole === "ADMIN" ? "/admin" : "/user")}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(59, 130, 246, 0.3)",
              transition: 'all 0.3s ease',
            }}
          >
            <ReceiptLongRoundedIcon sx={{ color: "#fff", fontSize: 24, fontWeight: 800 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.1 }}>
              Facturation
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: "block", fontSize: '0.7rem', fontWeight: 500 }}>
              {userRole === "ADMIN" ? "Administration" : "Client"}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1}>
          {menuItems.map((item) => (
            <Tooltip key={item.label} title={item.label} placement="right" arrow>
              <Button
                startIcon={item.icon}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  justifyContent: "flex-start",
                  color: 'text.secondary',
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  px: 2.5,
                  py: 1.25,
                  borderRadius: "10px",
                  width: "100%",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: 'relative',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    color: "#3b82f6",
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                  <Typography sx={{ flex: 1, fontWeight: 'inherit' }}>{item.label === "Factures à valider" && pendingFacturesCount > 0 ? `${item.label}` : item.label}</Typography>
                  {item.label === "Factures à valider" && pendingFacturesCount > 0 && (
                    <Badge badgeContent={pendingFacturesCount} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 18, minWidth: 18 } }} />
                  )}
                </Box>
              </Button>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      <Box>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => handleNavigation("/user/factures/create")}
          fullWidth
          sx={{
            textTransform: "none",
            fontWeight: 700,
            px: 2.5,
            py: 1.25,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
            boxShadow: "0 10px 24px rgba(59, 130, 246, 0.25)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "linear-gradient(135deg, #2563eb 0%, #0891b2 100%)",
              boxShadow: "0 12px 32px rgba(59, 130, 246, 0.35)",
              transform: 'translateY(-2px)',
            },
            "&:active": {
              transform: 'translateY(0)',
            }
          }}
        >
          Nouvelle facture
        </Button>
      </Box>
    </Box>
  );

  const NavbarMenuItems = () => (
    <Stack direction="row" spacing={5.5} sx={{ flex: 1, justifyContent: 'flex-end', maxWidth: '600px' }}>
      {menuItems.map((item) => (
        <Tooltip key={item.label} title={item.label} arrow>
          <IconButton
            onClick={() => handleNavigation(item.path)}
            sx={{
              color: 'text.secondary',
              p: 1.25,
              borderRadius: "10px",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              '&:hover': {
                bgcolor: 'action.hover',
                color: "#3b82f6",
                transform: 'scale(1.1)',
              },
              minWidth: 0,
            }}
          >
            {item.icon}
            {item.label === "Factures à valider" && pendingFacturesCount > 0 && (
              <Badge 
                badgeContent={pendingFacturesCount} 
                color="error" 
                sx={{ 
                  position: 'absolute',
                  top: -2,
                  right: -2,
                  '& .MuiBadge-badge': { fontSize: '0.6rem', height: 14, minWidth: 14 }
                }} 
              />
            )}
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );

  return (
    <Box sx={{ display: "flex", minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: `${headerHeight}px`,
          justifyContent: "center",
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 2,
          borderBottom: 1,
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: `${headerHeight}px !important`, px: { xs: 2, md: 3 } }}>
         
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: 'text.primary',
                p: 1.5,
                borderRadius: "10px",
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'action.hover',
                  color: "#3b82f6",
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <MenuRoundedIcon />
            </IconButton>
            
            <Box
              component="img"
              src={logo}
              alt="FacturaPro"
              sx={{
                height: { xs: 60, md: 80 },
                width: { xs: 60, md: 80 },
                objectFit: "contain",
                cursor: "pointer",
              }}
              onClick={() => handleNavigation(userRole === "ADMIN" ? "/admin" : "/user")}
            />
          </Box>

          {/* Menu items à droite */}
          <NavbarMenuItems />

          {/* Boutons action droite */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title={darkMode ? "Mode clair" : "Mode sombre"}>
              <IconButton
                onClick={toggleDarkMode}
                sx={{
                  color: darkMode ? "#fbbf24" : "#64748b",
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  p: 1,
                  borderRadius: "10px",
                  "&:hover": {
                    backgroundColor: darkMode ? "rgba(251, 191, 36, 0.1)" : "rgba(59, 130, 246, 0.1)",
                    color: darkMode ? "#fbbf24" : "#3b82f6",
                    transform: 'rotate(20deg) scale(1.05)',
                  },
                }}
              >
                {darkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
              </IconButton>
            </Tooltip>
            <Button
              startIcon={<LogoutRoundedIcon />}
              onClick={handleLogout}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                color: "#64748b",
                px: 2,
                py: 1,
                borderRadius: "10px",
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                "&:hover": {
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  transform: 'translateY(-1px)',
                },
              }}
            >
              {!isMobile && "Déconnexion"}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.mode === 'dark' ? "#1e293b" : "#ffffff",
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, borderBottom: theme.palette.mode === 'dark' ? "1px solid #334155" : "1px solid #e2e8f0" }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#3b82f6', fontSize: '1.1rem' }}>
            Menu
          </Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ color: theme.palette.mode === 'dark' ? "#94a3b8" : "#64748b" }}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <SidebarContent />
      </Drawer>

    
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          mt: `${headerHeight}px`,
          background: theme.palette.mode === 'dark' 
            ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
            : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
          minHeight: `calc(100vh - ${headerHeight}px)`,
          width: '100%',
        }}
      >
        <Fade in={true} timeout={500}>
          <Box
            sx={{
              animation: 'slideInRight 0.4s ease-out',
              '@keyframes slideInRight': {
                from: {
                  opacity: 0,
                  transform: 'translateX(20px)',
                },
                to: {
                  opacity: 1,
                  transform: 'translateX(0)',
                },
              },
            }}
          >
            <Outlet />
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default Layout;