import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Package, Settings, LogOut, ChevronRight, Star, Bell } from 'lucide-react';

export const Profile = () => {
  const { user, profile, loading, login, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: Package, label: 'My Orders', desc: 'Track, return, or buy things again', path: '/orders' },
    { icon: Bell, label: 'Notifications', desc: 'Order updates and alerts', path: '/notifications' },
    { icon: MapPin, label: 'Saved Addresses', desc: 'Manage delivery locations', path: '/addresses' },
    { icon: Settings, label: 'Account Settings', desc: 'Password, notifications, preferences', path: '/settings' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-beige)]">
        <div className="text-[var(--color-terracotta)] font-script text-2xl animate-pulse">
          Opening your profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[var(--color-terracotta)] mb-6 shadow-sm">
          <User size={48} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--color-chocolate)] mb-2">Join Zora's Circle</h2>
        <p className="text-gray-600 mb-8 max-w-xs">
          Log in to track orders, save addresses, and earn loyalty points for free treats!
        </p>
        <button 
          onClick={login}
          className="w-full max-w-xs bg-[var(--color-terracotta)] text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-[var(--color-chocolate)] transition-colors"
        >
          Log In with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-beige)] pb-32">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm px-4 py-4">
        <h1 className="font-script text-3xl text-[var(--color-terracotta)]">Profile</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 shadow-sm flex items-center gap-4 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-sage)] opacity-10 rounded-bl-full" />
          
          <div className="w-16 h-16 bg-[var(--color-beige)] rounded-full flex items-center justify-center text-[var(--color-terracotta)] shrink-0 border-2 border-[var(--color-cream)] overflow-hidden">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
            ) : (
              <User size={32} />
            )}
          </div>
          
          <div className="flex-1 z-10">
            <h2 className="text-xl font-bold text-[var(--color-chocolate)] mb-1">{user.displayName}</h2>
            <p className="text-xs text-gray-400">{user.email}</p>
          </div>
        </motion.div>

        {/* Loyalty Points */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[var(--color-chocolate)] text-[var(--color-cream)] rounded-3xl p-6 shadow-lg relative overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 text-[var(--color-terracotta)] opacity-20">
            <Star size={120} fill="currentColor" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} className="text-yellow-400 fill-yellow-400" />
              <h3 className="font-bold text-lg">Zora's Circle</h3>
            </div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-black">{profile?.points || 0}</span>
              <span className="text-sm opacity-80 mb-1">points</span>
            </div>
            <p className="text-xs opacity-80 max-w-[200px]">
              Earn 1 point for every ₹10 spent. Redeem points for free treats!
            </p>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-sm overflow-hidden"
        >
          {menuItems.map((item, index) => (
            <button 
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className={`w-full flex items-center p-4 transition-colors hover:bg-gray-50 ${
                index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[var(--color-beige)] flex items-center justify-center text-[var(--color-terracotta)] shrink-0 mr-4">
                <item.icon size={20} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-[var(--color-chocolate)] text-sm">{item.label}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-semibold text-sm bg-white rounded-2xl shadow-sm hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </motion.button>
      </div>
    </div>
  );
};
