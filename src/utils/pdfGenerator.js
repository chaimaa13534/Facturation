import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoicePDF = (facture, client) => {
  if (!facture || !Array.isArray(facture.articles) || facture.articles.length === 0) {
    throw new Error('Facture invalide ou sans articles disponibles');
  }

  const doc = new jsPDF();

  // En-tête de l'entreprise (Tu pourras remplacer par tes paramètres JSON plus tard)
  doc.setFontSize(20);
  doc.setTextColor(25, 118, 210); // Bleu primaire
  doc.text('FacturApp Pro', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('123 Avenue de la Tech\n75000 Paris, France\ncontact@facturapp.pro', 14, 30);

  // Infos de la facture
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text(`FACTURE N° : ${facture.numero || 'Brouillon'}`, 130, 22);
  doc.setFontSize(10);
  doc.text(`Date : ${new Date(facture.date_creation).toLocaleDateString()}`, 130, 30);

  // Infos du Client
  doc.setFillColor(244, 246, 248);
  doc.rect(130, 40, 65, 35, 'F');
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text('Facturé à :', 135, 48);
  doc.setFont("helvetica", "normal");
  doc.text(`${client?.nom || 'Client Inconnu'}\n${client?.adresse || ''}\n${client?.email || ''}\n${client?.tel || ''}`, 135, 55);

  // Tableau des articles
  const tableColumn = ["Désignation", "Prix Unitaire (HT)", "Quantité", "Total Ligne (HT)"];
  const tableRows = [];

  facture.articles.forEach(article => {
    const designation = article?.designation || 'Article non identifié';
    const prixUnitaire = Number(article?.prix_unitaire) || 0;
    const quantite = Number(article?.qte) || 0;

    const articleData = [
      designation,
      `${prixUnitaire.toFixed(2)} €`,
      quantite,
      `${(prixUnitaire * quantite).toFixed(2)} €`
    ];
    tableRows.push(articleData);
  });

  const autoTableFunction = typeof doc.autoTable === 'function'
    ? (options) => doc.autoTable(options)
    : (options) => autoTable(doc, options);

  autoTableFunction({
    startY: 90,
    head: [tableColumn],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [25, 118, 210] },
  });

  const totalHT = facture.total_ht != null ? Number(facture.total_ht) : tableRows.reduce((sum, row) => sum + Number(row[3].replace(' €', '')), 0);
  const tva = facture.tva != null ? Number(facture.tva) : totalHT * 0.2;
  const totalTTC = facture.total_ttc != null ? Number(facture.total_ttc) : totalHT + tva;

  const finalY = (doc.lastAutoTable?.finalY ?? 90) + 10;
  doc.setFont("helvetica", "bold");
  doc.text(`Total HT : ${totalHT.toFixed(2)} €`, 140, finalY);
  doc.text(`TVA (20%) : ${tva.toFixed(2)} €`, 140, finalY + 8);
  doc.setFontSize(14);
  doc.setTextColor(25, 118, 210);
  doc.text(`Total TTC : ${totalTTC.toFixed(2)} €`, 140, finalY + 18);

 
  doc.setFontSize(10);
  doc.setTextColor(150);
  doc.text('Merci pour votre confiance. Paiement attendu sous 30 jours.', 14, 280);

  doc.save(`Facture_${facture.numero || 'Nouvelle'}.pdf`);
};