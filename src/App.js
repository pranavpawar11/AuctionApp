import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuctionProvider } from './contexts/AuctionContext';
import AdminLogin from './components/AdminLogin';
import TeamLogin from './components/TeamLogin';
import TeamDashboard from './components/TeamDashboard';
import AuctionDashboard from './components/AuctionDashboard';
import ViewerDashboard from './components/ViewerDashboard';

function App() {
  return (
    <AuctionProvider>
      <Router>
        <Routes>
          {/* Default route to Team Login */}
          <Route path="/" element={<TeamLogin />} />

          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<AuctionDashboard />} />

          {/* Team Routes */}
          <Route path="/team-login" element={<TeamLogin />} />
          <Route path="/team-dashboard" element={<TeamDashboard />} />

          {/* Viewer Route */} 
          <Route path="/viewer" element={<ViewerDashboard />} />

          {/* Fallback Route */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Router>
    </AuctionProvider>
  );
}

export default App;