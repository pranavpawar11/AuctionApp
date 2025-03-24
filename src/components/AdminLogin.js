import React, { useState, useEffect } from 'react';
import { useAuction } from '../contexts/AuctionContext';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const { setDeviceAsAdmin, isConnected, deviceRole } = useAuction();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const ADMIN_PASSWORD = 'admin123'; // Admin password

  // Check if already logged in as admin
  useEffect(() => {
    if (deviceRole === 'admin') {
      navigate('/admin-dashboard'); // Redirect to admin dashboard if already logged in
    }
    setLoading(false);
  }, [navigate]);

  // Show connection status
  useEffect(() => {
    if (!isConnected) {
      setError('Connecting to server...');
    } else {
      setError('');
    }
  }, [isConnected]);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      setError('Not connected to server. Please try again.');
      return;
    }
    
    if (password === ADMIN_PASSWORD) {
      setDeviceAsAdmin(); // Set device role as admin
      navigate('/admin-dashboard'); // Redirect to admin dashboard
    } else {
      setError('Invalid admin password');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1e3a8a] to-[#3730a3]">
        <div className="bg-white bg-opacity-90 p-8 rounded-xl shadow-lg">
          <div className="flex justify-center">
            <svg className="animate-spin h-12 w-12 text-[#3b82f6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1e3a8a] to-[#3730a3]">
      <div className="grid grid-cols-1 lg:grid-cols-5 bg-white bg-opacity-95 rounded-xl shadow-xl overflow-hidden max-w-5xl w-full mx-4 lg:mx-0">
        {/* Left panel - Decorative for desktop */}
        <div className="hidden lg:block lg:col-span-2 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] p-8">
          <div className="h-full flex flex-col justify-between">
            <div>
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Admin Portal</h2>
              <p className="text-white text-opacity-80">Access your auction system's administrative controls and monitoring tools.</p>
            </div>
            
            <div className="mt-8">
              <div className="space-y-4">
                <div className="flex items-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Manage all team accounts</span>
                </div>
                <div className="flex items-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Control auction processes</span>
                </div>
                <div className="flex items-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>View real-time analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right panel - Login form */}
        <div className="p-6 sm:p-10 lg:col-span-3">
          <div className="lg:max-w-md mx-auto">
            <h2 className="text-2xl lg:text-3xl font-bold text-[#1e3a8a] mb-2">Admin Login</h2>
            <p className="text-gray-600 mb-8">Enter your credentials to access the administrative dashboard</p>
            
            {!isConnected && (
              <div className="mb-6 p-4 bg-[#fef3c7] text-[#f59e0b] rounded-lg border border-[#f59e0b] border-opacity-50 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <span className="font-medium">Connecting to auction server...</span>
                  <p className="text-sm mt-1">Please wait while we establish a connection.</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Admin Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
                    disabled={!isConnected}
                    placeholder="Enter admin password"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 absolute left-4 top-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              
              {error && error !== 'Connecting to server...' && (
                <div className="p-4 bg-[#fee2e2] text-[#ef4444] rounded-lg flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}
              
              <button
                type="submit"
                className={`w-full p-4 rounded-lg font-medium transition-all ${
                  isConnected 
                    ? 'bg-gradient-to-r from-[#1e3a8a] to-[#3730a3] text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!isConnected}
              >
                {isConnected ? 'Login as Admin' : 'Waiting for Connection...'}
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Not an administrator?</p>
                <button
                  onClick={() => navigate('/')}
                  className="inline-flex items-center text-[#3b82f6] hover:text-[#1e3a8a] text-sm font-medium transition-colors"
                >
                  <span>Return to Login</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;