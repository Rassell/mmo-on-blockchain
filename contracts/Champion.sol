// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

struct GifStatus {
    string idle;
    string attack;
    string hurt;
    string dying;
    string dead;
}

struct Champion {
    string name;
    uint8 health;
    uint8 attackPower;
    uint8 healthPower;
    GifStatus gifUris;
}

function createChampion(
    string memory name,
    uint8 health,
    uint8 attackPower,
    uint8 healthPower,
    string[] memory gifUris
) pure returns (Champion memory) {
    Champion memory champion;

    champion.name = name;
    champion.health = health;
    champion.attackPower = attackPower;
    champion.healthPower = healthPower;

    champion.gifUris.idle = gifUris[0];
    champion.gifUris.attack = gifUris[1];
    champion.gifUris.hurt = gifUris[2];
    champion.gifUris.dying = gifUris[3];
    champion.gifUris.dead = gifUris[4];

    return champion;
}
