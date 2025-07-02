import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Package, MapPin, Calendar, Award, Leaf, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { donationService } from '../services/donationService';
import { DonationStats } from '../types/donation';

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const data = await donationService.getDonationStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const impactData = [
    { name: 'Food Saved', value: stats?.totalKgSaved || 0, color: '#10B981', icon: Package },
    { name: 'People Fed', value: stats?.totalPeopleFed || 0, color: '#3B82F6', icon: Users },
    { name: 'Donations', value: stats?.totalDonations || 0, color: '#8B5CF6', icon: Heart },
    { name: 'CO₂ Saved', value: Math.round((stats?.totalKgSaved || 0) * 2.5), color: '#F59E0B', icon: Leaf },
  ];

  const categoryData = [
    { name: 'Cooked Food', value: 45, color: '#10B981' },
    { name: 'Raw Ingredients', value: 25, color: '#3B82F6' },
    { name: 'Packaged Food', value: 20, color: '#8B5CF6' },
    { name: 'Beverages', value: 10, color: '#F59E0B' },
  ];

  const environmentalImpact = [
    { metric: 'Water Saved', value: `${((stats?.totalKgSaved || 0) * 1000).toLocaleString()} L`, icon: '💧' },
    { metric: 'CO₂ Reduced', value: `${Math.round((stats?.totalKgSaved || 0) * 2.5)} kg`, icon: '🌱' },
    { metric: 'Land Saved', value: `${Math.round((stats?.totalKgSaved || 0) * 0.1)} m²`, icon: '🌍' },
    { metric: 'Energy Saved', value: `${Math.round((stats?.totalKgSaved || 0) * 3)} kWh`, icon: '⚡' },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Impact</h1>
          <p className="text-gray-600">Track your contribution to reducing food waste and helping communities</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {[
              { value: '1month', label: '1 Month' },
              { value: '3months', label: '3 Months' },
              { value: '6months', label: '6 Months' },
              { value: '1year', label: '1 Year' }
            ].map(range => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-green-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {impactData.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: `${item.color}20` }}>
                      <item.icon className="h-6 w-6" style={{ color: item.color }} />
                    </div>
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {item.value.toLocaleString()}
                    {item.name === 'Food Saved' && ' kg'}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.name}</p>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Monthly Trends */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Impact Trends</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats?.monthlyStats || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="kgSaved" stroke="#10B981" strokeWidth={2} name="Kg Saved" />
                    <Line type="monotone" dataKey="peopleFed" stroke="#3B82F6" strokeWidth={2} name="People Fed" />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Food Categories */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Food Categories Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Environmental Impact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-green-100 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Environmental Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {environmentalImpact.map((item, index) => (
                  <div key={item.metric} className="text-center">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{item.value}</div>
                    <div className="text-sm text-gray-600">{item.metric}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-green-100 mb-8"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Achievements & Milestones</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Food Hero</h4>
                  <p className="text-sm text-gray-600">Saved over 100kg of food</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Community Champion</h4>
                  <p className="text-sm text-gray-600">Fed over 500 people</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Leaf className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-gray-900">Eco Warrior</h4>
                  <p className="text-sm text-gray-600">Reduced 250kg CO₂ emissions</p>
                </div>
              </div>
            </motion.div>

            {/* Recent Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats?.monthlyStats?.slice(-7) || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="donations" fill="#10B981" name="Donations" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}