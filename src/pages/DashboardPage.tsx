import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import WelcomeMessage from '../components/WelcomeMessage';
import { BarChart3, Users, Heart, MapPin, Calendar, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const stats = [
    { label: 'Food Donated', value: '2,847', unit: 'kg', icon: Heart, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'People Fed', value: '1,523', unit: 'people', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Locations', value: '24', unit: 'locations', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'This Month', value: '342', unit: 'kg saved', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  ];

  const recentActivity = [
    { id: 1, type: 'donation', message: 'New donation from Green Garden Restaurant', time: '2 hours ago', status: 'pending' },
    { id: 2, type: 'pickup', message: 'Food collected by Hope Foundation', time: '4 hours ago', status: 'completed' },
    { id: 3, type: 'delivery', message: 'Delivered to Community Center', time: '6 hours ago', status: 'completed' },
    { id: 4, type: 'donation', message: 'Surplus from Tech Conference', time: '1 day ago', status: 'available' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <WelcomeMessage user={user} isNewUser={false} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                    <span className="text-sm font-normal text-gray-500 ml-1">{stat.unit}</span>
                  </p>
                </div>
                <div className={`${stat.bg} p-3 rounded-lg`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {user.userType === 'donor' && (
                <>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-left">
                    + Add New Food Donation
                  </button>
                  <button className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors text-left">
                    View My Donations
                  </button>
                </>
              )}
              
              {user.userType === 'ngo' && (
                <>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-left">
                    Browse Available Food
                  </button>
                  <button className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors text-left">
                    Schedule Pickup
                  </button>
                </>
              )}
              
              {user.userType === 'volunteer' && (
                <>
                  <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-left">
                    Find Delivery Tasks
                  </button>
                  <button className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg font-medium hover:bg-green-200 transition-colors text-left">
                    My Volunteer History
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'completed' ? 'bg-green-500' :
                      activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {activity.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Impact Chart Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-green-100"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Food Waste Impact</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg p-8 text-center">
            <p className="text-green-700 font-medium">Interactive charts and analytics coming soon!</p>
            <p className="text-green-600 text-sm mt-2">Track your environmental impact and community contribution</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}