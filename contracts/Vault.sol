// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title Vault
 * @dev Personal vault contract for each user to store NFTs and interact with tournaments
 */
contract Vault is ReentrancyGuard, Ownable {
    IERC20 public immutable usdtToken;
    address public immutable user;
    
    struct VaultBalance {
        uint256 usdtBalance;
        uint256 lastUpdated;
    }
    
    VaultBalance public balance;
    
    // Approved contracts that can interact with this vault
    mapping(address => bool) public approvedContracts;
    
    // Tournament history
    struct TournamentHistory {
        address tournamentAddress;
        uint256 entryFee;
        bool isWinner;
        uint256 prizeWon;
        uint256 timestamp;
    }
    
    TournamentHistory[] public tournamentHistory;
    
    // Events
    event Deposited(uint256 amount, uint256 timestamp);
    event Withdrawn(uint256 amount, uint256 timestamp);
    event ContractApproved(address indexed contractAddress, bool approved);
    event TournamentRecorded(address indexed tournament, bool isWinner, uint256 prizeWon);

    modifier onlyUser() {
        require(msg.sender == user, "Only vault owner can call this");
        _;
    }

    modifier onlyApproved() {
        require(approvedContracts[msg.sender] || msg.sender == user, "Not approved");
        _;
    }

    constructor(address _user, address _usdtToken) Ownable(_user) {
        user = _user;
        usdtToken = IERC20(_usdtToken);
        balance.lastUpdated = block.timestamp;
    }

    /**
     * @dev Deposit USDT into vault
     */
    function deposit(uint256 _amount) external onlyUser nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(usdtToken.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        
        require(usdtToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        balance.usdtBalance += _amount;
        balance.lastUpdated = block.timestamp;
        
        emit Deposited(_amount, block.timestamp);
    }

    /**
     * @dev Withdraw USDT from vault
     */
    function withdraw(uint256 _amount) external onlyUser nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(balance.usdtBalance >= _amount, "Insufficient vault balance");
        
        balance.usdtBalance -= _amount;
        balance.lastUpdated = block.timestamp;
        
        require(usdtToken.transfer(msg.sender, _amount), "Transfer failed");
        
        emit Withdrawn(_amount, block.timestamp);
    }

    /**
     * @dev Withdraw USDT to pay tournament entry fee (called by approved contracts)
     */
    function withdrawForTournament(uint256 _amount, address _tournament) 
        external 
        onlyApproved 
        nonReentrant 
        returns (bool) 
    {
        require(_amount > 0, "Amount must be greater than 0");
        require(balance.usdtBalance >= _amount, "Insufficient vault balance");
        
        balance.usdtBalance -= _amount;
        balance.lastUpdated = block.timestamp;
        
        bool success = usdtToken.transfer(_tournament, _amount);
        return success;
    }

    /**
     * @dev Record tournament participation
     */
    function recordTournament(
        address _tournamentAddress,
        uint256 _entryFee,
        bool _isWinner,
        uint256 _prizeWon
    ) external onlyApproved {
        tournamentHistory.push(TournamentHistory({
            tournamentAddress: _tournamentAddress,
            entryFee: _entryFee,
            isWinner: _isWinner,
            prizeWon: _prizeWon,
            timestamp: block.timestamp
        }));
        
        // If won prize, add to vault balance
        if (_prizeWon > 0) {
            balance.usdtBalance += _prizeWon;
            balance.lastUpdated = block.timestamp;
        }
        
        emit TournamentRecorded(_tournamentAddress, _isWinner, _prizeWon);
    }

    /**
     * @dev Approve/disapprove contracts to interact with vault
     */
    function setContractApproval(address _contract, bool _approved) external onlyUser {
        approvedContracts[_contract] = _approved;
        emit ContractApproved(_contract, _approved);
    }

    /**
     * @dev Get vault balance
     */
    function getBalance() external view returns (uint256) {
        return balance.usdtBalance;
    }

    /**
     * @dev Get tournament history count
     */
    function getTournamentHistoryCount() external view returns (uint256) {
        return tournamentHistory.length;
    }

    /**
     * @dev Get tournament history with pagination
     */
    function getTournamentHistory(uint256 _offset, uint256 _limit) 
        external 
        view 
        returns (TournamentHistory[] memory) 
    {
        require(_limit > 0 && _limit <= 50, "Invalid limit");
        
        if (_offset >= tournamentHistory.length) {
            return new TournamentHistory[](0);
        }
        
        uint256 resultLength = tournamentHistory.length - _offset;
        if (resultLength > _limit) {
            resultLength = _limit;
        }
        
        TournamentHistory[] memory result = new TournamentHistory[](resultLength);
        
        for (uint256 i = 0; i < resultLength; i++) {
            result[i] = tournamentHistory[_offset + i];
        }
        
        return result;
    }

    /**
     * @dev Get user statistics
     */
    function getUserStats() external view returns (
        uint256 totalTournaments,
        uint256 tournamentsWon,
        uint256 totalEntryFees,
        uint256 totalPrizesWon,
        uint256 netProfit
    ) {
        totalTournaments = tournamentHistory.length;
        
        for (uint256 i = 0; i < tournamentHistory.length; i++) {
            if (tournamentHistory[i].isWinner) {
                tournamentsWon++;
            }
            totalEntryFees += tournamentHistory[i].entryFee;
            totalPrizesWon += tournamentHistory[i].prizeWon;
        }
        
        netProfit = totalPrizesWon > totalEntryFees ? 
            totalPrizesWon - totalEntryFees : 
            0;
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 contractBalance = usdtToken.balanceOf(address(this));
        if (contractBalance > 0) {
            require(usdtToken.transfer(user, contractBalance), "Emergency withdraw failed");
            balance.usdtBalance = 0;
            balance.lastUpdated = block.timestamp;
        }
    }
}
