const http = require('http');
const express = require('express');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (replace with your frontend URL in production)
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const teamsData = require('./src/data/teams.json');
const playersData = require('./src/data/players.json');
// Auction state (initialized with default values)
let auctionState = {
  teams: teamsData,
  players: playersData,
  currentSet: 'Icon',
  currentPlayer: playersData.find(p => p.set === 'Icon' && p.status === 'Available') || null,
  currentBid: playersData.find(p => p.set === 'Icon' && p.status === 'Available')?.basePrice || 0,
  leadingTeam: null,
  bidHistory: [],
  sets: ['Icon', 'Batsman', 'Bowler', 'Keeper', 'All-Rounder']
};
// Track connected clients
const clients = new Map();
let adminClient = null;

// Update connection handler
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Send current state to new clients
  socket.emit('stateUpdate', auctionState);

  socket.on('identity', (data) => {
    const { deviceId, role, teamId } = data;
    // Store client information
    clients.set(deviceId, { socket, role, teamId });

    // If this is an admin, track them
    if (role === 'admin') {
      adminClient = socket.id;
    }

    // Send confirmation with complete current state
    socket.emit('identityConfirmed', {
      role,
      isAdmin: role === 'admin',
      currentState: auctionState
    });

    // Send full state update to ensure client is in sync
    socket.emit('stateUpdate', auctionState);
  });

  socket.on('bid', (data) => {
    // if (!validateBid(data)) {
    //   socket.emit('bidRejected', { 
    //     message: 'Bid validation failed', 
    //     reason: 'Invalid bid data or insufficient funds'
    //   });
    //   return;
    // }

    // Update server state
    console.log("bid data :", auctionState.teams)
    const bidTeam = auctionState.teams.find(t => t.id == data.teamId);

    auctionState.currentBid = data.amount;
    auctionState.leadingTeam = bidTeam;
    auctionState.bidHistory.push(data);
    console.log("teamname ; ", bidTeam, auctionState.leadingTeam, data.teamName)
    // Broadcast updated state to all clients
    io.emit('stateUpdate', {
      currentBid: auctionState.currentBid,
      leadingTeam: auctionState.leadingTeam,
      bidHistory: auctionState.bidHistory
    });
  });

  socket.on('sale', (data) => {
    const { teamId, player, amount } = data;
    // Process sale and update state
    processSale(teamId, player, amount);
    // Broadcast full updated state to all clients
    io.emit('stateUpdate', auctionState);
  });

  socket.on('stateUpdate', (partialState) => {
    // Only admin can send state updates
    const clientInfo = Array.from(clients.entries())
      .find(([_, info]) => info.socket.id === socket.id);

    if (!clientInfo || clientInfo[1].role !== 'admin') {
      socket.emit('error', { message: 'Unauthorized state update attempt' });
      return;
    }

    // Update the auction state with the partial update
    auctionState = { ...auctionState, ...partialState };

    // Broadcast the full state to all clients
    io.emit('stateUpdate', auctionState);
  });

  // Handle player status update (if a player is marked as unsold)
  socket.on('playerStatusUpdate', (data) => {
    // Only admin can update player status
    const clientInfo = Array.from(clients.entries())
      .find(([_, info]) => info.socket.id === socket.id);

    if (!clientInfo || clientInfo[1].role !== 'admin') {
      socket.emit('error', { message: 'Unauthorized player status update attempt' });
      return;
    }

    if (data.players) {
      auctionState.players = data.players;
    }

    // Broadcast the updated state to all clients
    io.emit('stateUpdate', auctionState);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);

    // Remove client from tracking
    for (const [deviceId, info] of clients.entries()) {
      if (info.socket.id === socket.id) {
        clients.delete(deviceId);
        if (socket.id === adminClient) {
          adminClient = null;
        }
        break;
      }
    }
  });
});

