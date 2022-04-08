import React, { useEffect } from "react";
import { useAtom } from "jotai";

import sword from "../assets/icons/sword.png";
import health from "../assets/icons/health.png";
import healPower from "../assets/icons/healPower.png";
import LoadingIndicator from "../components/LoadingIndicator";
import {
  characterListAtom,
  mintCharacterNFTAtom,
  mintingCharacterAtom,
  getCharacterListAtom,
} from "../state/characterList";

export default function CharacterList() {
  const [characters] = useAtom(characterListAtom);
  const [mintingCharacter] = useAtom(mintingCharacterAtom);
  const [, getCharacterList] = useAtom(getCharacterListAtom);
  const [, mintCharacterNFT] = useAtom(mintCharacterNFTAtom);

  useEffect(() => {
    getCharacterList();
  }, [getCharacterList]);

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
          onClick={() => mintCharacterNFT(index)}
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
