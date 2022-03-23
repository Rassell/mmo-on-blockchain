// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

struct Arena {
    mapping(address => uint256) userToChampionId;
    uint256[] championIdList;
    uint256 bossId;
}
