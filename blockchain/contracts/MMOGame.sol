// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "hardhat/console.sol";

/*
 * @dev Contract inherits from Ownable, which enables some capabilities to limit functionality for external users (PoC).
 * Contract inherits from ERC721, which is the standard NFT
 */
contract MMOGame is Ownable, ERC721 {
    event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

    constructor() ERC721("MMO on blockchain", "MMB") {
        _tokenIds.increment();
    }
}
