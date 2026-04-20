import React from 'react';
import { 
  Box, 
  Grid, 
  Container,
  Typography
} from '@mui/material';
import { KPICard, ModernCard, ModernAlert, ModernButton } from '../../components/UI';
import {
  TrendingUp,
  ReceiptLong,
  Users,
  CheckCircle,
  AlertCircle,
} from '@mui/icons-material';


const ExampleDashboard = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Container maxWidth="xl">
      
        <Box sx={{ mb: 5 }}>
          <Typography variant="h4" fontWeight="800" color="#0f172a" gutterBottom>
            Tableau de Bord - Exemple
          </Typography>
          <Typography variant="body1" color="#64748b">
            Voici comment utiliser les nouveaux composants du Design System.
          </Typography>
        </Box>

   
        <ModernAlert
          type="info"
          title="Bienvenue!"
          message="Ce dashboard montre les nouveaux composants UI et styles du système de design."
          closable
        />

     
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Total Factures"
              value="2,456"
              icon={ReceiptLong}
              color="primary"
              change="+12.5%"
              trend="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Total Encaissé"
              value="125,430"
              unit="€"
              icon={TrendingUp}
              color="success"
              change="+8.2%"
              trend="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Clients Actifs"
              value="847"
              icon={Users}
              color="secondary"
              change="+3.1%"
              trend="up"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <KPICard
              title="Factures Validées"
              value="94%"
              icon={CheckCircle}
              color="success"
              change="+2.4%"
              trend="up"
            />
          </Grid>
        </Grid>


        <Grid container spacing={3}>
       
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Factures Récentes"
              subtitle="Vos 5 dernières factures"
              icon={<ReceiptLong fontSize="small" />}
            >
              <Box sx={{ mt: 3 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  p: 1.5, 
                  mb: 1,
                  backgroundColor: '#f8fafc',
                  borderRadius: 1,
                }}>
                  <Typography variant="body2" fontWeight="600">FAC-001</Typography>
                  <Typography variant="body2" color="success.main">Payée</Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  p: 1.5, 
                  mb: 1,
                  backgroundColor: '#f8fafc',
                  borderRadius: 1,
                }}>
                  <Typography variant="body2" fontWeight="600">FAC-002</Typography>
                  <Typography variant="body2" color="warning.main">En attente</Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  p: 1.5,
                  backgroundColor: '#f8fafc',
                  borderRadius: 1,
                }}>
                  <Typography variant="body2" fontWeight="600">FAC-003</Typography>
                  <Typography variant="body2" color="error.main">Rejetée</Typography>
                </Box>
              </Box>
            </ModernCard>
          </Grid>

      
          <Grid item xs={12} md={6}>
            <ModernCard
              title="Actions Rapides"
              subtitle="Accédez aux fonctions principales"
              icon={<AlertCircle fontSize="small" />}
            >
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <ModernButton
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Créer une nouvelle facture
                </ModernButton>
                <ModernButton
                  variant="outlined"
                  color="primary"
                  fullWidth
                >
                  Voir tous les clients
                </ModernButton>
                <ModernButton
                  variant="outlined"
                  color="secondary"
                  fullWidth
                >
                  Télécharger rapport
                </ModernButton>
              </Box>
            </ModernCard>
          </Grid>
        </Grid>

       
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>
            Statistiques Détaillées
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Factures créées', value: '2,456' },
              { label: 'Montant total', value: '125,430 €' },
              { label: 'Taux conversion', value: '94%' },
              { label: 'Temps moyen', value: '3.2 jours' },
            ].map((stat, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box
                  sx={{
                    p: 2.5,
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#3b82f6',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
                    },
                  }}
                >
                  <Typography variant="h5" fontWeight="800" color="#0f172a">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Conseils */}
        <ModernAlert
          type="warning"
          title="Conseil"
          message="Consultez DESIGN_SYSTEM.md pour plus d'informations sur les composants et styles disponibles."
          sx={{ mt: 5 }}
        />
      </Container>
    </Box>
  );
};

export default ExampleDashboard;
