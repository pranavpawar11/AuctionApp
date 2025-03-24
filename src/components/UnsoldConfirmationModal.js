import React from 'react';
import { useAuction } from '../contexts/AuctionContext';

function UnsoldConfirmationModal({ onClose }) {
  const { currentPlayer, moveToNextPlayer } = useAuction();

  const handleConfirm = () => {
    moveToNextPlayer();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fadeIn">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#f87171] to-[#ef4444] p-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">🏏</span> Mark Player as Unsold
          </h2>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Player Info */}
          <div className="mb-6 bg-gradient-to-r from-[#f87171]/10 to-[#ef4444]/10 p-4 rounded-lg border-l-4 border-[#ef4444]">
            <div className="flex flex-col space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Player:</span>
                <span className="text-[#b91c1c] font-bold text-lg">{currentPlayer?.name}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Category:</span>
                <span className="text-[#b91c1c] font-bold">{currentPlayer?.category}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Base Price:</span>
                <span className="bg-[#fca5a5] text-[#b91c1c] font-bold py-1 px-3 rounded-full">
                  ₹{(currentPlayer?.basePrice / 100000).toFixed(1)}L
                </span>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-gray-700 mb-6 text-center">
            Are you sure you want to mark this player as unsold and move to the next player?
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#f87171] to-[#ef4444] hover:from-[#ef4444] hover:to-[#dc2626] text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            >
              Confirm Unsold
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnsoldConfirmationModal;