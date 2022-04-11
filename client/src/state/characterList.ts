import { atom } from "jotai";
import { transformCharacterData } from "../Common";

import { Champion } from "../Models";
import { ChampionFactoryContractAtom, RosterContractAtom } from "./wallet";

export const characterListAtom = atom<Champion[]>([]);
export const mintingCharacterAtom = atom<boolean>(false);

export const mintCharacterNFTAtom = atom(null, async (get, set, update) => {
  const contract = get(RosterContractAtom);
  try {
    set(mintingCharacterAtom, true);
    if (contract) {
      console.log("Minting character in progress...");
      const txn = await contract.addChampionToRoster(update);
      console.log("Mining...", txn.hash);
      await txn.wait();
      console.log("Mined -- ", txn.hash);
    }
  } catch (error) {
    console.warn("MintCharacterAction Error:", error);
  } finally {
    set(mintingCharacterAtom, false);
  }
});

export const getCharacterListAtom = atom(null, async (get, set) => {
  const contract = get(ChampionFactoryContractAtom);
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
