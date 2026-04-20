import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from './theme';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';


import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/user/Clients';
import Calendrier from './pages/user/Calendrier';
import Factures from './pages/user/Factures';
import CreateFacture from './pages/user/CreateFacture';
import Products from './pages/user/Products';
import AdminFactures from './pages/admin/AdminFactures';



const Articles = () => <div>Gestion des articles JSON (À venir)</div>;

function AppContent() {
  const { darkMode } = useDarkMode();
  const theme = createAppTheme(darkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

           
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              
              <Route index element={<Navigate to="/user" replace />} />
              
          
              <Route path="/user" element={<Dashboard />} />
              <Route path="/user/clients" element={<Clients />} />
              <Route path="/user/factures" element={<AdminFactures />} />
              <Route path="/user/factures/list" element={<Factures />} />
              <Route path="/user/factures/create" element={<CreateFacture />} />
              <Route path="/user/produits" element={<Products />} />
              <Route path="/user/calendrier" element={<Calendrier />} />
              <Route path="/user/articles" element={<Articles />} />

            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App;