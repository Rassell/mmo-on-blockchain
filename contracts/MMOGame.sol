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

    // Mapping from the nft's tokenId => that NFTs Champion.
    mapping(uint256 => Champion) public _nftHolderChampion;

    // We create a mapping from the nft's tokenId => that NFTs Champion.
    mapping(address => uint256) public _selectedChampion;

    // The mapping for champions to their users.
    mapping(address => uint256[]) private _userRoster;

    event ChampionAddedToRoster(address userToNotify, uint256 tokenId, uint256 championIndex);
    event ChampionSelected(address userToNotify, uint256 tokenId);

    constructor() ERC721("MMO on blockchain", "MMB") {
        // start with 1 for easier work with arrays.
        _tokenIds.increment();
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

        assert(userRoster.length != 0);

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
}
