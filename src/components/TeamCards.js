import React, { useState } from 'react';
import { useAuction } from '../contexts/AuctionContext';
import TeamDetailsModal from './TeamDetailsModal';

function TeamCards({ layout = "standard" }) {
  const { teams, leadingTeam } = useAuction();
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Sort teams by remaining purse (highest first)
  const sortedTeams = [...teams].sort((a, b) => b.currentPurse - a.currentPurse);

  // Function to format purse amount with correct units
  const formatPurseAmount = (amount) => {
    if (amount >= 10000000) { // 1 Crore or more
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) { // 1 Lakh or more
      return `₹${(amount / 100000).toFixed(2)} L`;
    } else if (amount >= 1000) { // 1 Thousand or more
      return `₹${(amount / 1000).toFixed(2)}K`;
    } else {
      return `₹${amount.toLocaleString()}`; // Display raw number with commas
    }
  };

  // Function to determine color based on purse percentage
  const getPurseColor = (current, initial) => {
    const percentage = (current / initial) * 100;
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg h-full flex flex-col border-2 border-primary-light overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-primary-dark to-primary-medium text-white">
          <h2 className="text-lg font-bold flex items-center">
            <span className="mr-2">🏆</span> Teams
          </h2>
        </div>
        
        <div 
          className="flex-1 overflow-y-auto p-3 space-y-3 pr-1.5 custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#94a3b8 #e2e8f0'
          }}
        >
          {sortedTeams.map(team => {
            const pursePercentage = (team.currentPurse / team.initialPurse) * 100;
            const isLeading = leadingTeam && leadingTeam.id === team.id;

            return (
              <div
                key={team.id}
                className={`bg-white rounded-xl p-3 shadow-md cursor-pointer relative
                  ${isLeading 
                    ? 'border-l-4 border-r-4 border-r-orange-500 border-l-orange-500 scale-302 ' 
                    : 'border border-gray-200 hover:shadow-lg'} 
                  transition-all duration-200`}
                onClick={() => handleTeamClick(team)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-9 h-9 bg-blue-gray-50 rounded-full flex items-center justify-center mr-3 border border-gray-200 shadow-sm">
                      <span className="text-lg">{team.logo}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 flex-1 truncate">
                        {team.name}
                        {isLeading && (
                          <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                            Leading
                          </span>
                        )}
                      </h3>
                      <div className="text-xs text-gray-500">
                        Players: {team.players.length}/11
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-primary-dark">
                      {formatPurseAmount(team.currentPurse)}
                    </div>
                    <div className="text-xs text-gray-500">Remaining</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className={`${getPurseColor(team.currentPurse, team.initialPurse)} h-1.5 rounded-full transition-all duration-500`}
                    style={{ width: `${pursePercentage}%` }}
                  ></div>
                </div>

                {layout === "standard" && team.players.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="flex flex-wrap gap-1">
                      {team.players.slice(-3).map(player => (
                        <span key={player.id} className="text-xs bg-primary-light bg-opacity-20 text-primary-dark px-1.5 py-0.5 rounded-full truncate max-w-full border border-primary-light border-opacity-30">
                          {player.name}
                        </span>
                      ))}
                      {team.players.length > 3 && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">
                          +{team.players.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedTeam && (
        <TeamDetailsModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
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
    </>
  );
}

export default TeamCards;