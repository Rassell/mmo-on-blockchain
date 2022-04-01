import React, { useEffect, useState } from "react";

import { useWallet } from "../hooks/useWallet";
import { Champion } from "../Models";
import sword from "../assets/icons/sword.png";
import health from "../assets/icons/health.png";
import healPower from "../assets/icons/healPower.png";
import { transformCharacterData } from "../Common";
import LoadingIndicator from "../components/LoadingIndicator";

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
export default function CharacterList() {
  const { contract } = useWallet();
  const [characters, setCharacters] = useState<Champion[]>([]);
  const [mintingCharacter, setMintingCharacter] = useState(false);

  useEffect(() => {
    const getCharacters = async () => {
      if (!contract) return;

      try {
        console.log("Getting contract characters to mint");

        const charactersTxn = await contract.getChampionList();
        console.log("charactersTxn:", charactersTxn);

        const characters = charactersTxn.map((characterData: any) =>
          transformCharacterData(characterData)
        );

        setCharacters(characters);
      } catch (error) {
        console.error("Something went wrong fetching characters:", error);
      }
    };

    /*
     * Add a callback method that will fire when this event is received
     */
    const onCharacterMint = async (
      sender: any,
      tokenId: any,
      characterIndex: any
    ) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );

      /*
       * Once our character NFT is minted we can fetch the metadata from our contract
       * and set it in state to move onto the Arena
       */
      if (contract) {
        const characterNFT = await contract.checkIfUserHasNFT();
        console.log("CharacterNFT: ", characterNFT);
        //TODO: redirect to roster
        //TODO: Alert user that they have a character
      }
    };

    if (contract) {
      getCharacters();

      /*
       * Setup NFT Minted Listener
       */
      contract.on("ChampionAddedToRoster", onCharacterMint);
    }

    return () => {
      /*
       * When your component unmounts, let;s make sure to clean up this listener
       */
      if (contract) {
        contract.off("ChampionAddedToRoster", onCharacterMint);
      }
    };
  }, [contract]);

  // Actions
  const mintCharacterNFTAction = async (characterId: any) => {
    try {
      setMintingCharacter(true);
      if (contract) {
        console.log("Minting character in progress...");
        const mintTxn = await contract.addChampionToRoster(characterId);
        await mintTxn.wait();
        console.log("mintTxn:", mintTxn);
      }
    } catch (error) {
      console.warn("MintCharacterAction Error:", error);
    } finally {
      setMintingCharacter(false);
    }
  };

  const renderCharacters = () =>
    characters.map((character, index) => (
      <div
        className="p-2 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 flex-col text-black gap-5"
        key={`character_${character.name}_${index}`}
      >
        <div>
          <p>{character.name}</p>
        </div>
        <img
          src={character.gifUris.idle}
          alt={character.name}
          className="w-52 h-52"
        />
        <div className="flex justify-center gap-10 text-white">
          <div className="bg-cyan-600 p-3 rounded">
            <img alt="health_icon" src={health} className="w-7 h-7 mb-3" />
            <p>{character.maxHealth}</p>
          </div>
          <div className="bg-red-400 p-3 rounded">
            <img alt="sword_icon" src={sword} className="w-7 h-7 mb-3" />
            <p>{character.attackPower}</p>
          </div>
          <div className="bg-green-400 p-3 rounded">
            <img alt="heal_icon" src={healPower} className="w-7 h-7 mb-3" />
            <p>{character.healPower}</p>
          </div>
        </div>
        <button
          type="button"
          disabled={mintingCharacter}
          className="hover:cursor-pointer bg-gray-500 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => mintCharacterNFTAction(index)}
        >{`Mint ${character.name}`}</button>
      </div>
    ));

  return (
    <div className="flex flex-col gap-5">
      <h2>Add Champion to roster</h2>
      {/* Only show this when there are characters in state */}
      {characters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
      {mintingCharacter && (
        <div>
          <LoadingIndicator />
          <p>Minting In Progress...</p>
        </div>
      )}
    </div>
  );
}
