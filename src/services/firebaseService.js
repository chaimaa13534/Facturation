import { db } from './firebaseConfig';
import { ref, get, push, set, update, remove } from 'firebase/database';

export const firebaseService = {

  getClients: async () => {
    try {
      const snapshot = await get(ref(db, 'clients'));
      if (!snapshot.exists()) {
        console.warn('No clients data in Firebase');
        return [];
      }
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } catch (error) {
      console.error('❌ Error fetching clients:', error.message);
      throw new Error(`Impossible de charger les clients: ${error.message}`);
    }
  },

  addClient: async (clientData) => {
    try {
      const newClientRef = push(ref(db, 'clients'));
      await set(newClientRef, clientData);
      return newClientRef.key;
    } catch (error) {
      console.error('❌ Error adding client:', error.message);
      throw new Error(`Impossible d'ajouter le client: ${error.message}`);
    }
  },

  updateClient: async (id, clientData) => {
    try {
      await update(ref(db, `clients/${id}`), clientData);
    } catch (error) {
      console.error('❌ Error updating client:', error.message);
      throw new Error(`Impossible de modifier le client: ${error.message}`);
    }
  },

  deleteClient: async (id) => {
    try {
      await remove(ref(db, `clients/${id}`));
    } catch (error) {
      console.error('❌ Error deleting client:', error.message);
      throw new Error(`Impossible de supprimer le client: ${error.message}`);
    }
  },

  getFactures: async () => {
    try {
      const snapshot = await get(ref(db, 'factures'));
      if (!snapshot.exists()) {
        console.warn('No invoices data in Firebase');
        return [];
      }
      const data = snapshot.val();
      return Object.keys(data).map(key => ({ id: key, ...data[key] }));
    } catch (error) {
      console.error('❌ Error fetching invoices:', error.message);
      throw new Error(`Impossible de charger les factures: ${error.message}`);
    }
  },

  addFacture: async (factureData) => {
    try {
      
      if (!factureData.client_id) {
        throw new Error('Client requis pour créer une facture');
      }

      if (!factureData.articles || !Array.isArray(factureData.articles) || factureData.articles.length === 0) {
        throw new Error('Au moins un article est requis');
      }

  
      for (const article of factureData.articles) {
        if (!article.articleId || !article.designation) {
          throw new Error('Article incomplet détecté');
        }
        if (article.prix_unitaire < 0 || article.qte <= 0) {
          throw new Error('Prix ou quantité invalide détectée');
        }
      }

     
      if (factureData.total_ht < 0 || factureData.tva < 0 || factureData.total_ttc < 0) {
        throw new Error('Totaux invalides');
      }

      const newFactureRef = push(ref(db, 'factures'));
      await set(newFactureRef, {
        ...factureData,
        date_creation: new Date().toISOString()
      });
      return newFactureRef.key;
    } catch (error) {
      console.error('❌ Error adding invoice:', error.message);
      throw error;
    }
  },

  updateFactureStatut: async (id, statut) => {
    try {
      await update(ref(db, `factures/${id}`), { statut });
    } catch (error) {
      console.error('❌ Error updating invoice status:', error.message);
      throw new Error(`Impossible de modifier le statut: ${error.message}`);
    }
  },

  updateFactureTracking: async (id, trackingData) => {
    try {
      // Validation des données de suivi
      const { statut, date_depot, date_encaissement, type_virement } = trackingData;

      const updateData = {};

      if (statut) updateData.statut = statut;
      if (date_depot) updateData.date_depot = date_depot;
      if (date_encaissement) updateData.date_encaissement = date_encaissement;
      if (type_virement) updateData.type_virement = type_virement;

      // Ajouter date_mise_a_jour
      updateData.date_mise_a_jour = new Date().toISOString();

      await update(ref(db, `factures/${id}`), updateData);
    } catch (error) {
      console.error('❌ Error updating invoice tracking:', error.message);
      throw new Error(`Impossible de mettre à jour le suivi: ${error.message}`);
    }
  },

  deleteFacture: async (id) => {
    try {
      await remove(ref(db, `factures/${id}`));
    } catch (error) {
      console.error('❌ Error deleting invoice:', error.message);
      throw new Error(`Impossible de supprimer la facture: ${error.message}`);
    }
  }

};