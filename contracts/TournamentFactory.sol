// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Tournament.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TournamentFactory
 * @dev Factory contract to create and manage tournaments
 */
contract TournamentFactory is Ownable, ReentrancyGuard {
    struct TournamentInfo {
        address tournamentAddress;
        address creator;
        uint256 entryFee;
        uint8 maxPlayers;
        string name;
        string description;
        uint256 createdAt;
        bool isActive;
    }

    mapping(uint256 => TournamentInfo) public tournaments;
    mapping(address => uint256[]) public playerTournaments;
    mapping(address => uint256[]) public creatorTournaments;
    
    uint256 public tournamentCounter;
    uint256 public platformFeePercentage = 20; // 20% platform fee
    address public platformFeeRecipient;
    address public usdtToken; // USDT contract address

    event TournamentCreated(
        uint256 indexed tournamentId,
        address indexed tournamentAddress,
        address indexed creator,
        uint256 entryFee,
        uint8 maxPlayers,
        string name
    );

    event PlatformFeeUpdated(uint256 oldFee, uint256 newFee);

    constructor(address _usdtToken, address _initialOwner) Ownable(_initialOwner) {
        usdtToken = _usdtToken;
        platformFeeRecipient = _initialOwner;
    }

    /**
     * @dev Create a new tournament
     * @param _entryFee Entry fee in USDT (with 6 decimals)
     * @param _maxPlayers Maximum number of players (2-16)
     * @param _name Tournament name
     * @param _description Tournament description
     */
    function createTournament(
        uint256 _entryFee,
        uint8 _maxPlayers,
        string memory _name,
        string memory _description
    ) external nonReentrant returns (address) {
        require(_entryFee > 0, "Entry fee must be greater than 0");
        require(_maxPlayers >= 2 && _maxPlayers <= 16, "Invalid max players");
        require(bytes(_name).length > 0, "Name cannot be empty");

        // Deploy new tournament contract
        Tournament newTournament = new Tournament(
            _entryFee,
            _maxPlayers,
            usdtToken,
            msg.sender,
            address(this),
            platformFeePercentage
        );

        uint256 tournamentId = tournamentCounter++;
        
        tournaments[tournamentId] = TournamentInfo({
            tournamentAddress: address(newTournament),
            creator: msg.sender,
            entryFee: _entryFee,
            maxPlayers: _maxPlayers,
            name: _name,
            description: _description,
            createdAt: block.timestamp,
            isActive: true
        });

        creatorTournaments[msg.sender].push(tournamentId);

        emit TournamentCreated(
            tournamentId,
            address(newTournament),
            msg.sender,
            _entryFee,
            _maxPlayers,
            _name
        );

        return address(newTournament);
    }

    /**
     * @dev Get tournament info by ID
     */
    function getTournament(uint256 _tournamentId) external view returns (TournamentInfo memory) {
        return tournaments[_tournamentId];
    }

    /**
     * @dev Get all tournaments created by a user
     */
    function getCreatorTournaments(address _creator) external view returns (uint256[] memory) {
        return creatorTournaments[_creator];
    }

    /**
     * @dev Get all tournaments a player has joined
     */
    function getPlayerTournaments(address _player) external view returns (uint256[] memory) {
        return playerTournaments[_player];
    }

    /**
     * @dev Get active tournaments with pagination
     */
    function getActiveTournaments(uint256 _offset, uint256 _limit) 
        external 
        view 
        returns (TournamentInfo[] memory) 
    {
        require(_limit > 0 && _limit <= 50, "Invalid limit");
        
        uint256 activeCount = 0;
        for (uint256 i = 0; i < tournamentCounter; i++) {
            if (tournaments[i].isActive) {
                activeCount++;
            }
        }

        if (_offset >= activeCount) {
            return new TournamentInfo[](0);
        }

        uint256 resultLength = activeCount - _offset;
        if (resultLength > _limit) {
            resultLength = _limit;
        }

        TournamentInfo[] memory result = new TournamentInfo[](resultLength);
        uint256 currentIndex = 0;
        uint256 resultIndex = 0;

        for (uint256 i = 0; i < tournamentCounter && resultIndex < resultLength; i++) {
            if (tournaments[i].isActive) {
                if (currentIndex >= _offset) {
                    result[resultIndex] = tournaments[i];
                    resultIndex++;
                }
                currentIndex++;
            }
        }

        return result;
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function updatePlatformFee(uint256 _newFeePercentage) external onlyOwner {
        require(_newFeePercentage <= 50, "Fee cannot exceed 50%");
        uint256 oldFee = platformFeePercentage;
        platformFeePercentage = _newFeePercentage;
        emit PlatformFeeUpdated(oldFee, _newFeePercentage);
    }

    /**
     * @dev Update platform fee recipient (only owner)
     */
    function updatePlatformFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid recipient");
        platformFeeRecipient = _newRecipient;
    }

    /**
     * @dev Update USDT token address (only owner)
     */
    function updateUSDTToken(address _newUSDTToken) external onlyOwner {
        require(_newUSDTToken != address(0), "Invalid USDT token");
        usdtToken = _newUSDTToken;
    }

    /**
     * @dev Called by tournament contract when a player joins
     */
    function recordPlayerJoined(uint256 _tournamentId, address _player) external {
        require(tournaments[_tournamentId].tournamentAddress == msg.sender, "Unauthorized");
        playerTournaments[_player].push(_tournamentId);
    }

    /**
     * @dev Called by tournament contract when tournament is completed
     */
    function recordTournamentCompleted(uint256 _tournamentId) external {
        require(tournaments[_tournamentId].tournamentAddress == msg.sender, "Unauthorized");
        tournaments[_tournamentId].isActive = false;
    }
}
