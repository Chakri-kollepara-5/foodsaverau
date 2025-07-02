export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  foodType: string;
  quantity: number;
  unit: 'kg' | 'portions' | 'items';
  description: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  availableUntil: string;
  createdAt: string;
  status: 'available' | 'claimed' | 'picked-up' | 'completed' | 'expired';
  claimedBy?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    organizationName?: string;
  };
  claimedAt?: string;
  pickupTime?: string;
  completedAt?: string;
  images?: string[];
  category: 'cooked-food' | 'raw-ingredients' | 'packaged-food' | 'beverages' | 'other';
  servingSize?: number;
  allergens?: string[];
  specialInstructions?: string;
}

export interface DonationStats {
  totalDonations: number;
  totalKgSaved: number;
  totalPeopleFed: number;
  activeDonations: number;
  completedDonations: number;
  monthlyStats: {
    month: string;
    donations: number;
    kgSaved: number;
    peopleFed: number;
  }[];
}