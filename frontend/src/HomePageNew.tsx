import React, { useState } from 'react'

interface HomePageProps {
  account: string;
  onDisconnect: () => void;
}

interface Tournament {
  id: string;
  name: string;
  entryFee: string;
  prizePool: string;
  players: number;
  maxPlayers: number;
  status: 'open' | 'in-progress' | 'completed';
}

const mockTournaments: Tournament[] = [
  {
    id: '1',
    name: 'Quick Quiz Battle',
    entryFee: '10',
    prizePool: '80',
    players: 7,
    maxPlayers: 8,
    status: 'open'
  },
  {
    id: '2', 
    name: 'Brain Buster Championship',
    entryFee: '25',
    prizePool: '200',
    players: 4,
    maxPlayers: 16,
    status: 'open'
  },
  {
    id: '3',
    name: 'Speed Round Arena',
    entryFee: '5',
    prizePool: '40',
    players: 8,
    maxPlayers: 8,
    status: 'in-progress'
  }
];

type ActivePage = 'dashboard' | 'arena' | 'solo' | 'vault' | 'profile';

const HomePage: React.FC<HomePageProps> = ({ account, onDisconnect }) => {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [tournaments, setTournaments] = useState<Tournament[]>(mockTournaments);

  const joinTournament = (tournamentId: string) => {
    setTournaments(prev => 
      prev.map(t => 
        t.id === tournamentId 
          ? { ...t, players: t.players + 1 }
          : t
      )
    );
    alert(`Joined tournament! Entry fee: ${tournaments.find(t => t.id === tournamentId)?.entryFee} USDT`);
  };

  const renderDashboard = () => (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-32 bg-gradient-to-r from-transparent via-white/5 to-transparent blur-xl"></div>
          </div>
          <h1 className="relative text-6xl md:text-8xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            WELCOME
          </h1>
        </div>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          Choose your path in the decentralized tournament arena. Battle, learn, collect, and dominate.
        </p>
        <div className="flex justify-center items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-white/40">CONNECTED TO BLOCKCHAIN</span>
        </div>
      </div>

      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Solo Adventure Card */}
        <div 
          onClick={() => setActivePage('solo')}
          className="group relative cursor-pointer bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20 
                     border border-white/20 hover:border-blue-400/60 transition-all duration-500 
                     hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20
                     min-h-[320px] flex flex-col justify-between p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="text-4xl">🏔️</div>
              <div className="text-sm text-blue-400 border border-blue-400/40 px-3 py-1 bg-blue-400/10">
                SINGLE PLAYER
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors">
              SOLO ADVENTURE
            </h3>
            <p className="text-white/60 mb-6 leading-relaxed">
              Embark on challenging quests, earn XP, and unlock exclusive NFT rewards. 
              Perfect your skills before entering the arena.
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-400">Level 12</div>
                <div className="text-xs text-white/40">Current</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">8</div>
                <div className="text-xs text-white/40">NFTs</div>
              </div>
              <div>
                <div className="text-xl font-bold">1,340</div>
                <div className="text-xs text-white/40">XP</div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Ready to explore</span>
              <span className="text-blue-400 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* Tournament Arena Card */}
        <div 
          onClick={() => setActivePage('arena')}
          className="group relative cursor-pointer bg-gradient-to-br from-red-900/20 via-black to-orange-900/20 
                     border border-white/20 hover:border-red-400/60 transition-all duration-500 
                     hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20
                     min-h-[320px] flex flex-col justify-between p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 via-transparent to-orange-600/10 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="text-4xl">⚔️</div>
              <div className="text-sm text-red-400 border border-red-400/40 px-3 py-1 bg-red-400/10">
                MULTIPLAYER
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-red-300 transition-colors">
              TOURNAMENT ARENA
            </h3>
            <p className="text-white/60 mb-6 leading-relaxed">
              Battle against players worldwide in high-stakes quiz tournaments. 
              Win USDT prizes and claim your place among legends.
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-400">{tournaments.filter(t => t.status === 'open').length}</div>
                <div className="text-xs text-white/40">Open</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-400">{tournaments.filter(t => t.status === 'in-progress').length}</div>
                <div className="text-xs text-white/40">Active</div>
              </div>
              <div>
                <div className="text-xl font-bold text-red-400">
                  {tournaments.reduce((sum, t) => sum + parseInt(t.prizePool), 0)}
                </div>
                <div className="text-xs text-white/40">USDT Pool</div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Join the battle</span>
              <span className="text-red-400 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* Vault Card */}
        <div 
          onClick={() => setActivePage('vault')}
          className="group relative cursor-pointer bg-gradient-to-br from-green-900/20 via-black to-emerald-900/20 
                     border border-white/20 hover:border-green-400/60 transition-all duration-500 
                     hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20
                     min-h-[320px] flex flex-col justify-between p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 via-transparent to-emerald-600/10 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="text-4xl">🏦</div>
              <div className="text-sm text-green-400 border border-green-400/40 px-3 py-1 bg-green-400/10">
                TREASURY
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-green-300 transition-colors">
              VAULT
            </h3>
            <p className="text-white/60 mb-6 leading-relaxed">
              Manage your digital assets, NFT collection, and USDT balance. 
              Your secure on-chain treasury awaits.
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-green-400">156.43</div>
                <div className="text-xs text-white/40">USDT</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">12</div>
                <div className="text-xs text-white/40">NFTs</div>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-400">2.4K</div>
                <div className="text-xs text-white/40">Value</div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Manage assets</span>
              <span className="text-green-400 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div 
          onClick={() => setActivePage('profile')}
          className="group relative cursor-pointer bg-gradient-to-br from-purple-900/20 via-black to-pink-900/20 
                     border border-white/20 hover:border-purple-400/60 transition-all duration-500 
                     hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20
                     min-h-[320px] flex flex-col justify-between p-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-pink-600/10 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="text-4xl">👤</div>
              <div className="text-sm text-purple-400 border border-purple-400/40 px-3 py-1 bg-purple-400/10">
                ACCOUNT
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-4 text-white group-hover:text-purple-300 transition-colors">
              PROFILE
            </h3>
            <p className="text-white/60 mb-6 leading-relaxed">
              View your gaming statistics, achievements, and wallet information. 
              Track your journey to greatness.
            </p>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xl font-bold text-blue-400">47</div>
                <div className="text-xs text-white/40">Battles</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">76%</div>
                <div className="text-xs text-white/40">Win Rate</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">1,340</div>
                <div className="text-xs text-white/40">Rank</div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">View details</span>
              <span className="text-purple-400 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-t border-white/20 pt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-400">Live</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">Network Status</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">Available</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-400">0%</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">Platform Fee</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-400">100%</div>
            <div className="text-white/60 text-sm uppercase tracking-wide">Decentralized</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Other page renders remain the same for now - just return placeholder
  const renderArena = () => <div className="text-center text-white/60">Arena page coming soon...</div>;
  const renderSolo = () => <div className="text-center text-white/60">Solo Adventure page coming soon...</div>;
  const renderVault = () => <div className="text-center text-white/60">Vault page coming soon...</div>;
  const renderProfile = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">PROFILE</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border border-white/20 p-6">
            <h3 className="text-xl font-bold mb-4">PLAYER STATS</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Total Battles</span>
                <span>47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Win Rate</span>
                <span className="text-green-400">76%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Current Rank</span>
                <span>1,340</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">NFTs Earned</span>
                <span className="text-purple-400">8</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border border-white/20 p-6">
            <h3 className="text-xl font-bold mb-4">WALLET INFO</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Address</span>
                <span className="font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Network</span>
                <span>Polygon</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Status</span>
                <span className="text-green-400">Connected</span>
              </div>
            </div>
            <button 
              onClick={onDisconnect}
              className="w-full mt-4 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-colors py-2 text-sm"
            >
              DISCONNECT WALLET
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard': return renderDashboard();
      case 'arena': return renderArena();
      case 'solo': return renderSolo();
      case 'vault': return renderVault();
      case 'profile': return renderProfile();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <header className="border-b border-white/20 bg-black/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center 
                          hover:border-green-400 transition-colors duration-300">
              <span className="text-lg font-bold">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">TOOURNAMENT</h1>
              <div className="text-xs text-white/40 uppercase tracking-wider">Decentralized Arena</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/5 border border-white/20 px-4 py-2 rounded-full">
              <span className="text-sm text-white/70 font-mono">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/20 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'dashboard', label: 'DASHBOARD', icon: '🏠' },
              { id: 'arena', label: 'ARENA', icon: '⚔️', count: tournaments.filter(t => t.status === 'open').length },
              { id: 'solo', label: 'SOLO ADVENTURE', icon: '🏔️' },
              { id: 'vault', label: 'VAULT', icon: '🏦', count: 12 },
              { id: 'profile', label: 'PROFILE', icon: '👤' }
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => setActivePage(nav.id as ActivePage)}
                className={`relative py-4 px-6 transition-all duration-300 text-sm font-bold group ${
                  activePage === nav.id
                    ? 'text-white bg-white/10 border-b-2 border-white'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{nav.icon}</span>
                  <span>{nav.label}</span>
                  {nav.count && (
                    <span className="bg-green-400 text-black text-xs px-2 py-1 rounded-full">
                      {nav.count}
                    </span>
                  )}
                </div>
                {activePage === nav.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-white/40 text-sm">
          <p>TOOURNAMENT • FULLY DECENTRALIZED • NO BACKEND • ON-CHAIN VERIFIED</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
