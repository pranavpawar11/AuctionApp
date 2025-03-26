import React, { useState } from 'react';
import { useAuction } from '../contexts/AuctionContext';
import BidControls from './BidControls';
import SellConfirmationModal from './SellConfirmationModal';
import UnsoldConfirmationModal from './UnsoldConfirmationModal';
function PlayerCard() {
  const { currentPlayer, currentBid, leadingTeam } = useAuction();
  const [showSellModal, setShowSellModal] = useState(false);
  const [showUnsoldModal, setShowUnsoldModal] = useState(false); // Add this line
  if (!currentPlayer) return null;

  // Function to get a color based on category
  const getCategoryColor = (category) => {
    const colors = {
      'Batsman': 'bg-blue-100 text-blue-800 border-blue-200',
      'Bowler': 'bg-green-100 text-green-800 border-green-200',
      'Keeper': 'bg-purple-100 text-purple-800 border-purple-200',
      'All-Rounder': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Icon': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-full h-full mx-auto flex flex-col border-2 border-primary-light overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-blue-gray-50">
        <div>
          <h2 className="text-2xl font-bold text-primary-dark">{currentPlayer.name}</h2>
          <div className="flex items-center mt-2 space-x-2">
            <span className="text-gray-600 text-sm">Base Price:</span>
            <span className="bg-primary-light bg-opacity-30 text-primary-dark px-3 py-1 rounded-full text-sm font-semibold">
              ₹{(currentPlayer.basePrice / 100000).toFixed(1)}L
            </span>
          </div>
        </div>
        <div className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getCategoryColor(currentPlayer.category)}`}>
          {currentPlayer.category}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-light to-primary-accent bg-opacity-20 rounded-full flex items-center justify-center shadow-md overflow-hidden">
                {currentPlayer.avatar ? (
                  <img
                    src="./avatar.jpeg"
                    alt={currentPlayer.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8qDK_ZZe8U1MKQKs1wN0iFkGT7o2G4--gFg&s"
                    alt={currentPlayer.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                  // <span className="text-5xl font-light text-white">
                  //   {currentPlayer.name.charAt(0)}
                  // </span>
                )}
              </div>
            </div>


            <div className="grid grid-cols-2 gap-4">
              {currentPlayer.stats && Object.entries(currentPlayer.stats).map(([key, value]) => (
                <div key={key} className="bg-blue-gray-50 p-4 rounded-xl border border-gray-200 transition-transform hover:scale-105 duration-200">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">{key}</p>
                  <p className="text-xl font-bold text-primary-dark mt-1">{value}</p>
                </div>
              ))}
              <div className="bg-blue-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Role</p>
                <p className="text-lg font-bold text-primary-dark mt-1">{currentPlayer.role}</p>
              </div>
            </div>


            <div className="bg-blue-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Description</p>
              <p className="text-primary-dark mt-1">{currentPlayer.description}</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-secondary-yellow to-secondary-orange-dark p-5 rounded-xl shadow-md text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white text-opacity-90 font-medium">Current Bid</span>
                <span className="text-3xl font-bold">
                  ₹{((currentBid || currentPlayer.basePrice) / 100000).toFixed(1)}L
                </span>
              </div>
              {leadingTeam && (
                <div className="flex justify-between items-center">
                  <span className="text-white text-opacity-90 font-medium">Leading Team</span>
                  <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-1.5 rounded-lg">
                    <span className="text-lg">{leadingTeam.logo}</span>
                    <span className="font-semibold">{leadingTeam.name}</span>
                  </div>
                </div>
              )}

            </div>



            <BidControls />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          {!currentBid || !leadingTeam ? (
            // If no bidding has started, show only "Mark Unsold" button
            <button
              onClick={() => setShowUnsoldModal(true)}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-red-400 to-red-900 hover:shadow-lg text-white"
            >
              Mark Unsold
            </button>
          ) : (
            // Once bidding starts, show only "Confirm Sale" button
            <button
              onClick={() => setShowSellModal(true)}
              className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-success to-success hover:shadow-lg text-white"
            >
              Confirm Sale
            </button>
          )}
        </div>
      </div>

      {showSellModal && <SellConfirmationModal onClose={() => setShowSellModal(false)} />}
      {showUnsoldModal && <UnsoldConfirmationModal onClose={() => setShowUnsoldModal(false)} />} {/* Add this line */}
    </div>
  );
}

export default PlayerCard;