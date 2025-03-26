import React, { useEffect, useState } from 'react';
import { useAuction } from '../contexts/AuctionContext';
import { useNavigate } from 'react-router-dom';

function ViewerDashboard() {
    const {
        teams,
        players,
        currentPlayer,
        currentBid,
        leadingTeam,
        bidHistory,
        isConnected,
        deviceRole,
        deviceId,
        setDeviceRole,
        currentSet,
        sets
    } = useAuction();

    const navigate = useNavigate();
    const [soldPlayers, setSoldPlayers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState("Connecting...");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [activeTab, setActiveTab] = useState('current');

    // Ensure user is logged in as a viewer
    useEffect(() => {
        if (deviceRole !== 'viewer') {
            navigate('/');
        } else {
            setIsLoading(false);
        }
    }, [deviceRole, navigate]);

    // Extract sold players
    useEffect(() => {
        if (players && players.length > 0) {
            const filtered = players.filter(player => player.status === 'Sold');
            setSoldPlayers(filtered);
        }
    }, [players]);

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

        setDeviceRole(null);
        // Navigate to login screen
        navigate("/");
    };

    // Toggle logout confirmation modal
    const toggleLogoutModal = () => {
        setShowLogoutModal(!showLogoutModal);
    };

    const formatPrice = (price) => {
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Cr`;
        }
        return `₹${(price / 100000).toFixed(1)}L`;
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-900 to-indigo-900">
                <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md mx-4 border-2 border-blue-400">
                    <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                        <h2 className="text-xl font-bold text-blue-900">Loading auction data...</h2>
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
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <h1 className="text-xl font-bold text-white">Viewer-Dashboard</h1>
                    </div>
                    <div className="flex items-center">
                        <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} mr-2`}></span>
                        <span className="text-sm text-white font-medium">
                            {isConnected ? 'Live' : 'Connecting...'}
                        </span>
                    </div>
                </div>
            </header>

            {/* Main content with padding to accommodate the fixed header */}
            <div className="max-w-4xl mx-auto pt-20">
                {/* Connection status */}
                {!isConnected && (
                    <div className="mb-4 p-3 bg-orange-100 text-orange-800 rounded-lg shadow-sm border border-orange-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Connecting to auction server...
                    </div>
                )}


                <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-blue-400 flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Viewer Mode</p>
                        <p className="text-xs text-gray-400">Device ID: {deviceId.substring(0, 8)}...</p>
                    </div>
                    <button
                        onClick={toggleLogoutModal}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:from-red-600 hover:to-red-700 transition-colors shadow-sm flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Exit Viewer Mode
                    </button>
                </div>

                {/* Navigation tabs */}
                <div className="bg-white rounded-t-xl p-2 mt-2 shadow-lg border-t-2 border-l-2 border-r-2 border-blue-400 flex space-x-1">
                    <button
                        onClick={() => setActiveTab('current')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${activeTab === 'current'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Current Auction
                    </button>
                    <button
                        onClick={() => setActiveTab('teams')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${activeTab === 'teams'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Teams
                    </button>
                    <button
                        onClick={() => setActiveTab('sold')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${activeTab === 'sold'
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Sold Players
                    </button>
                </div>

                {/* Tab content */}
                <div className="bg-white rounded-b-xl p-5 shadow-lg mb-4 border-b-2 border-l-2 border-r-2 border-blue-400">
                    {/* Current Auction Tab */}
                    {activeTab === 'current' && (
                        <div>
                            {/* Sets navigation */}
                            <div className="flex overflow-x-auto pb-2 mb-4 scrollbar-hide">
                                {sets.map((set) => (
                                    <div
                                        key={set}
                                        className={`flex-shrink-0 mx-1 px-3 py-1 rounded-full text-xs font-medium ${currentSet === set
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {set}
                                    </div>
                                ))}
                            </div>

                            {currentPlayer ? (
                                <div>
                                    {/* Current player card */}
                                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-xl text-blue-900">{currentPlayer.name}</h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200 animate-pulse">
                                                Live
                                            </span>
                                        </div>
                                        <div className="flex space-x-2 mb-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                                {currentPlayer.set}
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                {currentPlayer.role}
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                Base: {formatPrice(currentPlayer.basePrice)}
                                            </span>
                                        </div>

                                        {/* Player stats */}
                                        {currentPlayer.stats && (
                                            <div className="grid grid-cols-3 gap-3 mt-3 bg-white p-3 rounded-lg border border-blue-100">
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
                                            <p className="text-sm text-gray-600 mt-3">{currentPlayer.description}</p>
                                        )}
                                    </div>

                                    {/* Current bid status */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 rounded-lg text-white shadow-md">
                                            <p className="text-xs font-medium opacity-90">CURRENT BID</p>
                                            <p className="text-2xl font-bold">{formatPrice(currentBid)}</p>
                                        </div>

                                        <div className={`p-4 rounded-lg shadow-md ${leadingTeam ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' : 'bg-gradient-to-r from-gray-200 to-gray-300'}`}>
                                            <p className="text-xs font-medium opacity-90">LEADING TEAM</p>
                                            <p className="text-xl font-bold">{leadingTeam?.name || 'None'}</p>
                                        </div>
                                    </div>

                                    {/* Bid history */}
                                    <div className="mt-4">
                                        <h3 className="text-sm font-semibold text-gray-700 mb-2">BID HISTORY</h3>
                                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                            {bidHistory && bidHistory.length > 0 ? (
                                                <div className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
                                                    {[...bidHistory].reverse().map((bid) => (
                                                        <div key={bid.id} className="p-3 hover:bg-gray-50">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium text-blue-900">{bid.teamName}</span>
                                                                <span className="text-green-600 font-bold">{formatPrice(bid.amount)}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center text-gray-500">
                                                    No bids placed yet
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-blue-600 font-medium">No player being auctioned currently</p>
                                    <p className="text-gray-500 text-sm mt-2">Please wait for the auctioneer to start the next round</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Teams Tab */}
                    {activeTab === 'teams' && (
                        <div>
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Teams Status</h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
                                {teams.map((team) => (
                                    <div key={team.id} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-blue-100 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-bold text-blue-900">{team.name}</h3>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                {team.players?.length || 0} Players
                                            </span>
                                        </div>
                                        <div className="flex justify-between mt-3">
                                            <div>
                                                <p className="text-xs text-gray-500">Remaining Purse</p>
                                                <p className="font-semibold text-green-600">{formatPrice(team.currentPurse)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Initial Purse</p>
                                                <p className="font-semibold text-gray-700">{formatPrice(team.initialPurse)}</p>
                                            </div>
                                        </div>

                                        {/* Leading indicator */}
                                        {leadingTeam && leadingTeam.id === team.id && currentPlayer && (
                                            <div className="mt-3 bg-green-100 text-green-800 p-2 rounded-md text-xs text-center border border-green-200 font-medium">
                                                Currently leading bid for {currentPlayer.name}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sold Players Tab */}
                    {activeTab === 'sold' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold text-gray-800">Sold Players</h2>
                                <span className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-xs font-medium rounded-full px-2.5 py-1">
                                    {soldPlayers.length} Players
                                </span>
                            </div>

                            {soldPlayers.length > 0 ? (
                                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                    {soldPlayers.map((player) => {
                                        const soldToTeam = teams.find(t => t.id === player.soldTo);
                                        return (
                                            <div key={player.id} className="p-4 hover:bg-gray-50">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-medium text-blue-900">{player.name}</p>
                                                        <div className="flex space-x-2 mt-1">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                                                {player.set}
                                                            </span>
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                                                {player.role || 'Not specified'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-green-600 font-bold">{formatPrice(player.soldPrice)}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {soldToTeam ? `Sold to ${soldToTeam.name}` : 'Team info not available'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-blue-600 font-medium">No players have been sold yet</p>
                                    <p className="text-gray-500 text-sm mt-2">Check back once the auction begins</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer with logout button */}

            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-sm border-2 border-blue-400 overflow-hidden animate-fadeIn">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                            <h3 className="text-white font-bold text-lg">Confirm Exit</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-4 text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p>Are you sure you want to exit viewer mode?</p>
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
                                    Exit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ViewerDashboard;