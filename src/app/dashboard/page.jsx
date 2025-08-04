'use client'

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // or a redirect component
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <nav className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-violet-500 rounded-lg"></div>
          <h1 className="text-2xl font-bold text-white">Tintio</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Welcome, {user.displayName || user.email}</span>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-pink-500/50 text-white rounded-lg hover:bg-pink-500/80 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="p-8">
        <h2 className="text-4xl font-bold mb-8">Your Dashboard</h2>
        {/* Your dashboard content will go here */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h3 className="text-2xl font-semibold mb-4">My Palettes</h3>
          <p className="text-gray-300">You don't have any saved palettes yet.</p>
          <button className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300">
            Create New Palette
          </button>
        </div>
      </main>
    </div>
  );
}