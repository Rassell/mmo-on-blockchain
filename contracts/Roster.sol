// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import "./ChampionFactory.sol";
import "./Shared.sol";

contract Roster is ERC721, ChampionFactory {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // The mapping for champions to their users.
    mapping(address => uint256[]) private _userRoster;

    // We create a mapping from the nft's tokenId => that NFTs Champion.
    mapping(address => uint256) public SelectedChampion;

    // Mapping from the nft's tokenId => that NFTs Champion.
    mapping(uint256 => Champion) public NftHolderChampion;

    event ChampionAddedToRoster(
        address userToNotify,
        uint256 tokenId,
        uint256 championIndex
    );

    event ChampionSelected(address userToNotify, uint256 tokenId);

    constructor() ERC721("MMO on blockchain", "MMB") {
        // start with 1 for easier work with arrays.
        _tokenIds.increment();
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

        // TODO: recieve this from separate contract
        NftHolderChampion[newRecordId] = Champions[_championIndex];

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

        SelectedChampion[msg.sender] = tokenId;

        emit ChampionSelected(msg.sender, tokenId);
    }

    /*
     * @dev Function to get selected champion
     */
    function getSelectedChampion() public view returns (uint256) {
        return SelectedChampion[msg.sender];
    }
}
