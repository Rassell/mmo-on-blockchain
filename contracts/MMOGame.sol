// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

import "hardhat/console.sol";
import "./Champion.sol";
import "./Boss.sol";
import "./Arena.sol";

/*
 * @dev Contract inherits from Ownable, which enables some capabilities to limit functionality for external users (PoC).
 * Contract inherits from ERC721, which is the standard NFT
 */
contract MMOGame is Ownable, ERC721 {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // The list of all champions.
    Champion[] _champions;

    // The list of all bosses.
    Boss[] _bosses;

    // The active arena
    Arena _arena;

    // Mapping from the nft's tokenId => that NFTs Champion.
    mapping(uint256 => Champion) public _nftHolderChampion;

    // We create a mapping from the nft's tokenId => that NFTs Champion.
    mapping(address => uint256) public _selectedChampion;

    // The mapping for champions to their users.
    mapping(address => uint256[]) private _userRoster;

    event ChampionAddedToRoster(
        address userToNotify,
        uint256 tokenId,
        uint256 championIndex
    );
    event ChampionSelected(address userToNotify, uint256 tokenId);
    event ArenaStarted(uint256 bossIndex);
    event ArenaNewChampion(uint256 tokenId);
    event ArenaFinished();

    constructor() ERC721("MMO on blockchain", "MMB") {
        // start with 1 for easier work with arrays.
        _tokenIds.increment();

        // Initialize the state of the arena.
        _arena.state = ArenaState.NOT_STARTED;
    }

    /*
     * @dev Function to create a new champion.
     * @param name The name of the champion.
     * @param name The health of the champion.
     * @param name The attackPower of the champion.
     * @param name The healthPower of the champion.
     * @param gifUris The uri of the gifs to display different states.
     */
    function addChampion(
        string memory name,
        uint8 health,
        uint8 attackPower,
        uint8 healthPower,
        string[] memory gifUris
    ) public onlyOwner {
        // Create a new champion
        Champion memory championToAdd = createChampion(
            name,
            health,
            attackPower,
            healthPower,
            gifUris
        );

        _champions.push(championToAdd);
    }

    /*
     * @dev Function to return list of champions.
     */
    function getChampionList() public view returns (Champion[] memory) {
        return _champions;
    }

    /*
     * @dev Function to create a new boss.
     * @param name The name of the boss.
     * @param name The health of the boss.
     * @param name The attackPower of the boss.
     * @param gifUris The uri of the gifs to display different states.
     */
    function addBoss(
        string memory name,
        uint256 health,
        uint256 attackPower,
        string[] memory gifUris
    ) public onlyOwner {
        // Create a new boss
        Boss memory bossToAdd = createBoss(name, health, attackPower, gifUris);

        _bosses.push(bossToAdd);
    }

    /*
     * @dev Function to return list of champions.
     */
    function getBossList() public view returns (Boss[] memory) {
        return _bosses;
    }

    /*
     * @dev Function to check if the user have any champion.
     */
    function userHasRoster() public view returns (bool) {
        return _userRoster[msg.sender].length != 0;
    }

    /*
     * @dev Function to return the roster of the user.
     */
    function getUserRoster() public view returns (uint256[] memory) {
        return _userRoster[msg.sender];
    }

    /*
     * @dev Function to add champion to the roster of the user.
     */
    function addChampionToRoster(uint256 _championIndex) public {
        uint256 newRecordId = _tokenIds.current();

        console.log(
            "Registering championid %s on the contract with tokenID %d",
            _championIndex,
            newRecordId
        );

        _safeMint(msg.sender, newRecordId);

        _userRoster[msg.sender].push(newRecordId);
        _nftHolderChampion[newRecordId] = _champions[_championIndex];

        _tokenIds.increment();

        emit ChampionAddedToRoster(msg.sender, newRecordId, _championIndex);
    }

    /*
     * @dev Function to select a champion from the roster of the user.
     */
    function setSelectChampion(uint256 _rosterIndex) public {
        uint256[] memory userRoster = getUserRoster();

        require(
            userRoster.length != 0,
            "User must have a roster to select a champion."
        );

        uint256 tokenId = userRoster[_rosterIndex];

        _selectedChampion[msg.sender] = tokenId;

        emit ChampionSelected(msg.sender, tokenId);
    }

    /*
     * @dev Function to get selected champion
     */
    function getSelectedChampion() public view returns (uint256) {
        return _selectedChampion[msg.sender];
    }

    /*
     * @dev Function to add champion to the current arena
     * or create a new arena if there is no arena yet.
     */
    function addChampionToArena() public {
        uint256 tokenId = _selectedChampion[msg.sender];

        // Dead champion can't be added to arena.
        require(
            _nftHolderChampion[tokenId].health != 0,
            "Champion is dead, cannot add to arena"
        );

        // Already champion in arena can't be added to arena.
        require(
            _arena.userToChampionId[msg.sender] == 0,
            "Champion already in arena"
        );

        // TODO: check if have passed 5 minutes since arena finished to start a new one

        // Check if the arena has started
        if (_arena.state == ArenaState.NOT_STARTED) {
            uint256 bossIndex = _arena.bossIndex;
            uint256 newBossIndex = bossIndex + 1;
            if (newBossIndex > _bosses.length) {
                newBossIndex = 0;
            }

            _arena.bossIndex = newBossIndex;

            emit ArenaStarted(bossIndex);
        }

        _arena.championIdList.push(tokenId);
        _arena.userToChampionId[msg.sender] = tokenId;

        emit ArenaNewChampion(tokenId);
    }

    /*
     * @dev Get actual champions from the arena
     */
    function getArenaChampionList() public view returns (uint256[] memory) {
        return _arena.championIdList;
    }

    /*
     * @dev Get actual boss from the arena
     */
    function getArenaBoss() public view returns (Boss memory) {
        return _bosses[_arena.bossIndex];
    }

    /*
     * @dev Attack the boss
     */
     function attack() public {
        uint256 tokenId = _selectedChampion[msg.sender];

        // Check if the user is the champion in the arena
        require(
            _arena.userToChampionId[msg.sender] == tokenId,
            "User has not a champion in the arena"
        );

        // Check if the champion is alive
        require(
            _nftHolderChampion[tokenId].health != 0,
            "Champion is dead, cannot attack"
        );

        // Check if the arena has started
        require(
            _arena.state == ArenaState.IN_PROGRESS,
            "Arena has not started yet"
        );

        Champion memory champion = _nftHolderChampion[tokenId];

        Boss memory boss = getArenaBoss();

        // Attack the boss
        boss.health -= champion.attackPower;

        // Check if the boss is dead
        if (boss.health <= 0) {
            _arena.state = ArenaState.FINISHED;

            emit ArenaFinished();
        }
     }
}
