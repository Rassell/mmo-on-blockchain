// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

import "hardhat/console.sol";
import "./Arena.sol";

/*
 * @dev Contract inherits from Arena who holds game logic by inherance
 * this should be injected by contract address in the constructor for example to reduce size of the contract
 */
contract MMOGame is Arena {
    /*
     * @dev Attack the boss
     */
    function attack() public {
        uint256 tokenId = SelectedChampion[msg.sender];

        // Check if the user is the champion in the arena
        require(
            ActiveArena.userToChampionId[msg.sender] == tokenId,
            "User has not a champion in the arena"
        );

        // Check if the champion is alive
        require(
            NftHolderChampion[tokenId].health != 0,
            "Champion is dead, cannot attack"
        );

        // Check if the arena has started
        require(
            ActiveArena.state == ArenaState.IN_PROGRESS,
            "Arena has not started yet"
        );

        Champion memory champion = NftHolderChampion[tokenId];

        Boss memory boss = getArenaBoss();

        // Attack the boss
        boss.health -= champion.attackPower;

        // Check if the boss is dead
        if (boss.health <= 0) {
            ActiveArena.state = ArenaState.FINISHED;

            emit ArenaFinished();
        }
    }
}
