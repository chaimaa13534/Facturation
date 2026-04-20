import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { 
  Box, Grid, Card, CardContent, Typography, Container, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Chip, Fade, Skeleton, Button
} from '@mui/material';
import { EventNoteRounded, ReceiptRounded } from '@mui/icons-material';
import { firebaseService } from '../../services/firebaseService';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/calendar.css'; // We'll create basic styles

const Calendrier = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [factures, setFactures] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [dateFactures, setDateFactures] = useState([]);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        setLoading(true);
        const data = await firebaseService.getFactures();
        setFactures(data);
      } catch (error) {
        console.error('Error fetching factures:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFactures();
  }, []);

  useEffect(() => {
    const filtered = factures.filter(f => {
      const fDate = new Date(f.date_creation);
      return fDate.toDateString() === selectedDate.toDateString();
    });
    setDateFactures(filtered);
  }, [factures, selectedDate]);

  const dateEvents = (date) => {
    const events = factures.filter(f => {
      const fDate = new Date(f.date_creation);
      return fDate.toDateString() === date.toDateString();
    });
    return events.length;
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, background: isDark ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)", minHeight: '100vh' }}>
        <Container maxWidth="xl">
          <Skeleton variant="text" width={300} height={60} />
          <Grid container spacing={3} mt={4}>
            <Grid item xs={12} md={4}><Skeleton height={400} /></Grid>
            <Grid item xs={12} md={8}><Skeleton height={400} /></Grid>
          </Grid>
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
              <EventNoteRounded sx={{ mr: 1, verticalAlign: 'middle' }} /> Calendrier des Factures
            </Typography>
            <Typography variant="body1" color={isDark ? '#94a3b8' : '#64748B'}>
              Visualisez vos factures par date de création. Cliquez sur une date pour voir les détails.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={0} sx={{ height: '100%', borderRadius: 3, border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}` }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="700" gutterBottom>
                    Calendrier
                  </Typography>
                  <Box sx={{ '& .react-calendar': { border: 'none', borderRadius: 2, background: isDark ? '#1e293b' : '#fff' }, '& .react-calendar__tile--active': { background: '#3B82F6' } }}>
                    <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      tileContent={({ date, view }) => view === 'month' ? 
                        <div style={{ height: 4, width: `${(dateEvents(date) / 10) * 100}%`, background: '#3B82F6', marginTop: 4, borderRadius: 2 }} /> : null
                      }
                      locale="fr-FR"
                      navigationLabel={null}
                      nextLabel={<span>{'>'}</span>}
                      prevLabel={<span>{'<'}</span>}
                    />
                  </Box>
                  <Chip 
                    label={`${dateEvents(selectedDate)} facture${dateEvents(selectedDate) > 1 ? 's' : ''} le ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`} 
                    color="primary" 
                    sx={{ mt: 2, fontWeight: 600 }}
                  />
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Card elevation={0} sx={{ borderRadius: 3, border: `1px solid ${isDark ? '#334155' : '#E2E8F0'}`, height: '100%' }}>
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="700">
                      Factures du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total: {dateFactures.reduce((sum, f) => sum + (f.total_ttc || 0), 0).toLocaleString('fr-FR')} €
                    </Typography>
                  </Box>
                  {dateFactures.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
                      <ReceiptRounded sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                      <Typography variant="h6">Aucune facture ce jour-là</Typography>
                    </Box>
                  ) : (
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Numéro</TableCell>
                           
                            <TableCell>Montant TTC</TableCell>
                            <TableCell>Statut</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dateFactures.map((facture) => (
                            <TableRow key={facture.id} hover>
                              <TableCell>{facture.numero || 'N/A'}</TableCell>
                             
                              <TableCell>{facture.total_ttc?.toLocaleString('fr-FR')} €</TableCell>
                              <TableCell>
                                <Chip label={facture.statut} size="small" color={facture.statut === 'Payée' ? 'success' : facture.statut === 'En attente' ? 'warning' : 'error'} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Fade>
  );
};

export default Calendrier;