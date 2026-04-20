/**
 * Utilitaires de validation pour les factures
 */

export const factureValidators = {
  /**
   * Valide les données d'une facture
   * @param {Object} factureData - Données de la facture à valider
   * @param {Array} clients - Liste des clients disponibles
   * @returns {Array} Liste des erreurs de validation
   */
  validateFactureData: (factureData, clients = []) => {
    const errors = [];

    // Validation du client
    if (!factureData.client_id) {
      errors.push('Client non sélectionné');
    } else {
      const client = clients.find(c => c.id === factureData.client_id);
      if (!client) {
        errors.push('Client sélectionné invalide');
      }
    }

    // Validation des articles
    if (!factureData.articles || !Array.isArray(factureData.articles)) {
      errors.push('Articles manquants ou format invalide');
      return errors;
    }

    if (factureData.articles.length === 0) {
      errors.push('Au moins un article est requis');
      return errors;
    }

    // Validation détaillée des articles
    factureData.articles.forEach((article, index) => {
      const lineNum = index + 1;

      if (!article.articleId) {
        errors.push(`Article ${lineNum}: ID manquant`);
      }

      if (!article.designation || article.designation.trim() === '') {
        errors.push(`Article ${lineNum}: Désignation manquante`);
      }

      const prix = Number(article.prix_unitaire);
      if (isNaN(prix) || prix < 0) {
        errors.push(`Article ${lineNum}: Prix unitaire invalide (${article.prix_unitaire})`);
      }

      const qte = Number(article.qte);
      if (isNaN(qte) || qte <= 0 || !Number.isInteger(qte)) {
        errors.push(`Article ${lineNum}: Quantité doit être un entier positif (${article.qte})`);
      }
    });

    // Validation des totaux
    const ht = Number(factureData.total_ht);
    const tva = Number(factureData.tva);
    const ttc = Number(factureData.total_ttc);

    if (isNaN(ht) || ht < 0) {
      errors.push('Total HT invalide');
    }

    if (isNaN(tva) || tva < 0) {
      errors.push('TVA invalide');
    }

    if (isNaN(ttc) || ttc < 0) {
      errors.push('Total TTC invalide');
    }

    // Vérification de cohérence TVA (20%)
    if (!isNaN(ht) && !isNaN(tva)) {
      const expectedTVA = ht * 0.2;
      const tvaDifference = Math.abs(tva - expectedTVA);
      if (tvaDifference > 0.01) {
        errors.push(`TVA incohérente (attendu: ${expectedTVA.toFixed(2)}€, actuel: ${tva.toFixed(2)}€)`);
      }
    }

    // Vérification cohérence TTC = HT + TVA
    if (!isNaN(ht) && !isNaN(tva) && !isNaN(ttc)) {
      const expectedTTC = ht + tva;
      const ttcDifference = Math.abs(ttc - expectedTTC);
      if (ttcDifference > 0.01) {
        errors.push(`Total TTC incohérent (attendu: ${expectedTTC.toFixed(2)}€, actuel: ${ttc.toFixed(2)}€)`);
      }
    }

    return errors;
  },

  /**
   * Valide une ligne d'article
   * @param {Object} ligne - Ligne d'article à valider
   * @returns {Array} Liste des erreurs pour cette ligne
   */
  validateArticleLine: (ligne) => {
    const errors = [];

    if (!ligne.articleId) {
      errors.push('Article non sélectionné');
    }

    if (!ligne.designation || ligne.designation.trim() === '') {
      errors.push('Désignation manquante');
    }

    const prix = Number(ligne.prix_unitaire);
    if (isNaN(prix) || prix < 0) {
      errors.push(`Prix unitaire invalide: ${ligne.prix_unitaire}`);
    }

    const qte = Number(ligne.qte);
    if (isNaN(qte) || qte <= 0) {
      errors.push(`Quantité invalide: ${ligne.qte}`);
    } else if (!Number.isInteger(qte)) {
      errors.push('La quantité doit être un nombre entier');
    }

    return errors;
  },

  /**
   * Calcule et valide les totaux d'une facture
   * @param {Array} lignes - Lignes d'articles
   * @returns {Object} Totaux calculés et erreurs
   */
  calculateAndValidateTotals: (lignes) => {
    const errors = [];
    let totalHT = 0;

    lignes.forEach((ligne, index) => {
      const prix = Number(ligne.prix_unitaire) || 0;
      const qte = Number(ligne.qte) || 0;

      if (prix >= 0 && qte > 0) {
        totalHT += prix * qte;
      } else {
        errors.push(`Ligne ${index + 1}: calcul impossible (prix: ${prix}, quantité: ${qte})`);
      }
    });

    const tva = totalHT * 0.2;
    const ttc = totalHT + tva;

    return {
      totals: {
        ht: totalHT,
        tva: tva,
        ttc: ttc
      },
      errors: errors
    };
  }
};