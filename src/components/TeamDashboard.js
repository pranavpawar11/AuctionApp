import React, { useEffect, useState } from 'react';
import { useAuction } from '../contexts/AuctionContext';
import { useNavigate } from 'react-router-dom';

function TeamDashboard() {
  const {
    teams,
    currentPlayer,
    currentBid,
    leadingTeam,
    team,
    isConnected,
    deviceRole,
    deviceId,
    setDeviceRole
  } = useAuction();

  const navigate = useNavigate();
  const [purchasedPlayers, setPurchasedPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Ensure user is logged in as a team
  useEffect(() => {
    if (!localStorage.getItem('selectedTeamId') || deviceRole !== 'team') {
      navigate('/team-login');
    } else {
      setIsLoading(false);
    }
  }, [deviceRole, navigate]);

  // Extract purchased players when team data changes
  useEffect(() => {
    if (team && team.players) {
      setPurchasedPlayers(team.players);
    }
  }, [team]);

  // Update connection status display
  useEffect(() => {
    if (isConnected) {
      setConnectionStatus("Connected");
    } else {
      setConnectionStatus("Connecting to server...");
    }
  }, [isConnected]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('auction_deviceRole');
    localStorage.removeItem('selectedTeamId');
    
    setDeviceRole(null);
    // Navigate to login screen
    navigate("/");
  };

  // Toggle logout confirmation modal
  const toggleLogoutModal = () => {
    setShowLogoutModal(!showLogoutModal);
  };

  // Show loading state if team data is not available
  if (isLoading || !team) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4 border-2 border-blue-400">
          <div className="flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-xl font-bold text-blue-900">Loading team data...</h2>
            <p className="text-blue-600 mt-2 text-center">
              {connectionStatus}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] p-4">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1a2643] to-[#1e3a8a] p-4 fixed top-0 left-0 right-0 shadow-lg z-10">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-xl font-bold text-white">IPL Auction Dashboard</h1>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-400 mr-2"></span>
            <span className="text-sm text-white font-medium">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
      </header>

      {/* Main content with padding to accommodate the fixed header */}
      <div className="max-w-md mx-auto pt-16">
        {/* Connection status */}
        {!isConnected && (
          <div className="mb-4 p-3 bg-orange-100 text-orange-800 rounded-lg shadow-sm border border-orange-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Connecting to auction server...
          </div>
        )}

        {/* Team information */}
        <div className="bg-white rounded-xl p-5 shadow-lg mb-4 border-2 border-blue-400">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">{team.name}</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              Team
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg text-white">
              <p className="text-xs font-medium opacity-90">REMAINING PURSE</p>
              <p className="text-xl font-bold">₹{(team.currentPurse / 100000).toFixed(1)}L</p>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg text-white">
              <p className="text-xs font-medium opacity-90">PLAYERS PURCHASED</p>
              <p className="text-xl font-bold">{purchasedPlayers.length}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-xs text-gray-400 text-right">Device ID: {deviceId.substring(0, 8)}...</p>
            <button 
              onClick={toggleLogoutModal}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium py-1.5 px-3 rounded-md hover:from-red-600 hover:to-red-700 transition-colors shadow-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Current player being auctioned */}
        {currentPlayer ? (
          <div className="bg-white rounded-xl p-5 shadow-lg mb-4 border-2 border-blue-400">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold text-gray-800">Current Player</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 animate-pulse">
                Live Auction
              </span>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
              <h3 className="font-bold text-xl mb-1 text-blue-900">{currentPlayer.name}</h3>
              <div className="flex space-x-2 mb-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                  {currentPlayer.set}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  {currentPlayer.role}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">Base Price: <span className="font-semibold text-blue-600">₹{(currentPlayer.basePrice / 100000).toFixed(1)}L</span></p>

              {/* Player stats */}
              {currentPlayer.stats && (
                <div className="grid grid-cols-3 gap-2 mt-3 bg-white p-2 rounded-lg border border-blue-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Experience</p>
                    <p className="font-semibold text-blue-800">{currentPlayer.stats.experience}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Strike Rate</p>
                    <p className="font-semibold text-blue-800">{currentPlayer.stats.strikeRate}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Style</p>
                    <p className="font-semibold text-blue-800">{currentPlayer.stats.specialty}</p>
                  </div>
                </div>
              )}

              {currentPlayer.description && (
                <p className="text-xs text-gray-600 mt-3 italic">{currentPlayer.description}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-3 rounded-lg text-white">
                <p className="text-xs font-medium">CURRENT BID</p>
                <p className="text-xl font-bold">₹{(currentBid / 100000).toFixed(1)}L</p>
              </div>

              <div className={`p-3 rounded-lg ${leadingTeam?.id === team.id ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-gray-200 to-gray-300'}`}>
                <p className="text-xs font-medium">
                  LEADING TEAM
                </p>
                <p className="text-lg font-bold">
                  {leadingTeam?.name || 'None'}
                  {leadingTeam?.id === team.id && ' (You)'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-5 shadow-lg mb-4 border-2 border-blue-400">
            <div className="flex flex-col items-center justify-center text-center py-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-blue-600 font-medium">No player being auctioned currently</p>
              <p className="text-gray-500 text-sm mt-1">Please wait for the auctioneer to start the next round</p>
            </div>
          </div>
        )}

        {/* Purchased players section */}
        <div className="bg-white rounded-xl p-5 shadow-lg border-2 border-blue-400">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Your Team Squad</h2>
            <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-medium rounded-full px-2.5 py-1">
              {purchasedPlayers.length} Players
            </span>
          </div>

          {purchasedPlayers && purchasedPlayers.length > 0 ? (
            <div className="space-y-3">
              {purchasedPlayers.map((player) => (
                <div key={player.id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-blue-900">{player.name}</p>
                    <p className="text-green-600 font-bold">₹{(player.soldPrice / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="flex space-x-2 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                      {player.set}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                      {player.role || 'Not specified'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-lg border border-blue-100 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p className="text-blue-600 font-medium">No players purchased yet</p>
              <p className="text-gray-500 text-sm mt-2">Build your dream team by bidding in the auction!</p>
            </div>
          )}
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm border-2 border-blue-400 overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
              <h3 className="text-white font-bold text-lg">Confirm Logout</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4 text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Are you sure you want to logout from the auction dashboard?</p>
              </div>
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={toggleLogoutModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-colors font-medium"
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

export default TeamDashboard;