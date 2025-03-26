import React, { useState, useRef } from 'react';
import { useAuction } from '../contexts/AuctionContext';

function DataManagementModal({ onClose }) {
  const { 
    uploadTeamsData, 
    uploadPlayersData, 
    resetAuction, 
    teams, 
    players 
  } = useAuction();
  
  const [activeTab, setActiveTab] = useState('teams');
  const [teamsData, setTeamsData] = useState('');
  const [playersData, setPlayersData] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const fileInputRef = useRef(null);

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

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          if (activeTab === 'teams') {
            uploadTeamsData(JSON.stringify(jsonData));
            setTeamsData(JSON.stringify(jsonData, null, 2));
          } else {
            uploadPlayersData(JSON.stringify(jsonData));
            setPlayersData(JSON.stringify(jsonData, null, 2));
          }
          setMessageType('success');
          setMessage('File uploaded successfully!');
        } catch (error) {
          setMessageType('error');
          setMessage('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExport = () => {
    const dataToExport = activeTab === 'teams' ? teams : players;
    const jsonData = JSON.stringify(dataToExport, null, 2);
    
    // Create a blob and download
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab}_data_export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="bg-gradient-to-r from-[#1e3a8a] to-[#120e51] p-5 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Data Management</h2>
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
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
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

          <div className="flex gap-3 mb-3">
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex-1 py-2.5 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
            >
              Import File
            </button>
            <button
              onClick={handleExport}
              className="flex-1 py-2.5 px-4 bg-gradient-to-r from-green-500  to-green-700 text-white  rounded-lg font-medium hover:bg-green-900 transition-all"
            >
              Export {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>

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