// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

struct Champion {
    string name;
    uint256 health;
    uint256 maxHealth;
    uint256 attackPower;
    uint256 healPower;
    GifStatus gifUris;
}

struct GifStatus {
    string idle;
    string attack;
    string hurt;
    string dying;
    string dead;
}
