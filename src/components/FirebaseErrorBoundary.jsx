import React from 'react';
import { Box, Alert, AlertTitle, Button, Typography, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export const FirebaseErrorBoundary = ({ error, onRetry }) => {
  if (!error) return null;

  const isPermissionError = error.includes('PERMISSION_DENIED');
  const isConnectionError = error.includes('Cannot connect') || error.includes('ECONNREFUSED');
  const isNoDataError = error.includes('Cannot read property') || error.includes('null');

  return (
    <Box sx={{ p: 3, my: 2 }}>
      <Alert 
        severity="error" 
        icon={<ErrorOutlineIcon />}
        sx={{ borderRadius: 2 }}
      >
        <AlertTitle>❌ Erreur Firebase</AlertTitle>
        <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
          {error}
        </Typography>

        {isPermissionError && (
          <Paper sx={{ p: 2, bgcolor: '#fff3e0', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              🔐 Solution : Modifier les règles Firebase
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              1. Allez dans Firebase Console
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              2. Database → Rules
            </Typography>
            <Typography variant="body2" component="div" sx={{ mb: 1 }}>
              3. Remplacez par :
            </Typography>
            <Paper 
              component="pre" 
              sx={{ 
                p: 1.5, 
                bgcolor: '#f5f5f5', 
                overflow: 'auto',
                fontSize: '0.8rem',
                mb: 1
              }}
            >
{`{
  "rules": {
    ".read": true,
    ".write": true
  }
}`}
            </Paper>
            <Typography variant="body2" color="error">
              ⚠️ Ceci est pour le développement SEULEMENT ! Utilisez des règles sécurisées en production.
            </Typography>
          </Paper>
        )}

        {isConnectionError && (
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              🔗 Problème de connexion
            </Typography>
            <Typography variant="body2">
              Vérifiez que Firebase est correctement configuré dans `src/services/firebaseConfig.js`
            </Typography>
          </Paper>
        )}

        {isNoDataError && (
          <Paper sx={{ p: 2, bgcolor: '#f3e5f5', mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              📊 Pas de données trouvées
            </Typography>
            <Typography variant="body2">
              Créez des données de test dans la Firebase Console → Database → Data
            </Typography>
          </Paper>
        )}

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button 
            variant="contained" 
            size="small"
            onClick={onRetry}
          >
            Réessayer
          </Button>
          <Button 
            variant="outlined" 
            size="small"
            target="_blank"
            href="https://console.firebase.google.com"
          >
            Ouvrir Firebase Console
          </Button>
        </Box>
      </Alert>
    </Box>
  );
};

export default FirebaseErrorBoundary;
