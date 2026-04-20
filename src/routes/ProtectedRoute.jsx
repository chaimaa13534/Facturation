import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { currentUser, loading, userRole } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && userRole !== 'ADMIN') {
    return <Navigate to="/user" replace />;
  }

  return children;
};

export default ProtectedRoute;