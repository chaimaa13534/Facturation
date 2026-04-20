import { useState, useEffect } from 'react';
import { firebaseService } from '../services/firebaseService';
import { useTheme } from '@mui/material/styles';
import { 
  Box, Grid, Card, CardContent, Typography, Fade, Skeleton, Divider, Container
} from '@mui/material';
import { 
  TrendingUp, Receipt, HourglassEmpty, Cancel, AttachMoney
} from '@mui/icons-material';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const Dashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [kpis, setKpis] = useState({
    totalFactures: 0,
    totalEncaisse: 0,
    facturesAttente: 0,
    facturesRejetees: 0,
    montantMoyen: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        const factures = await firebaseService.getFactures();
        
        let encaisse = 0;
        let attente = 0;
        let rejetees = 0;
        let totalCA = 0;
        const monthlyData = {};

        factures.forEach(f => {
          totalCA += f.total_ttc;
          
          if (f.statut === 'Payée') encaisse += f.total_ttc;
          if (f.statut === 'En attente') attente++;
          if (f.statut === 'Rejetée') rejetees++;

          const date = new Date(f.date_creation);
          const month = date.toLocaleString('fr-FR', { month: 'short', year: 'numeric' });
          
          if (!monthlyData[month]) {
            monthlyData[month] = { name: month, CA: 0, Factures: 0 };
          }
          monthlyData[month].CA += f.total_ttc;
          monthlyData[month].Factures += 1;
        });

        setKpis({
          totalFactures: factures.length,
          totalEncaisse: encaisse,
          facturesAttente: attente,
          facturesRejetees: rejetees,
          montantMoyen: factures.length > 0 ? (totalCA / factures.length) : 0,
        });

        setChartData(Object.values(monthlyData));
      } catch (error) {
        console.error(' Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);


  const KpiCard = ({ title, value, icon, colorHex, bgColorHex }) => (
    <Card 
      elevation={0}
      sx={{ 
        borderRadius: 3, 
        border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`,
        backgroundColor: isDark ? '#1e293b' : '#FFFFFF',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="body2" fontWeight="600" color={isDark ? '#94a3b8' : '#64748B'} sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="700" color={isDark ? '#f1f5f9' : '#0F172A'}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            backgroundColor: bgColorHex, 
            color: colorHex,
            p: 1.5, 
            borderRadius: 2, 
            display: 'flex',
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

 
  if (loading) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, background: isDark ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", minHeight: '100vh' }}>
        <Container maxWidth="xl">
          <Skeleton variant="text" width={300} height={60} sx={{ mb: 1, backgroundColor: isDark ? '#334155' : 'rgba(0,0,0,0.1)' }} />
          <Skeleton variant="text" width={400} height={30} sx={{ mb: 4, backgroundColor: isDark ? '#334155' : 'rgba(0,0,0,0.1)' }} />
          <Grid container spacing={3}>
            {[...Array(5)].map((_, i) => (
              <Grid item xs={12} sm={6} md={2.4} key={i}>
                <Skeleton variant="rounded" height={130} sx={{ borderRadius: 3, backgroundColor: isDark ? '#334155' : 'rgba(0,0,0,0.1)' }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rounded" height={400} sx={{ mt: 4, borderRadius: 3, backgroundColor: isDark ? '#334155' : 'rgba(0,0,0,0.1)' }} />
        </Container>
      </Box>
    );
  }

  return (
    <Fade in={!loading} timeout={800}>
      <Box sx={{ p: { xs: 2, md: 4 }, background: isDark ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", minHeight: '100vh' }}>
        <Container maxWidth="xl">
          
   
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" fontWeight="800" color={isDark ? '#f1f5f9' : '#0F172A'} gutterBottom>
              Vue d'ensemble
            </Typography>
            <Typography variant="body1" color={isDark ? '#94a3b8' : '#64748B'}>
              Suivez vos performances financières et l'état de vos factures en temps réel.
            </Typography>
          </Box>

   
          <Grid container spacing={3} mb={5}>
            <Grid item xs={12} sm={6} md={2.4}>
              <KpiCard 
                title="Total Factures" 
                value={kpis.totalFactures} 
                icon={<Receipt />} 
                colorHex="#3B82F6" // Blue
                bgColorHex="#EFF6FF"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={2.4}>
              <KpiCard 
                title="En Attente" 
                value={kpis.facturesAttente} 
                icon={<HourglassEmpty />} 
                colorHex="#F59E0B" // Amber
                bgColorHex="#FFFBEB"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <KpiCard 
                title="Rejetées" 
                value={kpis.facturesRejetees} 
                icon={<Cancel />} 
                colorHex="#EF4444" // Red
                bgColorHex="#FEF2F2"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <KpiCard 
                title="Montant Moyen" 
                value={`${kpis.montantMoyen.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`} 
                icon={<AttachMoney />} 
                colorHex="#8B5CF6" // Violet
                bgColorHex="#F5F3FF"
              />
            </Grid>
          </Grid>

        
          <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="700" color="#0F172A">
                  Évolution du Chiffre d'Affaires
                </Typography>
                <Typography variant="body2" color="#64748B">
                  Revenus générés par mois
                </Typography>
              </Box>
              
              <Box sx={{ width: '100%', height: 350 }}>
                <ResponsiveContainer>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748B', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748B', fontSize: 12 }}
                      tickFormatter={(value) => `${value}€`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value) => [`${value} €`, "Chiffre d'Affaires"]}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="CA" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorCA)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>

        </Container>
      </Box>
    </Fade>
  );
};

export default Dashboard;