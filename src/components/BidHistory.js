import React from 'react';
import { useAuction } from '../contexts/AuctionContext';

function BidHistory() {
  const { bidHistory, teams } = useAuction();

  // Helper to get team logo
  const getTeamLogo = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.logo : '';
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col border-2 border-primary-light overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary-dark to-primary-medium text-white">
        <h2 className="text-lg font-bold flex items-center">
          <span className="mr-2">📈</span> Bid History
        </h2>
      </div>

      {bidHistory.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-6 bg-blue-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl text-gray-400">💤</span>
            </div>
            <p className="text-gray-500">No bids placed yet</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {bidHistory.slice().reverse().map((bid, index) => (
            <div
              key={bid.id}
              className={`flex items-center p-3 rounded-lg mb-2 transition-all ${index === 0
                  ? 'bg-primary-light bg-opacity-20 border-l-4 border-primary-accent shadow-sm'
                  : 'bg-gray-50 hover:bg-gray-100'
                }`}
            >
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3 shadow-sm border border-gray-200">
                <span className="text-xl">{getTeamLogo(bid.teamId)}</span>
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-800 text-sm">{bid.teamName}</p>
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="mr-1">🕒</span> {formatTime(bid.timestamp)}
                </p>
              </div>
              <div className="text-sm font-bold bg-gray-100 text-primary-dark py-1 px-3 rounded-full">
                ₹{(bid.amount / 100000).toFixed(1)}L
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #94a3b8;
          border-radius: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #64748b;
        }
      `}</style>
    </div>
  );
}

export default BidHistory;