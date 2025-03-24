import React, { useState } from 'react';
import { useAuction } from '../contexts/AuctionContext';
import { useNavigate } from 'react-router-dom';
import TeamCards from './TeamCards';
import PlayerCard from './PlayerCard';
import BidHistory from './BidHistory';
import PlayerQueue from './PlayerQueue';
import SetNavigationModal from './SetNavigationModal';
import DataManagementModal from './DataManagementModal';

function AuctionDashboard() {
  const { currentPlayer, setDeviceRole, resetDeviceRole } = useAuction();
  const navigate = useNavigate();
  const [showSetModal, setShowSetModal] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  const handleLogout = () => {
    // Reset device role in context
    // resetDeviceRole();
    
    // Clear any stored team/admin data
    localStorage.removeItem('auction_deviceRole');
    setDeviceRole(null)
    // Navigate to login screen
    navigate("/admin-login");
  };

  return (
    <div className="bg-gradient-to-tr from-[#0f172a] via-[#1e3a8a] to-[#3b82f6] p-6 overflow-y-auto min-h-screen">
      {/* Header with Set Selector and Logout Buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-white flex items-center">
          <span className="mr-3">🏏</span> 
          IPL Auction Dashboard
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-5 py-2.5 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-colors duration-150 font-semibold flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
          <button
            onClick={() => setShowDataModal(true)}
            className="px-5 py-2.5 bg-white text-primary-dark rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-150 font-semibold flex items-center"
          >
            <span className="mr-2">📊</span> Manage Data
          </button>
          <button
            onClick={() => setShowSetModal(true)}
            className="px-5 py-2.5 bg-primary-accent text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-150 font-semibold flex items-center"
          >
            <span className="mr-2">📋</span> Change Set
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-9rem)]">
        {/* Teams Section */}
        <div className="lg:col-span-3 overflow-y-auto bg-blue-gray-50 rounded-xl shadow-lg">
          <TeamCards layout="compact" />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-6 h-auto">
          {currentPlayer ? (
            <div className="h-full flex flex-col">
              <PlayerCard />
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-lg text-center h-full flex items-center justify-center border-2 border-primary-light">
              <div>
                <div className="w-20 h-20 mx-auto bg-primary-light rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h2 className="text-2xl font-bold text-primary-dark mb-2">Auction Complete</h2>
                <p className="text-gray-600">All players have been sold or no players available in current set.</p>
                <button
                  onClick={() => setShowSetModal(true)}
                  className="mt-6 px-6 py-3 bg-gradient-to-r from-primary-dark to-primary-medium text-white rounded-lg hover:shadow-lg transition-all duration-200 font-semibold"
                >
                  Select Another Set
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Upcoming Players and Bid History */}
        <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <PlayerQueue />
          </div>
          <div className="flex-1 overflow-y-auto">
            <BidHistory />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSetModal && (
        <SetNavigationModal onClose={() => setShowSetModal(false)} />
      )}
      {showDataModal && <DataManagementModal onClose={() => setShowDataModal(false)} />}
      
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Confirm Logout</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to log out? Any unsaved changes will be lost.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-150 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-150 font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuctionDashboard;