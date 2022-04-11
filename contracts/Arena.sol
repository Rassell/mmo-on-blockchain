// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

import "./Roster.sol";
import "./BossFactory.sol";

struct ArenaStruct {
    mapping(address => uint256) userToChampionId;
    uint256[] championIdList;
    uint256 bossIndex;
    Boss boss;
    ArenaState state;
    uint256 lastArenaFinishedOn;
}

enum ArenaState {
    NOT_STARTED,
    IN_PROGRESS,
    FINISHED
}

contract Arena is Ownable {
    BossFactory public _bossFactory;
    Roster public _roster;

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

    /*
     * @dev Function to set Roster
     */
    function setRoster(address rosterAddress) public onlyOwner {
        _roster = Roster(rosterAddress);
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
        uint256 tokenId = _roster.getSelectedChampion(msg.sender);

        // Dead champion can't be added to arena.
        require(
            _roster.getNFTChampion(tokenId).health != 0,
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

            Boss memory newBoss = bossList[newBossIndex];
            console.log(newBoss.name);

            ActiveArena.boss = newBoss;
            ActiveArena.state = ArenaState.IN_PROGRESS;

            emit ArenaStarted(bossIndex);
        }

        ActiveArena.championIdList.push(tokenId);
        ActiveArena.userToChampionId[msg.sender] = tokenId;

        emit ArenaNewChampion(tokenId);
    }

    /*
     * @dev Get the full arena state
     */
    function getArena()
        public
        view
        returns (
            uint256[] memory,
            Boss memory,
            ArenaState
        )
    {
        return (
            ActiveArena.championIdList,
            ActiveArena.boss,
            ActiveArena.state
        );
    }

    function damageBoss(uint256 damage) public {
        ActiveArena.boss.health -= damage;
    }
}
