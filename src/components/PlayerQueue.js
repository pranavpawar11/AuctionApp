import React from 'react';
import { useAuction } from '../contexts/AuctionContext';

function PlayerQueue() {
  const { players, currentSet, currentPlayer } = useAuction();
  // Get upcoming players in the current set
  const upcomingPlayers = players
    .filter(p => p.set === currentSet && p.status === 'Available' && (!currentPlayer || p.id !== currentPlayer.id))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-lg h-full flex flex-col border-2 border-primary-light overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-primary-dark to-primary-medium text-white">
        <h2 className="text-lg font-bold flex items-center">
          <span className="mr-2">🔜</span> Upcoming Players
        </h2>
      </div>
      
      {upcomingPlayers.length > 0 ? (
        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
          {upcomingPlayers.map((player, index) => (
            <div 
              key={player.id} 
              className={`bg-gradient-to-r from-gray-50 to-blue-gray-50 p-3 rounded-lg border border-gray-200 transition-transform hover:scale-102 duration-200 ${
                index === 0 ? 'shadow-md' : 'shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start">
                <p className="font-semibold text-gray-800 text-sm">{player.name}</p>
                <span className="text-xs font-bold text-primary-dark bg-primary-light bg-opacity-30 px-2 py-0.5 rounded-full">
                  ₹{(player.basePrice / 100000).toFixed(1)}L
                </span>
              </div>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColorClass(player.category)}`}>
                  {player.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-6 bg-blue-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl text-gray-400">🏁</span>
            </div>
            <p className="text-gray-500">No more players in this set</p>
          </div>
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

// Helper function to get category color classes
function getCategoryColorClass(category) {
  const colors = {
    'Batsman': 'bg-blue-100 text-blue-800 border-blue-200',
    'Bowler': 'bg-green-100 text-green-800 border-green-200',
    'Keeper': 'bg-purple-100 text-purple-800 border-purple-200',
    'All-Rounder': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Icon': 'bg-red-100 text-red-800 border-red-200',
    'Uncapped': 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export default PlayerQueue;