// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

import "./Shared.sol";

// TODO: Share code with champion with library?
// Create contracts?
struct Boss {
    string name;
    uint256 health;
    uint256 attackPower;
    GifStatus gifUris;
}

function createBoss(
    string memory name,
    uint256 health,
    uint256 attackPower,
    string[] memory gifUris
) pure returns (Boss memory) {
    Boss memory boss;

    boss.name = name;
    boss.health = health;
    boss.attackPower = attackPower;

    boss.gifUris.idle = gifUris[0];
    boss.gifUris.attack = gifUris[1];
    boss.gifUris.hurt = gifUris[2];
    boss.gifUris.dying = gifUris[3];
    boss.gifUris.dead = gifUris[4];

    return boss;
}
