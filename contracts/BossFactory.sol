// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Shared.sol";

// TODO: Share code with champion with library?
// Create contracts?
struct Boss {
    string name;
    uint256 health;
    uint256 attackPower;
    GifStatus gifUris;
}

contract BossFactory is Ownable {
    // The list of all bosses.
    Boss[] public Bosses;

    /*
     * @dev Function to create a new boss.
     * @param name The name of the boss.
     * @param name The health of the boss.
     * @param name The attackPower of the boss.
     * @param gifUris The uri of the gifs to display different states.
     */
    function addBoss(
        string memory name,
        uint256 health,
        uint256 attackPower,
        string[] memory gifUris
    ) public onlyOwner {
        Boss memory bossToAdd;

        bossToAdd.name = name;
        bossToAdd.health = health;
        bossToAdd.attackPower = attackPower;

        bossToAdd.gifUris.idle = gifUris[0];
        bossToAdd.gifUris.attack = gifUris[1];
        bossToAdd.gifUris.hurt = gifUris[2];
        bossToAdd.gifUris.dying = gifUris[3];
        bossToAdd.gifUris.dead = gifUris[4];

        Bosses.push(bossToAdd);
    }

    /*
     * @dev Function to return list of champions.
     */
    function getBossList() public view returns (Boss[] memory) {
        return Bosses;
    }
}
