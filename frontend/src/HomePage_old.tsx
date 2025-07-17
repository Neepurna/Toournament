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

type ActivePage = 'arena' | 'solo' | 'vault' | 'profile';

const HomePage: React.FC<HomePageProps> = ({ account, onDisconnect }) => {
  const [activePage, setActivePage] = useState<ActivePage>('arena');
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

  const renderArena = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Arena Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent h-px"></div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pb-8">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">ARENA</h2>
            <p className="text-white/60 text-lg mt-2">Battle against the best minds</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{tournaments.filter(t => t.status === 'open').length}</div>
              <div className="text-xs text-white/60 uppercase">Open</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{tournaments.filter(t => t.status === 'in-progress').length}</div>
              <div className="text-xs text-white/60 uppercase">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {tournaments.reduce((sum, t) => sum + parseInt(t.prizePool), 0)}
              </div>
              <div className="text-xs text-white/60 uppercase">Total USDT</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tournament Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {tournaments.map((tournament, index) => (
          <div
            key={tournament.id}
            className="group relative border border-white/20 bg-gradient-to-br from-black/80 to-black/40 
                       hover:border-white/60 transition-all duration-300 hover:transform hover:scale-105
                       hover:shadow-2xl hover:shadow-white/10"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative p-6">
              {/* Tournament Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-bold text-xl mb-1">{tournament.name}</h3>
                  <div className="text-white/40 text-sm">ID: #{tournament.id.padStart(4, '0')}</div>
                </div>
                <span className={`text-xs px-3 py-1 border rounded-full font-bold ${
                  tournament.status === 'open' 
                    ? 'border-green-400 text-green-400 bg-green-400/10'
                    : tournament.status === 'in-progress'
                    ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                    : 'border-white/40 text-white/60 bg-white/5'
                }`}>
                  {tournament.status.toUpperCase()}
                </span>
              </div>
              
              {/* Tournament Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 border border-white/10 bg-white/5">
                  <div className="text-2xl font-bold">{tournament.entryFee}</div>
                  <div className="text-xs text-white/60 uppercase">Entry Fee USDT</div>
                </div>
                <div className="text-center p-3 border border-white/10 bg-green-400/10">
                  <div className="text-2xl font-bold text-green-400">{tournament.prizePool}</div>
                  <div className="text-xs text-white/60 uppercase">Prize Pool USDT</div>
                </div>
              </div>
              
              {/* Players Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white/60">Players</span>
                  <span className="font-mono text-sm">{tournament.players}/{tournament.maxPlayers}</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-white to-green-400 h-2 transition-all duration-500 rounded-full"
                    style={{ width: `${(tournament.players / tournament.maxPlayers) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-white/40 mt-1">
                  {tournament.maxPlayers - tournament.players} spots remaining
                </div>
              </div>
              
              {/* Action Button */}
              <button
                onClick={() => joinTournament(tournament.id)}
                disabled={tournament.status !== 'open' || tournament.players >= tournament.maxPlayers}
                className="w-full relative overflow-hidden border border-white hover:border-transparent
                         disabled:border-white/20 disabled:text-white/30 
                         transition-all duration-300 py-4 text-sm font-bold group
                         hover:shadow-lg hover:shadow-white/20"
              >
                <div className="absolute inset-0 bg-white transform -translate-x-full 
                              group-hover:translate-x-0 transition-transform duration-300
                              group-disabled:translate-x-0 group-disabled:bg-white/10"></div>
                <span className="relative group-hover:text-black transition-colors duration-300">
                  {tournament.status === 'open' && tournament.players < tournament.maxPlayers
                    ? 'JOIN TOURNAMENT'
                    : tournament.status === 'in-progress'
                    ? 'IN PROGRESS'
                    : 'TOURNAMENT FULL'
                  }
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quick Stats Bar */}
      <div className="border-t border-white/20 pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-1">24</div>
            <div className="text-white/60 text-sm uppercase">Active Players</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">156</div>
            <div className="text-white/60 text-sm uppercase">Total Battles</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">12.4K</div>
            <div className="text-white/60 text-sm uppercase">USDT Distributed</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-1">98.7%</div>
            <div className="text-white/60 text-sm uppercase">Uptime</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSolo = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Solo Adventure Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent h-px"></div>
        <div className="pb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">SOLO ADVENTURE</h2>
          <p className="text-white/60 text-lg">Train your mind, earn rewards, and prepare for battle</p>
        </div>
      </div>

      {/* Adventure Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Knowledge Quest",
            description: "Complete daily challenges to earn experience points and unlock new NFTs.",
            icon: "🧠",
            difficulty: "BEGINNER",
            reward: "50 XP",
            button: "START QUEST"
          },
          {
            title: "Skill Builder",
            description: "Practice in different categories to improve your tournament performance.",
            icon: "⚡",
            difficulty: "INTERMEDIATE",
            reward: "100 XP",
            button: "PRACTICE"
          },
          {
            title: "Master Challenge",
            description: "Ultimate tests for the most dedicated players. Exclusive NFT rewards.",
            icon: "👑",
            difficulty: "EXPERT",
            reward: "RARE NFT",
            button: "CHALLENGE"
          }
        ].map((mode, index) => (
          <div
            key={mode.title}
            className="group relative border border-white/20 bg-gradient-to-br from-black/80 to-black/40
                       hover:border-white/60 transition-all duration-300 hover:transform hover:scale-105
                       hover:shadow-2xl hover:shadow-white/10"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative p-6">
              {/* Mode Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="text-4xl">{mode.icon}</div>
                <span className={`text-xs px-3 py-1 border rounded-full font-bold ${
                  mode.difficulty === 'BEGINNER' 
                    ? 'border-green-400 text-green-400 bg-green-400/10'
                    : mode.difficulty === 'INTERMEDIATE'
                    ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                    : 'border-red-400 text-red-400 bg-red-400/10'
                }`}>
                  {mode.difficulty}
                </span>
              </div>

              <h3 className="font-bold text-xl mb-3">{mode.title}</h3>
              <p className="text-white/60 mb-6 leading-relaxed">{mode.description}</p>
              
              {/* Reward Info */}
              <div className="border border-white/10 bg-white/5 p-3 mb-6 text-center">
                <div className="text-lg font-bold text-green-400">{mode.reward}</div>
                <div className="text-xs text-white/60 uppercase">Reward</div>
              </div>

              {/* Action Button */}
              <button className="w-full relative overflow-hidden border border-white hover:border-transparent
                               transition-all duration-300 py-4 text-sm font-bold group
                               hover:shadow-lg hover:shadow-white/20">
                <div className="absolute inset-0 bg-white transform -translate-x-full 
                              group-hover:translate-x-0 transition-transform duration-300"></div>
                <span className="relative group-hover:text-black transition-colors duration-300">
                  {mode.button}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Section */}
      <div className="border-t border-white/20 pt-8">
        <h3 className="text-2xl font-bold mb-6">YOUR PROGRESS</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold mb-2">Level 12</div>
            <div className="text-white/60 text-sm mb-4">Current Level</div>
            <div className="w-full bg-white/10 h-2 rounded-full">
              <div className="bg-gradient-to-r from-white to-green-400 h-2 rounded-full" style={{ width: '67%' }}></div>
            </div>
            <div className="text-xs text-white/40 mt-2">1,340 / 2,000 XP</div>
          </div>
          <div className="border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold mb-2">47</div>
            <div className="text-white/60 text-sm">Quests Completed</div>
          </div>
          <div className="border border-white/20 p-6 text-center">
            <div className="text-3xl font-bold mb-2">8</div>
            <div className="text-white/60 text-sm">NFTs Earned</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVault = () => (
    <div className="space-y-8 animate-fadeIn">
      {/* Vault Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent h-px"></div>
        <div className="pb-8">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">VAULT</h2>
          <p className="text-white/60 text-lg">Your digital treasury and NFT collection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* NFT Collection */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">NFT COLLECTION</h3>
            <span className="text-white/60 text-sm">12 Items</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { id: 1, name: "Genesis Warrior", rarity: "LEGENDARY", image: "⚔️" },
              { id: 2, name: "Quiz Master", rarity: "RARE", image: "🧠" },
              { id: 3, name: "Speed Runner", rarity: "UNCOMMON", image: "⚡" },
              { id: 4, name: "Scholar", rarity: "COMMON", image: "📚" },
              { id: 5, name: "Champion", rarity: "EPIC", image: "👑" },
              { id: 6, name: "Strategist", rarity: "RARE", image: "🎯" }
            ].map((nft) => (
              <div
                key={nft.id}
                className="group relative border border-white/20 aspect-square bg-gradient-to-br from-black/80 to-black/40
                         hover:border-white/60 transition-all duration-300 hover:transform hover:scale-105
                         hover:shadow-2xl hover:shadow-white/10 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative p-4 h-full flex flex-col justify-between">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{nft.image}</div>
                    <span className={`text-xs px-2 py-1 border rounded-full font-bold ${
                      nft.rarity === 'LEGENDARY' 
                        ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                        : nft.rarity === 'EPIC'
                        ? 'border-purple-400 text-purple-400 bg-purple-400/10'
                        : nft.rarity === 'RARE'
                        ? 'border-blue-400 text-blue-400 bg-blue-400/10'
                        : nft.rarity === 'UNCOMMON'
                        ? 'border-green-400 text-green-400 bg-green-400/10'
                        : 'border-white/40 text-white/60 bg-white/5'
                    }`}>
                      {nft.rarity}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-sm">{nft.name}</div>
                    <div className="text-xs text-white/40">#{nft.id.toString().padStart(4, '0')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Balance & Stats */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">WALLET</h3>
          
          {/* Balance Card */}
          <div className="border border-white/20 bg-gradient-to-br from-green-400/10 to-black/40 p-6">
            <h4 className="text-lg font-bold mb-4 text-green-400">USDT BALANCE</h4>
            <div className="text-4xl font-bold mb-2">156.43</div>
            <div className="text-white/60 text-sm mb-4">Available Balance</div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Tournament Winnings:</span>
                <span className="font-mono text-green-400">+89.20</span>
              </div>
              <div className="flex justify-between">
                <span>Fees Paid:</span>
                <span className="font-mono text-red-400">-23.77</span>
              </div>
              <div className="border-t border-white/20 pt-3 flex justify-between font-bold">
                <span>Net Profit:</span>
                <span className="font-mono text-green-400">+65.43</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="border border-white/20 p-6">
            <h4 className="text-lg font-bold mb-4">VAULT STATS</h4>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total NFTs:</span>
                <span className="font-mono font-bold">12</span>
              </div>
              <div className="flex justify-between">
                <span>Legendary:</span>
                <span className="font-mono text-yellow-400">1</span>
              </div>
              <div className="flex justify-between">
                <span>Epic:</span>
                <span className="font-mono text-purple-400">1</span>
              </div>
              <div className="flex justify-between">
                <span>Rare:</span>
                <span className="font-mono text-blue-400">3</span>
              </div>
              <div className="flex justify-between">
                <span>Collection Value:</span>
                <span className="font-mono text-green-400">~450 USDT</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button className="w-full border border-white hover:bg-white hover:text-black 
                             transition-all duration-300 py-3 text-sm font-bold">
              TRADE NFTS
            </button>
            <button className="w-full border border-green-400 text-green-400 hover:bg-green-400 hover:text-black 
                             transition-all duration-300 py-3 text-sm font-bold">
              DEPOSIT USDT
            </button>
            <button className="w-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black 
                             transition-all duration-300 py-3 text-sm font-bold">
              WITHDRAW
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">PROFILE</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="border border-white/20 p-6">
            <h3 className="text-xl font-bold mb-4">PLAYER STATS</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Tournaments Won:</span>
                <span className="font-mono">12</span>
              </div>
              <div className="flex justify-between">
                <span>Total Matches:</span>
                <span className="font-mono">47</span>
              </div>
              <div className="flex justify-between">
                <span>Win Rate:</span>
                <span className="font-mono text-green-400">74.5%</span>
              </div>
              <div className="flex justify-between">
                <span>Rank:</span>
                <span className="font-mono">#156</span>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border border-white/20 p-6">
            <h3 className="text-xl font-bold mb-4">WALLET INFO</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Address:</span>
                <span className="font-mono text-sm">{account.slice(0, 6)}...{account.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Network:</span>
                <span className="font-mono">Polygon</span>
              </div>
              <div className="flex justify-between">
                <span>Connected:</span>
                <span className="text-green-400">✓</span>
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
      case 'arena': return renderArena();
      case 'solo': return renderSolo();
      case 'vault': return renderVault();
      case 'profile': return renderProfile();
      default: return renderArena();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono grid-pattern">
      {/* Header */}
      <header className="border-b border-white/20 bg-black/95 backdrop-blur-sm sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 border-2 border-white flex items-center justify-center 
                          hover:border-green-400 transition-colors duration-300 hover-glow">
              <span className="text-lg font-bold">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight gradient-text">TOOURNAMENT</h1>
              <div className="text-xs text-white/40 uppercase tracking-wider">Decentralized Arena</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">156.43</div>
                <div className="text-xs text-white/60">USDT</div>
              </div>
              <div className="w-px h-8 bg-white/20"></div>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 border border-white/20 px-4 py-2 rounded-full">
              <span className="text-sm text-white/70 font-mono">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
              <div className="w-2 h-2 bg-green-400 rounded-full pulse-glow"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/20 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1">
            {[
              { id: 'arena', label: 'ARENA', icon: '⚔️', count: tournaments.filter(t => t.status === 'open').length },
              { id: 'solo', label: 'SOLO ADVENTURE', icon: '🏔️', count: null },
              { id: 'vault', label: 'VAULT', icon: '🏦', count: 12 },
              { id: 'profile', label: 'PROFILE', icon: '👤', count: null }
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
                  <span className="text-lg">{nav.icon}</span>
                  <span className="hidden sm:inline">{nav.label}</span>
                  {nav.count && (
                    <span className="bg-green-400 text-black text-xs px-2 py-1 rounded-full font-bold">
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
