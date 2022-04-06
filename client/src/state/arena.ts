import { atom } from "jotai";
import { MMOCharacterData, transformCharacterData } from "../Common";

import { ContractAtom } from "./wallet";

export const arenaStateAtom = atom("");
export const arenaBossAtom = atom<MMOCharacterData | null>(null);

export const getArenaAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (!contract) return;

  const arenaState = await contract.getArenaState();
  set(arenaStateAtom, arenaState);
  const currentBoss = await contract.getArenaBoss();
  set(arenaBossAtom, transformCharacterData(currentBoss));
});

export const goToBattleAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (!contract) return;

  await contract.addChampionToArena();
});
