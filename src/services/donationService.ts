import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Donation, DonationStats } from '../types/donation';
import { sendDonationConfirmation, sendPickupNotification } from '../config/emailjs';

export const donationService = {
  // Create a new donation
  async createDonation(donationData: Omit<Donation, 'id' | 'createdAt' | 'status'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'donations'), {
        ...donationData,
        createdAt: Timestamp.now(),
        status: 'available'
      });

      // Send confirmation email
      await sendDonationConfirmation(donationData.donorEmail, donationData);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  },

  // Get all available donations
  async getAvailableDonations(): Promise<Donation[]> {
    try {
      const q = query(
        collection(db, 'donations'),
        where('status', '==', 'available'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        availableUntil: doc.data().availableUntil
      })) as Donation[];
    } catch (error) {
      console.error('Error getting available donations:', error);
      throw error;
    }
  },

  // Get donations by user
  async getDonationsByUser(userId: string): Promise<Donation[]> {
    try {
      const q = query(
        collection(db, 'donations'),
        where('donorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        availableUntil: doc.data().availableUntil
      })) as Donation[];
    } catch (error) {
      console.error('Error getting user donations:', error);
      throw error;
    }
  },

  // Claim a donation
  async claimDonation(donationId: string, claimedBy: any): Promise<void> {
    try {
      const donationRef = doc(db, 'donations', donationId);
      await updateDoc(donationRef, {
        status: 'claimed',
        claimedBy,
        claimedAt: Timestamp.now()
      });

      // Send pickup notification
      await sendPickupNotification(claimedBy.email, {
        ngoName: claimedBy.name,
        location: 'Donor location' // You can get this from the donation data
      });
    } catch (error) {
      console.error('Error claiming donation:', error);
      throw error;
    }
  },

  // Update donation status
  async updateDonationStatus(donationId: string, status: Donation['status']): Promise<void> {
    try {
      const donationRef = doc(db, 'donations', donationId);
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.completedAt = Timestamp.now();
      }
      
      await updateDoc(donationRef, updateData);
    } catch (error) {
      console.error('Error updating donation status:', error);
      throw error;
    }
  },

  // Get donation statistics
  async getDonationStats(): Promise<DonationStats> {
    try {
      const querySnapshot = await getDocs(collection(db, 'donations'));
      const donations = querySnapshot.docs.map(doc => doc.data()) as Donation[];
      
      const totalDonations = donations.length;
      const totalKgSaved = donations.reduce((sum, donation) => {
        return sum + (donation.unit === 'kg' ? donation.quantity : donation.quantity * 0.5);
      }, 0);
      const totalPeopleFed = donations.reduce((sum, donation) => {
        return sum + (donation.servingSize || donation.quantity);
      }, 0);
      const activeDonations = donations.filter(d => d.status === 'available' || d.status === 'claimed').length;
      const completedDonations = donations.filter(d => d.status === 'completed').length;

      // Generate monthly stats (simplified)
      const monthlyStats = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        
        return {
          month: monthName,
          donations: Math.floor(Math.random() * 50) + 10,
          kgSaved: Math.floor(Math.random() * 200) + 50,
          peopleFed: Math.floor(Math.random() * 300) + 100
        };
      }).reverse();

      return {
        totalDonations,
        totalKgSaved,
        totalPeopleFed,
        activeDonations,
        completedDonations,
        monthlyStats
      };
    } catch (error) {
      console.error('Error getting donation stats:', error);
      throw error;
    }
  }
};