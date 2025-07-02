import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MapPin, Calendar, Star, MessageCircle, Heart, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface CommunityMember {
  id: string;
  name: string;
  type: 'donor' | 'ngo' | 'volunteer';
  location: string;
  joinDate: string;
  contributions: number;
  rating: number;
  avatar?: string;
  organizationName?: string;
  specialties?: string[];
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  attendees: number;
  maxAttendees: number;
  type: 'food-drive' | 'awareness' | 'training' | 'cleanup';
}

export default function CommunityPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('members');
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    // Simulate loading community data
    setTimeout(() => {
      setMembers([
        {
          id: '1',
          name: 'Green Garden Restaurant',
          type: 'donor',
          location: 'Mumbai, Maharashtra',
          joinDate: '2024-01-15',
          contributions: 45,
          rating: 4.8,
          organizationName: 'Green Garden Restaurant',
          specialties: ['Indian Cuisine', 'Vegetarian']
        },
        {
          id: '2',
          name: 'Hope Foundation',
          type: 'ngo',
          location: 'Delhi, NCR',
          joinDate: '2024-02-01',
          contributions: 120,
          rating: 4.9,
          organizationName: 'Hope Foundation',
          specialties: ['Child Welfare', 'Community Outreach']
        },
        {
          id: '3',
          name: 'Rajesh Kumar',
          type: 'volunteer',
          location: 'Bangalore, Karnataka',
          joinDate: '2024-03-10',
          contributions: 28,
          rating: 4.7,
          specialties: ['Food Delivery', 'Event Organization']
        },
        {
          id: '4',
          name: 'Helping Hands NGO',
          type: 'ngo',
          location: 'Chennai, Tamil Nadu',
          joinDate: '2024-01-20',
          contributions: 85,
          rating: 4.6,
          organizationName: 'Helping Hands NGO',
          specialties: ['Elderly Care', 'Food Distribution']
        },
        {
          id: '5',
          name: 'Priya Sharma',
          type: 'volunteer',
          location: 'Pune, Maharashtra',
          joinDate: '2024-02-15',
          contributions: 32,
          rating: 4.8,
          specialties: ['Social Media', 'Awareness Campaigns']
        }
      ]);

      setEvents([
        {
          id: '1',
          title: 'Community Food Drive',
          description: 'Join us for a large-scale food collection drive in the city center',
          date: '2024-12-25',
          location: 'City Center, Mumbai',
          organizer: 'Hope Foundation',
          attendees: 45,
          maxAttendees: 100,
          type: 'food-drive'
        },
        {
          id: '2',
          title: 'Food Waste Awareness Workshop',
          description: 'Learn about food waste reduction techniques and sustainable practices',
          date: '2024-12-30',
          location: 'Community Hall, Delhi',
          organizer: 'Green Warriors',
          attendees: 23,
          maxAttendees: 50,
          type: 'awareness'
        },
        {
          id: '3',
          title: 'Volunteer Training Session',
          description: 'Training session for new volunteers on food handling and distribution',
          date: '2025-01-05',
          location: 'NGO Office, Bangalore',
          organizer: 'Helping Hands NGO',
          attendees: 12,
          maxAttendees: 25,
          type: 'training'
        }
      ]);

      setIsLoading(false);
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'donor': return '🏪';
      case 'ngo': return '🏛️';
      case 'volunteer': return '👤';
      default: return '👤';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'donor': return 'bg-green-100 text-green-800';
      case 'ngo': return 'bg-blue-100 text-blue-800';
      case 'volunteer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'food-drive': return '🍽️';
      case 'awareness': return '📢';
      case 'training': return '📚';
      case 'cleanup': return '🧹';
      default: return '📅';
    }
  };

  const tabs = [
    { id: 'members', label: 'Community Members', icon: Users },
    { id: 'events', label: 'Events & Activities', icon: Calendar },
    { id: 'leaderboard', label: 'Leaderboard', icon: Award }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
          <p className="text-gray-600">Connect with fellow food warriors and join community initiatives</p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Donors</p>
                <p className="text-2xl font-bold text-gray-900">342</p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NGO Partners</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-green-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Volunteers</p>
                <p className="text-2xl font-bold text-gray-900">816</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg border border-green-100 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Members Tab */}
            {activeTab === 'members' && (
              <div>
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {members.map((member, index) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                              {getTypeIcon(member.type)}
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{member.name}</h3>
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(member.type)}`}>
                                {member.type.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{member.rating}</span>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{member.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Heart className="h-4 w-4" />
                            <span>{member.contributions} contributions</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Joined {new Date(member.joinDate).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {member.specialties && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {member.specialties.map(specialty => (
                                <span
                                  key={specialty}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <button className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                          <MessageCircle className="h-4 w-4" />
                          <span>Connect</span>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Events Tab */}
            {activeTab === 'events' && (
              <div>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {events.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{getEventTypeIcon(event.type)}</div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                              <p className="text-gray-600">{event.description}</p>
                            </div>
                          </div>
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {event.attendees}/{event.maxAttendees} attending
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>By {event.organizer}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <button className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
                            Join Event
                          </button>
                          <button className="border border-green-600 text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors">
                            Learn More
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Leaderboard Tab */}
            {activeTab === 'leaderboard' && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contributors This Month</h3>
                  <div className="space-y-4">
                    {members
                      .sort((a, b) => b.contributions - a.contributions)
                      .slice(0, 10)
                      .map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-yellow-500' :
                              index === 1 ? 'bg-gray-400' :
                              index === 2 ? 'bg-orange-500' : 'bg-green-500'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
                              {getTypeIcon(member.type)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{member.name}</h4>
                              <p className="text-sm text-gray-600">{member.location}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{member.contributions}</p>
                            <p className="text-sm text-gray-600">contributions</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}