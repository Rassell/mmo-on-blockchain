// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

import "hardhat/console.sol";
import "./Arena.sol";

/*
 * @dev Contract inherits from Arena who holds game logic by inherance
 * this should be injected by contract address in the constructor for example to reduce size of the contract
 */
contract MMOGame is Arena {
    event AttackComplete(uint256 bossHealth);
    event HealComplete(uint256 championHealth);
    event BossAttackComplete(uint256 tokenId, uint256 championHealth);

    /*
     * @dev Attack the boss
     */
    function attack() public checks {
        uint256 tokenId = SelectedChampion[msg.sender];

        Champion memory champion = NftHolderChampion[tokenId];

        Boss memory boss = getArenaBoss();

        // Check if the boss is dead with next attack
        if (boss.health < champion.attackPower) {
            boss.health = 0;
            ActiveArena.state = ArenaState.FINISHED;

            emit ArenaFinished();
        } else {
            // Attack the boss
            boss.health -= champion.attackPower;
            emit AttackComplete(boss.health);

            // Boss attacks!
            champion.health -= boss.attackPower;
            emit BossAttackComplete(tokenId, champion.health);
        }
    }

    /*
     * @dev Heal yourself
     */
    function heal() public checks {
        uint256 tokenId = SelectedChampion[msg.sender];

        Champion memory champion = NftHolderChampion[tokenId];

        champion.health += champion.healPower;

        emit HealComplete(champion.health);
    }

    modifier checks() {
        uint256 tokenId = SelectedChampion[msg.sender];

        // Check if the user is the champion in the arena
        require(tokenId > 0, "User has not a champion in the arena");

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
        _;
    }
}
