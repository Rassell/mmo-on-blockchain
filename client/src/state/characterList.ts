import { atom } from "jotai";
import { transformCharacterData } from "../Common";

import { Champion } from "../Models";
import { RosterAtom } from "./roster";
import { ContractAtom } from "./wallet";

export const characterListAtom = atom<Champion[]>([]);
export const mintingCharacterAtom = atom<boolean>(false);

export const receiverChampionAddedAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (contract) {
    contract.on(
      "ChampionAddedToRoster",
      async (sender: string, newRecordId, championIndex) => {
        console.log(
          "ChampionAddedToRoster",
          sender,
          newRecordId,
          championIndex
        );
        if (sender !== contract.address) return;
        const characterList = get(characterListAtom);
        set(RosterAtom, [...get(RosterAtom), characterList[championIndex]]);
      }
    );
  }
});

export const mintCharacterNFTAtom = atom(null, async (get, set, update) => {
  const contract = get(ContractAtom);
  try {
    set(mintingCharacterAtom, true);
    if (contract) {
      console.log("Minting character in progress...");
      const mintTxn = await contract.addChampionToRoster(update);
      await mintTxn.wait();
      console.log("mintTxn:", mintTxn);
    }
  } catch (error) {
    console.warn("MintCharacterAction Error:", error);
  } finally {
    set(mintingCharacterAtom, false);
  }
});

export const getCharacterListAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (!contract) return;

  try {
    console.log("Getting contract characters to mint");

    const charactersTxn = await contract.getChampionList();
    console.log("charactersTxn:", charactersTxn);

    const characters = charactersTxn.map((characterData: any) =>
      transformCharacterData(characterData)
    );

    set(characterListAtom, characters);
  } catch (error) {
    console.error("Something went wrong fetching characters:", error);
  }
});