// Bid validation logic
const validateBid = (data) => {
  try {
    const { teamId, amount, playerId } = data;

    // 1. Find relevant records
    const bidTeam = auctionState.teams.find(t => t.id === teamId);

    // If no current player is set but playerId is provided, get from players
    let currentPlayer;
    if (playerId) {
      currentPlayer = auctionState.players.find(p => p.id === playerId);
    } else if (auctionState.currentPlayer) {
      currentPlayer = auctionState.currentPlayer;
    } else {
      console.error('No current player for bid');
      return false;
    }

    // 2. Basic validation checks
    if (!bidTeam || !currentPlayer) {
      console.error('Invalid bid data:', data);
      return false;
    }

    // 3. Check player availability
    if (currentPlayer.status !== 'Available') {
      console.error('Player already sold:', currentPlayer.id);
      return false;
    }

    // 4. Validate purse balance
    if (bidTeam.currentPurse < amount) {
      console.error('Insufficient funds:', bidTeam.id);
      return false;
    }

    // 5. Validate bid amount against current bid
    const bidIncrement = getBidStep(auctionState.currentBid);
    if (amount < auctionState.currentBid + bidIncrement) {
      console.error('Bid too low:', amount, 'Current:', auctionState.currentBid);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Bid validation error:', error);
    return false;
  }
};

const processSale = (teamId, player, amount) => {
  try {
    // 1. Find team and player records
    const team = auctionState.teams.find(t => t.id === teamId);
    const playerRecord = auctionState.players.find(p => p.id === player.id);

    if (!team || !playerRecord) {
      console.error('Sale processing failed: Invalid team or player');
      return;
    }

    // 2. Update team details
    team.currentPurse -= amount;
    team.players = team.players || []; // Ensure players array exists
    team.players.push({
      ...playerRecord,
      soldPrice: amount,
      purchaseDate: new Date().toISOString()
    });

    // 3. Update player status
    playerRecord.status = 'Sold';
    playerRecord.soldTo = teamId;
    playerRecord.soldPrice = amount;

    // 4. Find next available player
    const currentSetPlayers = auctionState.players.filter(p =>
      p.set === auctionState.currentSet && p.status === 'Available'
    );

    if (currentSetPlayers.length > 0) {
      // Get next player in current set
      auctionState.currentPlayer = currentSetPlayers[0];
      auctionState.currentBid = currentSetPlayers[0].basePrice;
    } else {
      // Move to next set
      const currentSetIndex = auctionState.sets.indexOf(auctionState.currentSet);
      if (currentSetIndex < auctionState.sets.length - 1) {
        const nextSet = auctionState.sets[currentSetIndex + 1];
        const nextSetPlayers = auctionState.players.filter(p =>
          p.set === nextSet && p.status === 'Available'
        );

        auctionState.currentSet = nextSet;
        auctionState.currentPlayer = nextSetPlayers[0] || null;
        auctionState.currentBid = nextSetPlayers[0]?.basePrice || 0;
      } else {
        // Auction complete
        auctionState.currentPlayer = null;
        auctionState.currentBid = 0;
      }
    }

    // 5. Reset bidding state
    auctionState.leadingTeam = null;
    auctionState.bidHistory = [];

    console.log('Processed sale for:', player.name, 'Amount:', amount);
  } catch (error) {
    console.error('Sale processing error:', error);
  }
};

// Helper function matching client-side bid rules
const getBidStep = (amount) => {
  const bidIncrementRules = [
    { threshold: 1000000, step: 100000 },   // Below 1cr
    { threshold: 2000000, step: 200000 },   // Below 2cr
    { step: 250000 }                        // Above 2cr
  ];

  for (const rule of bidIncrementRules) {
    if (!rule.threshold || amount < rule.threshold) {
      return rule.step;
    }
  }
  return bidIncrementRules[bidIncrementRules.length - 1].step;
};

const port = 3001;
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log('Socket.IO server is ready');
});