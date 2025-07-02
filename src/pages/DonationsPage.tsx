import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Clock, Users, Package, Filter, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { donationService } from '../services/donationService';
import { Donation } from '../types/donation';
import DonationCard from '../components/DonationCard';
import CreateDonationModal from '../components/CreateDonationModal';
import toast from 'react-hot-toast';

export default function DonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadDonations();
  }, []);

  useEffect(() => {
    filterDonations();
  }, [donations, searchTerm, filterCategory, filterStatus]);

  const loadDonations = async () => {
    try {
      setIsLoading(true);
      const data = user?.userType === 'donor' 
        ? await donationService.getDonationsByUser(user.uid)
        : await donationService.getAvailableDonations();
      setDonations(data);
    } catch (error) {
      toast.error('Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  };

  const filterDonations = () => {
    let filtered = donations;

    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(donation => donation.category === filterCategory);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(donation => donation.status === filterStatus);
    }

    setFilteredDonations(filtered);
  };

  const handleDonationCreated = () => {
    setShowCreateModal(false);
    loadDonations();
    toast.success('Donation created successfully!');
  };

  const handleClaimDonation = async (donationId: string) => {
    if (!user) return;

    try {
      await donationService.claimDonation(donationId, {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        phone: user.phone,
        organizationName: user.organizationName
      });
      
      loadDonations();
      toast.success('Donation claimed successfully!');
    } catch (error) {
      toast.error('Failed to claim donation');
    }
  };

  const handleUpdateStatus = async (donationId: string, status: Donation['status']) => {
    try {
      await donationService.updateDonationStatus(donationId, status);
      loadDonations();
      toast.success('Status updated successfully!');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'cooked-food', label: 'Cooked Food' },
    { value: 'raw-ingredients', label: 'Raw Ingredients' },
    { value: 'packaged-food', label: 'Packaged Food' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'other', label: 'Other' }
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'available', label: 'Available' },
    { value: 'claimed', label: 'Claimed' },
    { value: 'picked-up', label: 'Picked Up' },
    { value: 'completed', label: 'Completed' }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {user.userType === 'donor' ? 'My Donations' : 'Available Food Donations'}
            </h1>
            <p className="text-gray-600">
              {user.userType === 'donor' 
                ? 'Manage your food donations and track their impact'
                : 'Find and claim food donations in your area'
              }
            </p>
          </div>
          
          {user.userType === 'donor' && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="mt-4 sm:mt-0 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Donation</span>
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
                setFilterStatus('all');
              }}
              className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Donations Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredDonations.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No donations found</h3>
            <p className="text-gray-600">
              {user.userType === 'donor' 
                ? 'Start by creating your first donation'
                : 'Check back later for new donations'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DonationCard
                  donation={donation}
                  onClaim={handleClaimDonation}
                  onUpdateStatus={handleUpdateStatus}
                  currentUser={user}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Create Donation Modal */}
      {showCreateModal && (
        <CreateDonationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleDonationCreated}
        />
      )}
    </div>
  );
}