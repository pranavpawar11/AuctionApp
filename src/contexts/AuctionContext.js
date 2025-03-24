import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { io } from 'socket.io-client';
import teamsData from '../data/teams.json';
import playersData from '../data/players.json';
import { useLocalStorage } from '../hooks/localStorageHooks';

const AuctionContext = createContext();

export const useAuction = () => useContext(AuctionContext);

export const AuctionProvider = ({ children }) => {
  // Persistent state using localStorage
  const [teams, setTeams] = useLocalStorage('auction_teams', []);
  const [players, setPlayers] = useLocalStorage('auction_players', []);
  const [currentSet, setCurrentSet] = useLocalStorage('auction_currentSet', 'Icon');
  const [currentPlayer, setCurrentPlayer] = useLocalStorage('auction_currentPlayer', null);
  const [currentBid, setCurrentBid] = useLocalStorage('auction_currentBid', 0);
  const [leadingTeam, setLeadingTeam] = useLocalStorage('auction_leadingTeam', null);
  const [bidHistory, setBidHistory] = useLocalStorage('auction_bidHistory', []);
  const [deviceRole, setDeviceRole] = useLocalStorage('auction_deviceRole', null);
  const [team, setTeam] = useState(null);

  // Generate a unique device ID
  const generateUniqueId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomPart}`;
  };

  const [deviceId, setDeviceId] = useLocalStorage('auction_deviceId', generateUniqueId());
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  // Hardcoded server address
  const serverAddress = 'localhost:3001'; // Replace with your server address if different

  const sets = ['Icon', 'Batsman', 'Bowler', 'Keeper', 'All-Rounder'];

  // Socket.IO connection setup
  useEffect(() => {
    const newSocket = io(`http://${serverAddress}`, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
      
      // Send identity information to server
      newSocket.emit('identity', {
        deviceId,
        role: deviceRole,
        teamId: localStorage.getItem('selectedTeamId'),
      });
    });

    newSocket.on('stateUpdate', (payload) => {
      console.log('Received state update:', payload);
      
      // Only update states that exist in the payload
      if (payload.teams) setTeams(payload.teams);
      if (payload.players) setPlayers(payload.players);
      if (payload.currentSet) setCurrentSet(payload.currentSet);
      if (payload.currentPlayer !== undefined) setCurrentPlayer(payload.currentPlayer);
      if (payload.currentBid !== undefined) setCurrentBid(payload.currentBid);
      if (payload.leadingTeam !== undefined) setLeadingTeam(payload.leadingTeam);
      if (payload.bidHistory) setBidHistory(payload.bidHistory);
      
      // Update team info if this is a team device
      if (deviceRole === 'team' && payload.teams) {
        const teamId = localStorage.getItem('selectedTeamId');
        if (teamId) {
          const updatedTeam = payload.teams.find(t => t.id.toString() === teamId.toString());
          if (updatedTeam) {
            setTeam(updatedTeam);
          }
        }
      }
    });

    newSocket.on('identityConfirmed', (data) => {
      console.log('Identity confirmed:', data);
      
      // If we receive a full state, update our state
      if (data.currentState) {
        if (data.currentState.teams) setTeams(data.currentState.teams);
        if (data.currentState.players) setPlayers(data.currentState.players);
        if (data.currentState.currentSet) setCurrentSet(data.currentState.currentSet);
        if (data.currentState.currentPlayer) setCurrentPlayer(data.currentState.currentPlayer);
        if (data.currentState.currentBid !== undefined) setCurrentBid(data.currentState.currentBid);
        if (data.currentState.leadingTeam !== undefined) setLeadingTeam(data.currentState.leadingTeam);
        if (data.currentState.bidHistory) setBidHistory(data.currentState.bidHistory);
      }
    });

    newSocket.on('bidRejected', (data) => {
      console.error('Bid rejected:', data);
      alert(data.message || 'Bid was rejected by the server');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
      setIsConnected(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, [deviceId, deviceRole]); // Keep dependencies minimal to prevent reconnection loops

  // Initialize team data when role changes or teams update
  useEffect(() => {
    if (deviceRole === 'team' && teams.length > 0) {
      const teamId = localStorage.getItem('selectedTeamId');
      if (teamId) {
        const teamObj = teams.find(t => t.id.toString() === teamId.toString());
        if (teamObj) {
          setTeam(teamObj);
        }
      }
    }
  }, [deviceRole, teams]);

  // Send messages to the server
  const sendMessage = useCallback((type, payload) => {
    if (socket?.connected) {
      socket.emit(type, payload);
      console.log(`Data sent to server:`, { type, payload });
      return true;
    }
    console.error('Socket.IO not connected. Cannot send message.');
    return false;
  }, [socket]);

  // Device role management
  const setDeviceAsAdmin = () => {
    setDeviceRole('admin');
    localStorage.removeItem('selectedTeamId');
    setTeam(null);
    
    if (socket?.connected) {
      socket.emit('identity', { deviceId, role: 'admin' });
    }
  };

  const setDeviceAsTeam = (teamId) => {
    setDeviceRole('team');
    localStorage.setItem('selectedTeamId', teamId);
    
    // Find and set the team object
    if (teams.length > 0) {
      const selectedTeam = teams.find(t => t.id.toString() === teamId.toString());
      if (selectedTeam) {
        setTeam(selectedTeam);
      }
    }
    
    if (socket?.connected) {
      socket.emit('identity', { deviceId, role: 'team', teamId });
    }
  };

  const setDeviceAsViewer = () => {
    setDeviceRole('viewer');
    localStorage.removeItem('selectedTeamId');
    setTeam(null);
    
    if (socket?.connected) {
      socket.emit('identity', { deviceId, role: 'viewer' });
    }
  };

  // Initialize auction data
  useEffect(() => {
    if (teams.length === 0 && players.length === 0) {
      console.log('Initializing auction data');
      setTeams(teamsData);
      setPlayers(playersData);

      const initialPlayer = playersData.find(p => p.set === 'Icon' && p.status === 'Available');
      if (initialPlayer) {
        setCurrentPlayer(initialPlayer);
        setCurrentBid(initialPlayer.basePrice);
        setLeadingTeam(null);
        setBidHistory([]);
      }
    }
  }, [teams.length, players.length]);

  // Bid and sale logic
  const getBidStep = (amount) => {
    const bidIncrementRules = [
      { threshold: 1000000, step: 100000 },
      { threshold: 2000000, step: 200000 },
      { step: 250000 },
    ];
    for (const rule of bidIncrementRules) {
      if (!rule.threshold || amount < rule.threshold) {
        return rule.step;
      }
    }
    return bidIncrementRules[bidIncrementRules.length - 1].step;
  };

  const placeBid = (teamId, amount) => {
    if (deviceRole !== 'admin') {
      console.error('Only admin can place bids');
      alert('Only the admin can place bids.');
      return false;
    }

    const team = teams.find(t => t.id === teamId);
    setLeadingTeam(team)
    if (!team || team.currentPurse < amount) {
      console.error('Invalid team or insufficient purse');
      alert('Invalid team or insufficient purse.');
      return false;
    }

    const bidRecord = {
      id: bidHistory.length + 1,
      teamId,
      teamName: team.name,
      amount,
      timestamp: new Date().toISOString(),
      playerId: currentPlayer?.id,
    };

    // Send to server and let server update state
    return sendMessage('bid', bidRecord);
  };

  const confirmSale = () => {
    if (deviceRole !== 'admin' || !leadingTeam || !currentPlayer) {
      console.error('Cannot confirm sale: missing required data');
      return false;
    }

    const saleRecord = {
      teamId: leadingTeam.id,
      player: currentPlayer,
      amount: currentBid,
      timestamp: new Date().toISOString(),
    };

    // Send to server and let server update state
    return sendMessage('sale', saleRecord);
  };

  const moveToNextPlayer = () => {
    if (deviceRole !== 'admin') {
      console.error('Only admin can move to next player');
      return false;
    }
  
    // Mark the current player as unsold if they're available
    if (currentPlayer && currentPlayer.status === 'Available') {
      const updatedPlayers = players.map(p => {
        if (p.id === currentPlayer.id) {
          return { ...p, status: 'Unsold' };
        }
        return p;
      });
  
      // Find the next available player in current set
      const nextPlayer = updatedPlayers.find(p => 
        p.set === currentSet && 
        p.status === 'Available' && 
        p.id !== currentPlayer?.id
      );
      
      if (nextPlayer) {
        // Move to next player in current set
        return sendMessage('stateUpdate', {
          players: updatedPlayers,
          currentPlayer: nextPlayer,
          currentBid: nextPlayer.basePrice,
          leadingTeam: null,
          bidHistory: []
        });
      } else {
        // Check if we need to move to the next set
        const currentSetIndex = sets.indexOf(currentSet);
        if (currentSetIndex < sets.length - 1) {
          const nextSet = sets[currentSetIndex + 1];
          const nextSetPlayer = updatedPlayers.find(p => p.set === nextSet && p.status === 'Available');
          
          return sendMessage('stateUpdate', {
            players: updatedPlayers,
            currentSet: nextSet,
            currentPlayer: nextSetPlayer || null,
            currentBid: nextSetPlayer?.basePrice || 0,
            leadingTeam: null,
            bidHistory: []
          });
        } else {
          // No more sets - auction complete
          return sendMessage('stateUpdate', {
            players: updatedPlayers,
            currentPlayer: null,
            currentBid: 0,
            leadingTeam: null,
            bidHistory: []
          });
        }
      }
    }
    
    return false;
  };

  const changeSet = (set) => {
    if (deviceRole !== 'admin') {
      console.error('Only admin can change sets');
      return false;
    }

    if (sets.includes(set)) {
      const nextPlayer = players.find(p => p.set === set && p.status === 'Available');
      
      return sendMessage('stateUpdate', {
        currentSet: set,
        currentPlayer: nextPlayer || null,
        currentBid: nextPlayer?.basePrice || 0,
        leadingTeam: null,
        bidHistory: []
      });
    }
    return false;
  };

  const uploadTeamsData = (jsonData) => {
    if (deviceRole !== 'admin') {
      console.error('Only admin can upload data');
      return false;
    }

    try {
      const parsed = JSON.parse(jsonData);
      return sendMessage('stateUpdate', { teams: parsed });
    } catch (e) {
      console.error('Error parsing teams data:', e);
      alert('Invalid JSON format for teams data.');
      return false;
    }
  };

  const uploadPlayersData = (jsonData) => {
    if (deviceRole !== 'admin') {
      console.error('Only admin can upload data');
      return false;
    }

    try {
      const parsed = JSON.parse(jsonData);
      return sendMessage('stateUpdate', { players: parsed });
    } catch (e) {
      console.error('Error parsing players data:', e);
      alert('Invalid JSON format for players data.');
      return false;
    }
  };

  const resetAuction = () => {
    if (deviceRole !== 'admin') {
      console.error('Only admin can reset auction');
      return false;
    }

    const initialPlayer = playersData.find(p => p.set === 'Icon' && p.status === 'Available');
    
    return sendMessage('stateUpdate', {
      teams: teamsData,
      players: playersData,
      currentSet: 'Icon',
      currentPlayer: initialPlayer || null,
      currentBid: initialPlayer?.basePrice || 0,
      leadingTeam: null,
      bidHistory: []
    });
  };

  return (
    <AuctionContext.Provider value={{
      sets,
      socket,
      isConnected,
      deviceId,
      deviceRole,
      serverAddress,
      setDeviceAsAdmin,
      setDeviceAsTeam,
      setDeviceAsViewer,
      sendMessage,
      teams,
      players,
      currentSet,
      currentPlayer,
      currentBid,
      leadingTeam,
      bidHistory,
      placeBid,
      confirmSale,
      getBidStep,
      uploadTeamsData,
      uploadPlayersData,
      changeSet,
      resetAuction,
      moveToNextPlayer,
      setDeviceRole,
      team
    }}>
      {children}
    </AuctionContext.Provider>
  );
};

export default AuctionProvider;