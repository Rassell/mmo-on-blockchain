import { atom } from "jotai";

import { ContractAtom } from "./wallet";

export const loadingAttackAtom = atom<boolean>(false);
export const loadingHealAtom = atom<boolean>(false);

export const receiverBattleAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (contract) {
    contract.on("AttackComplete", (bossHealth: number) => {
      console.log("Receiver: Attack Complete!", bossHealth);
    });
    contract.on("HealComplete", (championHealth: number) => {
      console.log("Receiver: Heal Complete!", championHealth);
    });
    contract.on("BossAttackComplete", (tokenId: number, championHealth: number) => {
      console.log("Receiver: Boss Attack Complete!", tokenId, championHealth);
    });
  }
});

export const attackAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (contract) {
    set(loadingAttackAtom, true);
    await contract.attack();
    set(loadingAttackAtom, false);
  }
});

export const healAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (contract) {
    set(loadingHealAtom, true);
    await contract.heal();
    set(loadingHealAtom, false);
  }
});
