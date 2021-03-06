// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Shared.sol";

contract ChampionFactory is Ownable {
    // The list of all champions.
    Champion[] Champions;

    /*
     * @dev Function to create a new champion.
     * @param name The name of the champion.
     * @param name The health of the champion.
     * @param name The attackPower of the champion.
     * @param name The healPower of the champion.
     * @param gifUris The uri of the gifs to display different states.
     */
    function addChampion(
        string memory name,
        uint256 maxHealth,
        uint256 attackPower,
        uint256 healPower,
        string[] memory gifUris
    ) public onlyOwner {
        Champion memory championToAdd;

        championToAdd.name = name;
        championToAdd.health = maxHealth;
        championToAdd.maxHealth = maxHealth;
        championToAdd.attackPower = attackPower;
        championToAdd.healPower = healPower;

        championToAdd.gifUris.idle = gifUris[0];
        championToAdd.gifUris.attack = gifUris[1];
        championToAdd.gifUris.hurt = gifUris[2];
        championToAdd.gifUris.dying = gifUris[3];
        championToAdd.gifUris.dead = gifUris[4];

        Champions.push(championToAdd);
    }

    /*
     * @dev Function to return list of champions.
     */
    function getChampionList() public view returns (Champion[] memory) {
        return Champions;
    }
}
