import React, { useState } from 'react';
import { useAuction } from '../contexts/AuctionContext';

function DataManagementModal({ onClose }) {
  const { uploadTeamsData, uploadPlayersData, resetAuction } = useAuction();
  const [activeTab, setActiveTab] = useState('teams');
  const [teamsData, setTeamsData] = useState('');
  const [playersData, setPlayersData] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  const handleUpload = (type) => {
    try {
      const success = type === 'teams' 
        ? uploadTeamsData(teamsData)
        : uploadPlayersData(playersData);
      
      if(success) {
        setMessageType('success');
        setMessage('Data uploaded successfully!');
        setTimeout(() => {
          setMessage('');
          onClose();
        }, 2000);
      }
    } catch(e) {
      setMessageType('error');
      setMessage('Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#3730a3] text-white p-5 rounded-t-xl">
          <h2 className="text-xl font-bold">Data Management</h2>
        </div>
        
        <div className="p-6">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button 
              onClick={() => setActiveTab('teams')}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                activeTab === 'teams' 
                  ? 'bg-[#3b82f6] text-white shadow-md' 
                  : 'text-gray-600 hover:text-[#1e3a8a]'
              }`}
            >
              Teams
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                activeTab === 'players' 
                  ? 'bg-[#3b82f6] text-white shadow-md' 
                  : 'text-gray-600 hover:text-[#1e3a8a]'
              }`}
            >
              Players
            </button>
          </div>

          <div className="mb-6">
            <textarea
              value={activeTab === 'teams' ? teamsData : playersData}
              onChange={(e) => activeTab === 'teams' ? setTeamsData(e.target.value) : setPlayersData(e.target.value)}
              className="w-full h-48 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#93c5fd] focus:border-[#3b82f6] outline-none transition-all"
              placeholder={`Paste ${activeTab} JSON here`}
              style={{ resize: 'none' }}
            />
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
              messageType === 'success' 
                ? 'bg-[#d1fae5] text-[#10b981]' 
                : 'bg-[#fee2e2] text-[#ef4444]'
            }`}>
              {message}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => handleUpload(activeTab)}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
            >
              Upload {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
            <button
              onClick={onClose}
              className="py-2.5 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataManagementModal;