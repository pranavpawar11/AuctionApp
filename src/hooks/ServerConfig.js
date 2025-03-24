import React, { useState, useEffect } from 'react';
import { useAuction } from '../contexts/AuctionContext';
import { useNavigate } from 'react-router-dom';

function ServerConfig() {
  const { 
    serverAddress, 
    setServerIp, 
    isConnected 
  } = useAuction();
  
  const [ipAddress, setIpAddress] = useState(serverAddress || '');
  const [error, setError] = useState('');
  const [configComplete, setConfigComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (serverAddress && isConnected) {
      setConfigComplete(true);
    }
  }, [serverAddress, isConnected]);

  useEffect(() => {
    if (configComplete) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [configComplete, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!ipAddress) {
      setError('Please enter server IP address');
      return;
    }
    
    // Basic IP validation
    if (!ipAddress.match(/^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/)) {
      setError('Invalid IP address format. Use format: 192.168.1.x or 192.168.1.x:3000');
      return;
    }
    
    const success = setServerIp(ipAddress);
    
    if (success) {
      setError('');
      setConfigComplete(true);
    } else {
      setError('Failed to set server IP. Please check the format.');
    }
  };

  if (configComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Server Connected</h2>
          <p className="text-green-600 mb-4">Successfully connected to {serverAddress}</p>
          <p className="text-gray-600">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">IPL Auction Server Setup</h2>
        <p className="mb-4 text-gray-600">
          Please enter the IP address of the computer running the auction server.
          This is typically the IP address of the admin's computer on your local network.
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Server IP Address</label>
            <input
              type="text"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              placeholder="192.168.1.x"
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-gray-500 mt-1">
              You can add a port if needed: 192.168.1.x:3000
            </p>
          </div>
          
          {error && <div className="text-red-500 mb-4">{error}</div>}
          
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Connect to Server
          </button>
        </form>
      </div>
    </div>
  );
}

export default ServerConfig;