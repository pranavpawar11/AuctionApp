import React, { useState } from 'react';
import { useAuction } from '../contexts/AuctionContext';

function BidControls() {
    const { teams, currentPlayer, currentBid, leadingTeam, getBidStep, placeBid, bidHistory } = useAuction();
    const [selectedTeam, setSelectedTeam] = useState('');
    const [customBid, setCustomBid] = useState('');
    const [error, setError] = useState('');

    // Determine if this is the first bid for the current player
    const isFirstBid = bidHistory.length === 0 && currentPlayer;
    
    // If it's the first bid, use the base price, otherwise use the next step
    const bidAmount = isFirstBid ? currentBid : currentBid + getBidStep(currentBid);

    const handleQuickBid = (teamId) => {
        setError('');
        const success = placeBid(teamId, bidAmount);
        if (!success) {
            setError('Insufficient funds for this bid.');
        }
    };

    const handleCustomBid = () => {
        setError('');
        if (!selectedTeam) {
            setError('Please select a team.');
            return;
        }

        const bidAmount = parseInt(customBid);
        if (isNaN(bidAmount) || bidAmount <= currentBid) {
            setError(`Bid must be greater than current bid (₹${(currentBid / 100000).toFixed(1)}L).`);
            return;
        }

        const team = teams.find(t => t.id === parseInt(selectedTeam));
        if (!team) {
            setError('Invalid team selection.');
            return;
        }

        const success = placeBid(parseInt(selectedTeam), bidAmount);
        if (!success) {
            setError('Insufficient funds for this bid.');
        } else {
            setCustomBid('');
        }
    };

    return (
        <div className="bg-blue-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-primary-dark text-lg font-semibold mb-2">Place Bid</h3>

            {error && (
                <div className="bg-danger-light border border-danger text-danger px-3 py-2 rounded-lg text-sm flex items-center">
                    <span className="mr-2">⚠️</span> {error}
                </div>
            )}

            <div>
                <p className="text-lg font-bold text-primary-dark mb-3 flex items-center">
                    <span className="mr-2">⚡</span> {isFirstBid ? "Base Price" : "Quick Bid"} (₹{(bidAmount / 100000).toFixed(1)}L)
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {teams.map(team => {
                        const canBid = team.currentPurse >= bidAmount && (!leadingTeam || leadingTeam.id !== team.id);
                        return (
                            <button
                                key={team.id}
                                onClick={() => handleQuickBid(team.id)}
                                disabled={!canBid}
                                className={`p-2 rounded-lg flex items-center justify-center text-sm transition-all duration-200
                                  ${canBid 
                                    ? 'bg-primary-accent hover:bg-primary-dark text-white shadow-sm hover:shadow-md' 
                                    : 'bg-gray-100 text-gray-400'}`}
                            >
                                <span className="mr-2 text-base">{team.logo}</span>
                                <span className="truncate font-medium">{team.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* <div className="pt-2">
                <p className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                    <span className="mr-2">💰</span> Custom Bid
                </p>
                <div className="flex gap-2">
                    <select
                        value={selectedTeam}
                        onChange={(e) => setSelectedTeam(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-accent focus:border-primary-accent bg-white"
                    >
                        <option value="">Select Team</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.id} disabled={team.currentPurse <= currentBid}>
                                {team.name} (₹{(team.currentPurse / 1000000).toFixed(1)}Cr)
                            </option>
                        ))}
                    </select>

                    <div className="relative flex-1">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <span className="px-3 bg-gray-100 text-gray-600 text-sm h-full flex items-center font-medium">₹</span>
                            <input
                                type="number"
                                value={customBid}
                                onChange={(e) => setCustomBid(e.target.value)}
                                placeholder="Amount in Lakh"
                                className="w-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-accent border-l border-gray-200"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleCustomBid}
                        className="bg-primary-accent hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                        Bid
                    </button>
                </div>
            </div> */}
        </div>
    );
}

export default BidControls;