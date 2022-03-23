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
import "./Champion.sol";

/*
 * @dev Contract inherits from Ownable, which enables some capabilities to limit functionality for external users (PoC).
 * Contract inherits from ERC721, which is the standard NFT
 */
contract MMOGame is Ownable, ERC721 {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // The list of all champions.
    Champion[] _champions;

    event AttackComplete(uint256 newBossHp, uint256 newPlayerHp);

    constructor() ERC721("MMO on blockchain", "MMB") {
        _tokenIds.increment();
    }

    /*
     * @dev Function to create a new champion.
     * @param name The name of the champion.
     * @param name The health of the champion.
     * @param name The attackPower of the champion.
     * @param name The healthPower of the champion.
     * @param gifUris The uri of the gifs to display different states.
     */
    function addChampion(
        string memory name,
        uint8 health,
        uint8 attackPower,
        uint8 healthPower,
        string[] memory gifUris
    ) public payable onlyOwner {
        // Create a new champion
        Champion memory championToAdd = createChampion(
            name,
            health,
            attackPower,
            healthPower,
            gifUris
        );

        _champions.push(championToAdd);
    }

    /*
     * @dev Function to return list of champions.
     */
    function getChampionList() public view returns (Champion[] memory) {
        return _champions;
    }
}
