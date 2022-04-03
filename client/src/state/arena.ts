import { atom } from "jotai";
import { ContractAtom } from "./wallet";

export const goToBattleAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (!contract) return;

  await contract.addChampionToArena();
});
