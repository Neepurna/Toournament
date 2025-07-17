// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title QuizNFT
 * @dev NFT contract for Adventure Mode rewards and tournament achievements
 */
contract QuizNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    enum NFTType {
        BRONZE_ACHIEVEMENT,    // Basic participation
        SILVER_ACHIEVEMENT,    // Multiple tournaments
        GOLD_ACHIEVEMENT,      // Tournament wins
        PLATINUM_ACHIEVEMENT,  // Multiple wins
        ADVENTURE_REWARD,      // Adventure mode rewards
        SPECIAL_EVENT         // Special tournaments
    }
    
    enum Rarity {
        COMMON,
        UNCOMMON, 
        RARE,
        EPIC,
        LEGENDARY
    }
    
    struct NFTMetadata {
        NFTType nftType;
        Rarity rarity;
        uint256 tournamentId;
        uint256 achievementDate;
        string description;
        uint256 powerLevel;
    }
    
    mapping(uint256 => NFTMetadata) public nftMetadata;
    mapping(address => bool) public authorizedMinters;
    mapping(address => mapping(NFTType => uint256)) public userAchievementCounts;
    
    // Base URIs for different NFT types
    mapping(NFTType => string) public baseURIs;
    
    // Tournament and achievement tracking
    mapping(address => uint256) public tournamentWins;
    mapping(address => uint256) public tournamentParticipations;
    
    event NFTMinted(
        address indexed recipient,
        uint256 indexed tokenId,
        NFTType nftType,
        Rarity rarity,
        uint256 powerLevel
    );
    
    event AchievementUnlocked(
        address indexed user,
        NFTType achievement,
        uint256 tokenId
    );

    constructor(address _initialOwner) ERC721("QuizNFT", "QNFT") Ownable(_initialOwner) {
        // Set initial base URIs (these would point to IPFS in production)
        baseURIs[NFTType.BRONZE_ACHIEVEMENT] = "ipfs://bronze/";
        baseURIs[NFTType.SILVER_ACHIEVEMENT] = "ipfs://silver/";
        baseURIs[NFTType.GOLD_ACHIEVEMENT] = "ipfs://gold/";
        baseURIs[NFTType.PLATINUM_ACHIEVEMENT] = "ipfs://platinum/";
        baseURIs[NFTType.ADVENTURE_REWARD] = "ipfs://adventure/";
        baseURIs[NFTType.SPECIAL_EVENT] = "ipfs://special/";
    }

    /**
     * @dev Mint NFT for tournament achievement
     */
    function mintTournamentAchievement(
        address _recipient,
        uint256 _tournamentId,
        bool _isWinner,
        string memory _description
    ) external nonReentrant {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        
        // Update user stats
        tournamentParticipations[_recipient]++;
        if (_isWinner) {
            tournamentWins[_recipient]++;
        }
        
        // Determine achievement type and rarity based on performance
        (NFTType achievementType, Rarity rarity, uint256 powerLevel) = _calculateAchievement(_recipient, _isWinner);
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        // Mint the NFT
        _safeMint(_recipient, tokenId);
        
        // Set metadata
        nftMetadata[tokenId] = NFTMetadata({
            nftType: achievementType,
            rarity: rarity,
            tournamentId: _tournamentId,
            achievementDate: block.timestamp,
            description: _description,
            powerLevel: powerLevel
        });
        
        // Update user achievement counts
        userAchievementCounts[_recipient][achievementType]++;
        
        // Set token URI
        string memory tokenURI = string(abi.encodePacked(
            baseURIs[achievementType],
            _toString(uint256(rarity)),
            ".json"
        ));
        _setTokenURI(tokenId, tokenURI);
        
        emit NFTMinted(_recipient, tokenId, achievementType, rarity, powerLevel);
        emit AchievementUnlocked(_recipient, achievementType, tokenId);
    }

    /**
     * @dev Mint Adventure Mode reward NFT
     */
    function mintAdventureReward(
        address _recipient,
        Rarity _rarity,
        string memory _description,
        string memory _tokenURI
    ) external nonReentrant {
        require(authorizedMinters[msg.sender], "Not authorized to mint");
        
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        uint256 powerLevel = _calculatePowerLevel(NFTType.ADVENTURE_REWARD, _rarity);
        
        // Mint the NFT
        _safeMint(_recipient, tokenId);
        
        // Set metadata
        nftMetadata[tokenId] = NFTMetadata({
            nftType: NFTType.ADVENTURE_REWARD,
            rarity: _rarity,
            tournamentId: 0, // Not tournament related
            achievementDate: block.timestamp,
            description: _description,
            powerLevel: powerLevel
        });
        
        userAchievementCounts[_recipient][NFTType.ADVENTURE_REWARD]++;
        
        _setTokenURI(tokenId, _tokenURI);
        
        emit NFTMinted(_recipient, tokenId, NFTType.ADVENTURE_REWARD, _rarity, powerLevel);
    }

    /**
     * @dev Calculate achievement type and rarity based on user performance
     */
    function _calculateAchievement(address _user, bool _isWinner) 
        internal 
        view 
        returns (NFTType, Rarity, uint256) 
    {
        uint256 wins = tournamentWins[_user];
        uint256 participations = tournamentParticipations[_user];
        
        if (_isWinner) {
            if (wins >= 10) {
                return (NFTType.PLATINUM_ACHIEVEMENT, Rarity.LEGENDARY, 100);
            } else if (wins >= 5) {
                return (NFTType.GOLD_ACHIEVEMENT, Rarity.EPIC, 75);
            } else {
                return (NFTType.GOLD_ACHIEVEMENT, Rarity.RARE, 50);
            }
        } else {
            if (participations >= 20) {
                return (NFTType.SILVER_ACHIEVEMENT, Rarity.UNCOMMON, 30);
            } else if (participations >= 10) {
                return (NFTType.SILVER_ACHIEVEMENT, Rarity.COMMON, 20);
            } else {
                return (NFTType.BRONZE_ACHIEVEMENT, Rarity.COMMON, 10);
            }
        }
    }

    /**
     * @dev Calculate power level based on NFT type and rarity
     */
    function _calculatePowerLevel(NFTType _type, Rarity _rarity) internal pure returns (uint256) {
        uint256 basepower = 10;
        
        // Type multiplier
        if (_type == NFTType.PLATINUM_ACHIEVEMENT) basepower = 100;
        else if (_type == NFTType.GOLD_ACHIEVEMENT) basepower = 75;
        else if (_type == NFTType.SILVER_ACHIEVEMENT) basepower = 50;
        else if (_type == NFTType.ADVENTURE_REWARD) basepower = 25;
        else if (_type == NFTType.SPECIAL_EVENT) basepower = 150;
        
        // Rarity multiplier
        uint256 rarityMultiplier = 1;
        if (_rarity == Rarity.UNCOMMON) rarityMultiplier = 2;
        else if (_rarity == Rarity.RARE) rarityMultiplier = 3;
        else if (_rarity == Rarity.EPIC) rarityMultiplier = 5;
        else if (_rarity == Rarity.LEGENDARY) rarityMultiplier = 10;
        
        return basepower * rarityMultiplier;
    }

    /**
     * @dev Get user's NFT collection summary
     */
    function getUserCollection(address _user) external view returns (
        uint256 totalNFTs,
        uint256 bronzeCount,
        uint256 silverCount,
        uint256 goldCount,
        uint256 platinumCount,
        uint256 adventureCount,
        uint256 totalPowerLevel
    ) {
        totalNFTs = balanceOf(_user);
        bronzeCount = userAchievementCounts[_user][NFTType.BRONZE_ACHIEVEMENT];
        silverCount = userAchievementCounts[_user][NFTType.SILVER_ACHIEVEMENT];
        goldCount = userAchievementCounts[_user][NFTType.GOLD_ACHIEVEMENT];
        platinumCount = userAchievementCounts[_user][NFTType.PLATINUM_ACHIEVEMENT];
        adventureCount = userAchievementCounts[_user][NFTType.ADVENTURE_REWARD];
        
        // Calculate total power level
        for (uint256 i = 0; i < totalNFTs; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(_user, i);
            totalPowerLevel += nftMetadata[tokenId].powerLevel;
        }
    }

    /**
     * @dev Get NFT metadata
     */
    function getNFTMetadata(uint256 _tokenId) external view returns (NFTMetadata memory) {
        require(_exists(_tokenId), "Token does not exist");
        return nftMetadata[_tokenId];
    }

    /**
     * @dev Set authorized minter
     */
    function setAuthorizedMinter(address _minter, bool _authorized) external onlyOwner {
        authorizedMinters[_minter] = _authorized;
    }

    /**
     * @dev Update base URI for NFT type
     */
    function setBaseURI(NFTType _type, string memory _baseURI) external onlyOwner {
        baseURIs[_type] = _baseURI;
    }

    /**
     * @dev Convert uint to string
     */
    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        
        return string(buffer);
    }

    // Required overrides
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
