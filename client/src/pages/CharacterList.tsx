import React, { useEffect } from "react";
import { useAtom } from "jotai";

import LoadingIndicator from "../components/LoadingIndicator";
import {
  characterListAtom,
  mintCharacterNFTAtom,
  mintingCharacterAtom,
  getCharacterListAtom,
} from "../state/characterList";
import RenderChampion from "../components/CharacterDisplay";

export default function CharacterList() {
  const [characters] = useAtom(characterListAtom);
  const [mintingCharacter] = useAtom(mintingCharacterAtom);
  const [, getCharacterList] = useAtom(getCharacterListAtom);
  const [, mintCharacterNFT] = useAtom(mintCharacterNFTAtom);

  useEffect(() => {
    getCharacterList();
  }, [getCharacterList]);

  function renderCharacters() {
    return (
      <div className="">
        {characters.map((character, index) => (
          <RenderChampion
            key={`character_${character.name}_${index}`}
            champion={character}
            bottom={
              <button
                type="button"
                disabled={mintingCharacter}
                className="hover:cursor-pointer bg-gray-500 text-white font-bold py-2 px-4 rounded-full"
                onClick={() => mintCharacterNFT(index)}
              >{`Mint ${character.name}`}</button>
            }
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h2>Add Champion to roster</h2>
      {/* Only show this when there are characters in state */}
      {!mintingCharacter && characters.length > 0 && renderCharacters()}
      {mintingCharacter && (
        <div>
          <LoadingIndicator />
          <p>Minting In Progress...</p>
        </div>
      )}
    </div>
  );
}
