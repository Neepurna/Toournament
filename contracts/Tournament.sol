// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Tournament
 * @dev Individual tournament contract that handles entry fees, player management, and prize distribution
 */
contract Tournament is ReentrancyGuard, Ownable {
    enum TournamentState {
        OPEN,           // Accepting players
        IN_PROGRESS,    // Tournament started
        COMPLETED,      // Winner declared
        CANCELLED       // Tournament cancelled
    }

    struct Player {
        address playerAddress;
        uint256 joinedAt;
        bool hasClaimed;
    }

    IERC20 public immutable usdtToken;
    address public immutable factory;
    address public immutable creator;
    
    uint256 public immutable entryFee;
    uint8 public immutable maxPlayers;
    uint256 public immutable platformFeePercentage;
    
    TournamentState public state;
    uint256 public totalPrizePool;
    address public winner;
    uint256 public tournamentStartTime;
    uint256 public tournamentEndTime;
    
    Player[] public players;
    mapping(address => bool) public hasJoined;
    mapping(address => uint256) public playerIndex;
    
    // Events
    event PlayerJoined(address indexed player, uint256 timestamp);
    event TournamentStarted(uint256 timestamp);
    event WinnerDeclared(address indexed winner, uint256 winnerPrize, uint256 platformFee);
    event TournamentCancelled(uint256 timestamp);
    event PrizeClaimed(address indexed player, uint256 amount);

    modifier onlyCreatorOrOwner() {
        require(msg.sender == creator || msg.sender == owner(), "Unauthorized");
        _;
    }

    modifier inState(TournamentState _state) {
        require(state == _state, "Invalid tournament state");
        _;
    }

    constructor(
        uint256 _entryFee,
        uint8 _maxPlayers,
        address _usdtToken,
        address _creator,
        address _factory,
        uint256 _platformFeePercentage
    ) Ownable(_creator) {
        entryFee = _entryFee;
        maxPlayers = _maxPlayers;
        usdtToken = IERC20(_usdtToken);
        creator = _creator;
        factory = _factory;
        platformFeePercentage = _platformFeePercentage;
        state = TournamentState.OPEN;
    }

    /**
     * @dev Join the tournament by paying the entry fee
     */
    function joinTournament() external nonReentrant inState(TournamentState.OPEN) {
        require(!hasJoined[msg.sender], "Already joined");
        require(players.length < maxPlayers, "Tournament full");
        require(usdtToken.balanceOf(msg.sender) >= entryFee, "Insufficient USDT balance");

        // Transfer entry fee from player
        require(
            usdtToken.transferFrom(msg.sender, address(this), entryFee),
            "USDT transfer failed"
        );

        // Add player to tournament
        players.push(Player({
            playerAddress: msg.sender,
            joinedAt: block.timestamp,
            hasClaimed: false
        }));
        
        hasJoined[msg.sender] = true;
        playerIndex[msg.sender] = players.length - 1;
        totalPrizePool += entryFee;

        // Record in factory
        try ITournamentFactory(factory).recordPlayerJoined(0, msg.sender) {} catch {}

        emit PlayerJoined(msg.sender, block.timestamp);

        // Auto-start if tournament is full
        if (players.length == maxPlayers) {
            _startTournament();
        }
    }

    /**
     * @dev Start the tournament (manual trigger by creator)
     */
    function startTournament() external onlyCreatorOrOwner inState(TournamentState.OPEN) {
        require(players.length >= 2, "Need at least 2 players");
        _startTournament();
    }

    /**
     * @dev Internal function to start tournament
     */
    function _startTournament() internal {
        state = TournamentState.IN_PROGRESS;
        tournamentStartTime = block.timestamp;
        emit TournamentStarted(block.timestamp);
    }

    /**
     * @dev Declare winner and distribute prizes
     * @param _winner Address of the winning player
     */
    function declareWinner(address _winner) external onlyCreatorOrOwner inState(TournamentState.IN_PROGRESS) {
        require(hasJoined[_winner], "Winner must be a participant");
        
        winner = _winner;
        state = TournamentState.COMPLETED;
        tournamentEndTime = block.timestamp;

        // Calculate prizes
        uint256 platformFee = (totalPrizePool * platformFeePercentage) / 100;
        uint256 winnerPrize = totalPrizePool - platformFee;

        // Transfer platform fee
        if (platformFee > 0) {
            address feeRecipient = ITournamentFactory(factory).platformFeeRecipient();
            require(usdtToken.transfer(feeRecipient, platformFee), "Platform fee transfer failed");
        }

        // Transfer winner prize
        require(usdtToken.transfer(_winner, winnerPrize), "Winner prize transfer failed");
        
        players[playerIndex[_winner]].hasClaimed = true;

        // Record in factory
        try ITournamentFactory(factory).recordTournamentCompleted(0) {} catch {}

        emit WinnerDeclared(_winner, winnerPrize, platformFee);
    }

    /**
     * @dev Cancel tournament and refund players
     */
    function cancelTournament() external onlyCreatorOrOwner {
        require(state == TournamentState.OPEN || state == TournamentState.IN_PROGRESS, "Cannot cancel");
        
        state = TournamentState.CANCELLED;
        
        // Refund all players
        for (uint256 i = 0; i < players.length; i++) {
            if (!players[i].hasClaimed) {
                require(
                    usdtToken.transfer(players[i].playerAddress, entryFee),
                    "Refund failed"
                );
                players[i].hasClaimed = true;
            }
        }

        emit TournamentCancelled(block.timestamp);
    }

    /**
     * @dev Get tournament information
     */
    function getTournamentInfo() external view returns (
        TournamentState _state,
        uint256 _entryFee,
        uint8 _maxPlayers,
        uint256 _currentPlayers,
        uint256 _totalPrizePool,
        address _winner,
        uint256 _startTime,
        uint256 _endTime
    ) {
        return (
            state,
            entryFee,
            maxPlayers,
            players.length,
            totalPrizePool,
            winner,
            tournamentStartTime,
            tournamentEndTime
        );
    }

    /**
     * @dev Get all players in the tournament
     */
    function getPlayers() external view returns (Player[] memory) {
        return players;
    }

    /**
     * @dev Get player count
     */
    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }

    /**
     * @dev Check if address is a player
     */
    function isPlayer(address _address) external view returns (bool) {
        return hasJoined[_address];
    }

    /**
     * @dev Emergency withdraw (only owner, only if tournament is cancelled)
     */
    function emergencyWithdraw() external onlyOwner inState(TournamentState.CANCELLED) {
        uint256 balance = usdtToken.balanceOf(address(this));
        if (balance > 0) {
            require(usdtToken.transfer(owner(), balance), "Emergency withdraw failed");
        }
    }
}

/**
 * @title ITournamentFactory
 * @dev Interface for factory contract
 */
interface ITournamentFactory {
    function recordPlayerJoined(uint256 tournamentId, address player) external;
    function recordTournamentCompleted(uint256 tournamentId) external;
    function platformFeeRecipient() external view returns (address);
}
