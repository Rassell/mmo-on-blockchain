// SPDX-License-Identifier: GNU
pragma solidity ^0.8.1;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "hardhat/console.sol";

import "./ChampionFactory.sol";
import "./Shared.sol";

contract Roster is ERC721, Ownable {
    // Magic given to us by OpenZeppelin to help us keep track of tokenIds.
    using Counters for Counters.Counter;

    ChampionFactory private _championFactory;
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

    /*
     * @dev Function to set Champion Factory
     */
    function setChampionFactory(address championFactoryAddress) public onlyOwner {
        _championFactory = ChampionFactory(championFactoryAddress);
    }

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
     * @dev Function to return the roster of the user.
     */
    function getNFTChampion(uint256 recordId)
        public
        view
        returns (Champion memory)
    {
        return NftHolderChampion[recordId];
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

        Champion[] memory champions = _championFactory.getChampionList();

        // TODO: recieve this from separate contract
        NftHolderChampion[newRecordId] = Champion({
            name: champions[_championIndex].name,
            health: champions[_championIndex].health,
            maxHealth: champions[_championIndex].maxHealth,
            attackPower: champions[_championIndex].attackPower,
            healPower: champions[_championIndex].healPower,
            gifUris: champions[_championIndex].gifUris
        });

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

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        Champion storage championAttr = NftHolderChampion[_tokenId];

        string memory strHp = Strings.toString(championAttr.health);
        string memory strMaxHp = Strings.toString(championAttr.maxHealth);
        string memory strAttackDamage = Strings.toString(
            championAttr.attackPower
        );

        string memory json = Base64.encode(
            abi.encodePacked(
                '{"name": "',
                championAttr.name,
                " -- NFT #: ",
                Strings.toString(_tokenId),
                '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
                championAttr.gifUris.idle,
                '", "attributes": [ { "trait_type": "Health Points", "value": ',
                strHp,
                ', "max_value":',
                strMaxHp,
                '}, { "trait_type": "Attack Damage", "value": ',
                strAttackDamage,
                "} ]}"
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        return output;
    }
}
