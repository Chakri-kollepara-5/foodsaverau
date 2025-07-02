import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Users, Package, Phone, Mail, CheckCircle } from 'lucide-react';
import { Donation } from '../types/donation';
import { User } from '../context/AuthContext';

interface DonationCardProps {
  donation: Donation;
  onClaim: (donationId: string) => void;
  onUpdateStatus: (donationId: string, status: Donation['status']) => void;
  currentUser: User;
}

export default function DonationCard({ donation, onClaim, onUpdateStatus, currentUser }: DonationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-yellow-100 text-yellow-800';
      case 'picked-up': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cooked-food': return '🍽️';
      case 'raw-ingredients': return '🥕';
      case 'packaged-food': return '📦';
      case 'beverages': return '🥤';
      default: return '🍽️';
    }
  };

  const isExpired = new Date(donation.availableUntil) < new Date();
  const canClaim = currentUser.userType !== 'donor' && donation.status === 'available' && !isExpired;
  const isDonor = currentUser.uid === donation.donorId;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all duration-300"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getCategoryIcon(donation.category)}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{donation.foodType}</h3>
            <p className="text-sm text-gray-600 capitalize">{donation.category.replace('-', ' ')}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
          {donation.status.replace('-', ' ')}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 line-clamp-2">{donation.description}</p>

      {/* Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Package className="h-4 w-4 mr-2" />
          <span>{donation.quantity} {donation.unit}</span>
          {donation.servingSize && (
            <span className="ml-2">• Serves {donation.servingSize}</span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="truncate">{donation.location.address}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>Available until {new Date(donation.availableUntil).toLocaleDateString()}</span>
        </div>

        {donation.allergens && donation.allergens.length > 0 && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Allergens:</span>
            <span>{donation.allergens.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Donor Info (for NGOs/Volunteers) */}
      {!isDonor && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-gray-900 mb-1">Donor: {donation.donorName}</p>
          {donation.claimedBy && donation.status !== 'available' && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-1" />
              <span>{donation.donorEmail}</span>
            </div>
          )}
        </div>
      )}

      {/* Claimed Info (for donors) */}
      {isDonor && donation.claimedBy && (
        <div className="bg-blue-50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium text-blue-900 mb-1">
            Claimed by: {donation.claimedBy.name}
          </p>
          <div className="flex items-center text-sm text-blue-700">
            <Mail className="h-4 w-4 mr-1" />
            <span>{donation.claimedBy.email}</span>
          </div>
          {donation.claimedBy.phone && (
            <div className="flex items-center text-sm text-blue-700 mt-1">
              <Phone className="h-4 w-4 mr-1" />
              <span>{donation.claimedBy.phone}</span>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        {canClaim && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onClaim(donation.id)}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Claim Donation
          </motion.button>
        )}

        {isDonor && donation.status === 'claimed' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdateStatus(donation.id, 'picked-up')}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Mark as Picked Up
          </motion.button>
        )}

        {isDonor && donation.status === 'picked-up' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdateStatus(donation.id, 'completed')}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Complete</span>
          </motion.button>
        )}

        {currentUser.userType !== 'donor' && donation.status === 'claimed' && donation.claimedBy?.id === currentUser.uid && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdateStatus(donation.id, 'picked-up')}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Confirm Pickup
          </motion.button>
        )}

        {isExpired && donation.status === 'available' && (
          <div className="flex-1 bg-red-100 text-red-800 py-2 px-4 rounded-lg font-medium text-center">
            Expired
          </div>
        )}
      </div>
    </motion.div>
  );
}