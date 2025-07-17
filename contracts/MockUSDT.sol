// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDT
 * @dev Mock USDT contract for testing purposes
 */
contract MockUSDT is ERC20, Ownable {
    uint8 private _decimals = 6; // USDT has 6 decimals

    constructor(address _initialOwner) ERC20("Mock USDT", "USDT") Ownable(_initialOwner) {
        // Mint initial supply to owner (1 million USDT)
        _mint(_initialOwner, 1000000 * 10**_decimals);
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @dev Mint USDT for testing (only owner)
     */
    function mint(address _to, uint256 _amount) external onlyOwner {
        _mint(_to, _amount);
    }

    /**
     * @dev Faucet function for testing - gives 1000 USDT to anyone
     */
    function faucet() external {
        require(balanceOf(msg.sender) < 10000 * 10**_decimals, "Already have enough USDT");
        _mint(msg.sender, 1000 * 10**_decimals);
    }

    /**
     * @dev Burn USDT
     */
    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }
}
