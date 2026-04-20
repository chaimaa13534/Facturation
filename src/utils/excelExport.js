import * as XLSX from 'xlsx';

export const exportFacturesExcel = (factures, clients = []) => {
  // Mapper clients pour lookup rapide
  const clientMap = new Map(clients.map(c => [c.id, c.nom]));

  // Préparer données pour Excel
  const data = factures.map(f => ({
    'N° Facture': f.numero || f.id || '',
    'Date Création': new Date(f.date_creation).toLocaleDateString('fr-FR'),
    'Client': clientMap.get(f.client_id) || 'Inconnu',
    'Total HT': f.total_ht?.toFixed(2) || '0.00',
    'TVA': f.tva?.toFixed(2) || '0.00',
    'Total TTC': f.total_ttc?.toFixed(2) || '0.00',
    'Statut': f.statut || 'N/A',
    'Date Dépôt': f.date_depot || '',
    'Date Encaissement': f.date_encaissement || '',
    'Type Virement': f.type_virement || ''
  }));

  // Créer workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Auto-ajuster colonnes
  const colWidths = data[0] ? Object.keys(data[0]).map(k => ({ wch: Math.max(15, k.length + 2) })) : [];
  ws['!cols'] = colWidths;

  // Ajouter au workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Factures');

  // Télécharger
  XLSX.writeFile(wb, 'factures_export.xlsx');
};
