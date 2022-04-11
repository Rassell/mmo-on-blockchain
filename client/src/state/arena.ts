import { BigNumber } from "ethers";
import { atom } from "jotai";

import { MMOCharacterData, transformCharacterData } from "../Common";
import { ArenaState } from "../Models";
import { ContractAtom } from "./wallet";

export const arenaStateAtom = atom<{
  state: ArenaState;
  boss: MMOCharacterData | null;
}>({ state: ArenaState.NotStarted, boss: null });
export const arenaChampionIdList = atom<number[]>([]);

export const receiverArenaStateAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (contract) {
    contract.on("ArenaStarted", async (bossIndex: BigNumber) => {
      console.log("Receiver: Arena started!", bossIndex.toNumber());
    });
    contract.on("ArenaFinished", () => {
      console.log("Receiver: Arena finished!");
      set(arenaStateAtom, {
        ...get(arenaStateAtom),
        state: ArenaState.Finished,
        boss: null,
      });
    });
  }
});

export const getArenaAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (!contract) return;

  const arenaState = await contract.getArena();
  set(arenaStateAtom, {
    state: arenaState[2],
    boss: transformCharacterData(arenaState[1]),
  });
});

export const goToBattleAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (!contract) return;

  await contract.addChampionToArena();
});
