import React from 'react';

function TeamDetailsModal({ team, onClose }) {
  if (!team) return null;

  // Amount formatting function
  const formatPurseAmount = (amount) => {
    if (amount >= 10000000) { // 1 Crore or more
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) { // 1 Lakh or more
      return `₹${(amount / 100000).toFixed(2)}L`;
    } else if (amount >= 1000) { // 1 Thousand or more
      return `₹${(amount / 1000).toFixed(2)}K`;
    } else {
      return `₹${amount.toLocaleString()}`; // Display raw number with commas
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4 py-6 backdrop-blur-sm">
      <div className="bg-white border-2 border-blue-400 rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-md mr-4">
              <span className="text-2xl">{team.logo || team.name.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{team.name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors duration-200"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 rounded-lg shadow-md text-white">
            <p className="text-sm font-medium opacity-90">Current Purse</p>
            <p className="font-bold text-lg mt-1">
              {formatPurseAmount(team.currentPurse)}
            </p>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 rounded-lg shadow-md text-white">
            <p className="text-sm font-medium opacity-90">Initial Purse</p>
            <p className="font-bold text-lg mt-1">
              {formatPurseAmount(team.initialPurse)}
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4 rounded-lg shadow-md text-white">
            <p className="text-sm font-medium opacity-90">Players</p>
            <p className="font-bold text-lg mt-1">{team.players.length}</p>
          </div>
        </div>

        <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Team Composition</h3>
          <div className="grid grid-cols-5 gap-3 text-center">
            <div className="bg-blue-100 text-blue-800 p-3 rounded-lg shadow-md border border-blue-200">
              <p className="font-bold text-lg">{team.players.filter(p => p.category === "Batsman").length}</p>
              <p className="text-xs font-medium">Batsmen</p>
            </div>
            <div className="bg-green-100 text-green-800 p-3 rounded-lg shadow-md border border-green-200">
              <p className="font-bold text-lg">{team.players.filter(p => p.category === "Bowler").length}</p>
              <p className="text-xs font-medium">Bowlers</p>
            </div>
            <div className="bg-purple-100 text-purple-800 p-3 rounded-lg shadow-md border border-purple-200">
              <p className="font-bold text-lg">{team.players.filter(p => p.category === "Keeper").length}</p>
              <p className="text-xs font-medium">Keepers</p>
            </div>
            <div className="bg-yellow-100 text-yellow-800 p-3 rounded-lg shadow-md border border-yellow-200">
              <p className="font-bold text-lg">{team.players.filter(p => p.category === "All-Rounder").length}</p>
              <p className="text-xs font-medium">All-Rounders</p>
            </div>
            <div className="bg-red-100 text-red-800 p-3 rounded-lg shadow-md border border-red-200">
              <p className="font-bold text-lg">{team.players.filter(p => p.category === "Icon").length}</p>
              <p className="text-xs font-medium">Icons</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Players Acquired</h3>
          {team.players.length === 0 ? (
            <div className="bg-white text-gray-500 text-center py-8 rounded-lg border border-gray-200 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="font-medium">No players acquired yet</p>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto custom-scrollbar bg-white rounded-lg border border-gray-200 shadow-inner">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white sticky top-0">
                  <tr>
                    <th className="p-3 text-left font-semibold">Name</th>
                    <th className="p-3 text-left font-semibold">Category</th>
                    <th className="p-3 text-right font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {team.players.map((player, index) => (
                    <tr 
                      key={player.id} 
                      className={`border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-3 font-medium text-gray-800">{player.name}</td>
                      <td className="p-3 text-gray-700">{player.category}</td>
                      <td className="p-3 text-right font-semibold text-green-600">
                        {formatPurseAmount(player.soldPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TeamDetailsModal;