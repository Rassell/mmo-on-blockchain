// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

enum ArenaState {
    NOT_STARTED,
    IN_PROGRESS,
    FINISHED
}

import "./Roster.sol";
import "./BossFactory.sol";

struct ArenaStruct {
    mapping(address => uint256) userToChampionId;
    uint256[] championIdList;
    uint256 bossIndex;
    ArenaState state;
    uint256 lastArenaFinishedOn;
}

contract Arena is BossFactory, Roster {
    // The active arena
    ArenaStruct public ActiveArena;

    event ArenaStarted(uint256 bossIndex);
    event ArenaNewChampion(uint256 tokenId);
    event ArenaFinished();

    constructor() {
        // Initialize the state of the arena.
        ActiveArena.state = ArenaState.NOT_STARTED;
    }

    /*
     * @dev Function to add champion to the current arena
     * or create a new arena if there is no arena yet.
     */
    function addChampionToArena() public {
        uint256 tokenId = SelectedChampion[msg.sender];

        // Dead champion can't be added to arena.
        require(
            NftHolderChampion[tokenId].health != 0,
            "Champion is dead, cannot add to arena"
        );

        // Already champion in arena can't be added to arena.
        require(
            ActiveArena.userToChampionId[msg.sender] == 0,
            "Champion already in arena"
        );

        // TODO: check if have passed 5 minutes since arena finished to start a new one

        // Check if the arena has started
        if (ActiveArena.state == ArenaState.NOT_STARTED) {
            uint256 bossIndex = ActiveArena.bossIndex;
            uint256 newBossIndex = bossIndex + 1;
            if (newBossIndex > Bosses.length - 1) {
                newBossIndex = 0;
            }

            ActiveArena.bossIndex = newBossIndex;
            ActiveArena.state = ArenaState.IN_PROGRESS;

            emit ArenaStarted(bossIndex);
        }

        ActiveArena.championIdList.push(tokenId);
        ActiveArena.userToChampionId[msg.sender] = tokenId;

        emit ArenaNewChampion(tokenId);
    }

    /*
     * @dev Get actual champions from the arena
     */
    function getArenaChampionList() public view returns (uint256[] memory) {
        return ActiveArena.championIdList;
    }

    /*
     * @dev Get actual boss from the arena
     */
    function getArenaBoss() public view returns (Boss memory) {
        return Bosses[ActiveArena.bossIndex];
    }
}
