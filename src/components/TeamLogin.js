import React, { useState, useEffect } from 'react';
import { useAuction } from '../contexts/AuctionContext';
import { useNavigate } from 'react-router-dom';

function TeamLogin() {
  const {
    teams,
    deviceRole,
    setDeviceAsTeam,
    isConnected,
    setDeviceRole,
    sendMessage
  } = useAuction();

  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [connectionRetries, setConnectionRetries] = useState(0);
  const navigate = useNavigate();

  // Check if already logged in and handle reconnection
  useEffect(() => {
    const storedTeamId = localStorage.getItem('selectedTeamId');
    
    if (storedTeamId && deviceRole === 'team') {
      // If team ID is stored and role is already set, navigate to dashboard
      navigate('/team-dashboard');
    } else if (storedTeamId) {
      // If only team ID is stored, try to re-establish role
      const team = teams.find(t => t.id.toString() === storedTeamId);
      if (team) {
        setDeviceAsTeam(storedTeamId);
        navigate('/team-dashboard');
      } else {
        // Team not found in current teams list, clear localStorage
        localStorage.removeItem('selectedTeamId');
      }
    }
    
    setLoading(false);
  }, [navigate, setDeviceAsTeam, deviceRole, teams]);

  // Handle reconnection attempts
  useEffect(() => {
    if (!isConnected && connectionRetries < 5) {
      const timer = setTimeout(() => {
        setConnectionRetries(prev => prev + 1);
        console.log(`Connection retry attempt ${connectionRetries + 1}`);
        // The socket will try to reconnect automatically via AuctionContext
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isConnected, connectionRetries]);

  // Show connection status
  useEffect(() => {
    if (!isConnected) {
      setError('Connecting to server...');
    } else {
      setError('');
    }
  }, [isConnected]);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();

    if (!isConnected) {
      setError('Not connected to server. Please try again.');
      return;
    }

    const team = teams.find(t => t.id.toString() === teamId.toString());

    if (team && team.password === password) {
      // Set device as team in context (this will trigger socket identity event)
      setDeviceAsTeam(team.id);
      
      // Send notification to server about login
      sendMessage('teamLogin', {
        teamId: team.id,
        timestamp: new Date().toISOString()
      });
      
      navigate('/team-dashboard');
    } else {
      setError('Invalid team ID or password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3a8a] to-[#3730a3]">
        <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg max-w-sm w-full mx-4">
          <div className="flex justify-center">
            <svg className="animate-spin h-10 w-10 text-[#3b82f6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-center mt-4 text-[#1e3a8a]">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] p-4">
      <div className="bg-white bg-opacity-95 p-6 sm:p-8 rounded-xl shadow-lg max-w-sm w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto bg-[#93c5fd] rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1e3a8a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1e3a8a]">Team Login</h2>
          <p className="text-gray-600 text-sm mt-1">Access your team dashboard</p>
        </div>

        {!isConnected && (
          <div className="mb-6 p-3 bg-[#fef3c7] text-[#f59e0b] rounded-lg border border-[#f59e0b] border-opacity-50">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Connecting to auction server...</span>
            </div>
            {connectionRetries >= 3 && (
              <p className="text-sm mt-2 pl-7">
                Having trouble connecting. Please check your network connection.
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Team ID</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
              disabled={!isConnected}
            >
              <option value="">Select your team</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                disabled={!isConnected}
                placeholder="Enter your password"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {error && error !== 'Connecting to server...' && (
            <div className="p-3 bg-[#fee2e2] text-[#ef4444] rounded-lg text-sm">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full p-3 rounded-lg font-medium transition-all ${
              isConnected
                ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!isConnected}
          >
            {isConnected ? 'Login' : 'Connecting...'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() =>{setDeviceRole('viewer'); navigate('/viewer')}}
            className="text-[#3b82f6] hover:text-[#1e3a8a] text-sm font-medium transition-colors"
          >
            Continue as Viewer
          </button>
        </div>
      </div>
    </div>
  );
}

export default TeamLogin;