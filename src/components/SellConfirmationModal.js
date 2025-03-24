import React from 'react';
import { useAuction } from '../contexts/AuctionContext';

function SellConfirmationModal({ onClose }) {
  const { currentPlayer, currentBid, leadingTeam, confirmSale } = useAuction();

  const handleConfirm = () => {
    confirmSale();
    onClose();
  };

  // Format the price for display
  const formattedPrice = (currentBid / 100000).toFixed(1);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3730a3] p-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">🏏</span> Confirm Player Sale
          </h2>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Player and Team Info */}
          <div className="mb-6 bg-gradient-to-r from-[#3730a3]/10 to-[#3b82f6]/10 p-4 rounded-lg border-l-4 border-[#3b82f6]">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Player:</span>
                <span className="text-[#1e3a8a] font-bold text-lg">{currentPlayer?.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Team:</span>
                <span className="text-[#1e3a8a] font-bold flex items-center">
                  <span className="mr-2 text-base">{leadingTeam?.logo}</span>
                  {leadingTeam?.name}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Winning Bid:</span>
                <span className="bg-[#93c5fd] text-[#1e3a8a] font-bold py-1 px-3 rounded-full">
                  ₹{formattedPrice}L
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-700 mb-6 text-center">
            Are you sure you want to confirm this sale?
          </p>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#10b981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              Confirm Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellConfirmationModal;