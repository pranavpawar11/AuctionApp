import React from 'react';
import { useAuction } from '../contexts/AuctionContext';

function SetNavigation() {
  const { sets, currentSet, changeSet, players } = useAuction();

  // Calculate set progress
  const getSetProgress = (set) => {
    const setPlayers = players.filter(p => p.set === set);
    const soldPlayers = setPlayers.filter(p => p.status === 'Sold');
    return {
      total: setPlayers.length,
      sold: soldPlayers.length,
      percentage: setPlayers.length ? (soldPlayers.length / setPlayers.length) * 100 : 0
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100">
      <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3730a3] p-4">
        <h2 className="text-lg font-bold text-white">Player Sets</h2>
      </div>
      
      <div className="p-4">
        <div className="space-y-3">
          {sets.map(set => {
            const progress = getSetProgress(set);
            const isActive = set === currentSet;
            const isSold = progress.sold === progress.total;
            const progressPercent = progress.percentage.toFixed(0);

            return (
              <div 
                key={set}
                className={`rounded-lg cursor-pointer transition-all duration-200 overflow-hidden ${
                  isSold ? 'opacity-70' : ''
                }`}
                onClick={() => changeSet(set)}
              >
                <div className={`p-3.5 ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#3730a3]/10 to-[#3b82f6]/10 border-l-4 border-[#3b82f6]' 
                    : 'bg-gray-50 hover:bg-gray-100 border-l-4 border-transparent'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <span className={`font-semibold text-[15px] ${
                        isActive ? 'text-[#1e3a8a]' : 'text-gray-700'
                      }`}>
                        {set}
                      </span>
                      {isActive && (
                        <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-[#93c5fd] text-[#1e3a8a]">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">
                        {progress.sold}/{progress.total}
                      </span>
                      <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                        isSold 
                          ? 'bg-[#d1fae5] text-[#10b981]' 
                          : isActive 
                            ? 'bg-[#93c5fd]/50 text-[#3b82f6]' 
                            : 'bg-gray-200 text-gray-500'
                      }`}>
                        {progressPercent}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isSold 
                          ? 'bg-[#10b981]' 
                          : isActive 
                            ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]'
                            : 'bg-gray-400'
                      }`}
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SetNavigation;