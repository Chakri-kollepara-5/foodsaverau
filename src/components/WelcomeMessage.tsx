import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Users } from 'lucide-react';
import { User } from '../types/auth';

interface WelcomeMessageProps {
  user: User;
  isNewUser?: boolean;
}

export default function WelcomeMessage({ user, isNewUser = false }: WelcomeMessageProps) {
  // ✅ Safe name display
  const displayName = user?.name || "Friend";

  const getUserTypeIcon = () => {
    switch (user.userType) {
      case 'donor':
        return <Heart className="h-6 w-6 text-green-500" />;
      case 'ngo':
        return <Users className="h-6 w-6 text-green-500" />;
      case 'volunteer':
        return <Sparkles className="h-6 w-6 text-green-500" />;
      default:
        return <Sparkles className="h-6 w-6 text-green-500" />;
    }
  };

  const getUserTypeDescription = () => {
    switch (user.userType) {
      case 'donor':
        return "Start sharing your excess food with those who need it most.";
      case 'ngo':
        return "Connect with food donors and coordinate distribution to communities.";
      case 'volunteer':
        return "Help bridge the gap between donors and those in need.";
      default:
        return "Manage the platform and support our community.";
    }
  };

  const getWelcomeMessage = () => {
    if (isNewUser) {
      return {
        title: `Welcome to FoodShare, ${displayName}! 🎉`,
        subtitle: `Account created successfully! You're now part of our mission to end food waste.`,
        description: getUserTypeDescription(),
      };
    }

    return {
      title: `Welcome back, ${displayName}! 👋`,
      subtitle: `Ready to make a difference in the fight against food waste?`,
      description: getUserTypeDescription(),
    };
  };

  const { title, subtitle, description } = getWelcomeMessage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-green-100"
    >
      <div className="flex items-start space-x-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="bg-green-50 p-3 rounded-full"
        >
          {getUserTypeIcon()}
        </motion.div>

        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold text-gray-900 mb-2"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-green-700 font-medium mb-2"
          >
            {subtitle}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
