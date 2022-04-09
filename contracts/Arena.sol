// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

import "./Roster.sol";
import "./BossFactory.sol";

struct ArenaStruct {
    mapping(address => uint256) userToChampionId;
    uint256[] championIdList;
    uint256 bossIndex;
    ArenaState state;
    uint256 lastArenaFinishedOn;
}

enum ArenaState {
    NOT_STARTED,
    IN_PROGRESS,
    FINISHED
}

contract Arena is Roster {
    BossFactory public _bossFactory;

    // The active arena
    ArenaStruct public ActiveArena;

    event ArenaStarted(uint256 bossIndex);
    event ArenaNewChampion(uint256 tokenId);
    event ArenaFinished();

    /*
     * @dev Function to set Champion Factory
     */
    function setBossFactory(address bossFactoryAddress) public onlyOwner {
        _bossFactory = BossFactory(bossFactoryAddress);
    }

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
            Boss[] memory bossList = _bossFactory.getBossList();
            uint256 bossIndex = ActiveArena.bossIndex;
            uint256 newBossIndex = bossIndex + 1;
            if (newBossIndex > bossList.length - 1) {
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
     * @dev Get actual arena state
     */
    function getArenaChampionList() public view returns (uint256[] memory) {
        return ActiveArena.championIdList;
    }

    /*
     * @dev Get actual boss from the arena
     */
    function getArenaBoss() public view returns (Boss memory) {
        return _bossFactory.getBossList()[ActiveArena.bossIndex];
    }

    /*
     * @dev Get actual state of the arena
     */
    function getArenaState() public view returns (ArenaState) {
        return ActiveArena.state;
    }
}
