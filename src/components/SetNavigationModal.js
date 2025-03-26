import React from 'react';
import { useAuction } from '../contexts/AuctionContext';

function SetNavigationModal({ onClose }) {
  const { sets, currentSet, changeSet, players } = useAuction();

  // Calculate set progress
  const getSetProgress = (set) => {
    const setPlayers = players?.filter((p) => p.set === set) || [];
    const soldPlayers = setPlayers.filter((p) => p.status === 'Sold');
    const availablePlayers = setPlayers.filter((p) => p.status === 'Available');

    return {
      total: setPlayers.length,
      sold: soldPlayers.length,
      available: availablePlayers.length,
      percentage: setPlayers.length ? (soldPlayers.length / setPlayers.length) * 100 : 0,
    };
  };

  const handleSetChange = (set) => {
    if (set !== currentSet) {
      changeSet(set);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#120e51] p-5 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Select Player Set</h2>
          <button 
            onClick={onClose} 
            className="text-white hover:text-[#93c5fd] transition-colors focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
            {sets?.map((set) => {
              const progress = getSetProgress(set);
              const isActive = set === currentSet;
              const isSold = progress.sold === progress.total && progress.total > 0;
              const isUnsold = set === 'Unsold';
              const progressPercent = progress.percentage.toFixed(0);

              return (
                <div
                  key={set}
                  className={`rounded-lg cursor-pointer transition-all duration-200 overflow-hidden border ${
                    isActive 
                      ? 'border-[#3b82f6] shadow-md' 
                      : isSold && !isUnsold
                        ? 'border-gray-200 opacity-70' 
                        : isUnsold 
                          ? progress.available > 0 
                            ? 'border-amber-400 shadow-md' 
                            : 'border-gray-200 opacity-70'
                          : 'border-gray-200 hover:border-[#93c5fd] hover:shadow-md'
                  }`}
                  onClick={() => {
                    if (isUnsold && progress.available === 0) {
                      return; // Don't allow clicking if Unsold set is empty
                    }
                    if (!isSold || isUnsold) handleSetChange(set);
                  }}
                >
                  <div className={`p-4 ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#3b82f6]/10 to-[#93c5fd]/20' 
                      : isSold && !isUnsold
                        ? 'bg-gray-50' 
                        : isUnsold
                          ? progress.available > 0
                            ? 'bg-amber-50'
                            : 'bg-gray-50'
                          : 'bg-white hover:bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          isActive 
                            ? 'text-[#1e3a8a]' 
                            : isUnsold && progress.available > 0
                              ? 'text-amber-600'
                              : 'text-gray-700'
                        }`}>
                          {set}
                        </span>
                        {isActive && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-[#93c5fd] text-[#1e3a8a] font-medium">
                            Current
                          </span>
                        )}
                        {/* {isUnsold && progress.available > 0 && !isActive && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-800 font-medium">
                            Re-Auction
                          </span>
                        )} */}
                      </div>
                      <div className="flex items-center">
                        {isUnsold ? (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            progress.available > 0 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {progress.available} Available
                          </span>
                        ) : (
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                            isSold 
                              ? 'bg-[#d1fae5] text-[#10b981]' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {progress.sold}/{progress.total}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {isUnsold ? (
                      // Special progress bar for unsold players
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            progress.available > 0 
                              ? 'bg-amber-400' 
                              : 'bg-gray-300'
                          }`}
                          style={{ width: progress.available > 0 ? '100%' : '0%' }}
                        ></div>
                      </div>
                    ) : (
                      // Normal progress bar for other sets
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${
                            isSold 
                              ? 'bg-[#10b981]' 
                              : isActive 
                                ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]' 
                                : 'bg-[#3b82f6]'
                          }`}
                          style={{ width: `${progress.percentage}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {isSold && !isUnsold && (
                      <div className="mt-2 text-xs text-[#10b981] font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Completed
                      </div>
                    )}
                    
                    {isUnsold && progress.available === 0 && (
                      <div className="mt-2 text-xs text-gray-500 font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        No unsold players
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button 
              onClick={onClose} 
              className="px-5 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white rounded-lg shadow-md hover:shadow-lg transition-all font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SetNavigationModal;