// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

enum ArenaState {
    NOT_STARTED,
    IN_PROGRESS,
    FINISHED
}

struct Arena {
    mapping(address => uint256) userToChampionId;
    uint256[] championIdList;
    uint256 bossIndex;
    ArenaState state;
    uint256 lastArenaFinishedOn;
}
