import { BigNumber } from "ethers";
import { atom } from "jotai";

import { ContractAtom } from "./wallet";

export const loadingAttackAtom = atom<boolean>(false);
export const loadingHealAtom = atom<boolean>(false);

export const receiverBattleAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (contract) {
    contract.on("AttackComplete", (bossHealth: BigNumber) => {
      const bossHealthNumber = bossHealth.toNumber();
      console.log("Receiver: Attack Complete!", bossHealthNumber);
      // set(arenaBossAtom, {
      //   ...get(arenaBossAtom),
      //   health: bossHealthNumber,
      // });
    });
    contract.on(
      "HealComplete",
      (championTokenId: BigNumber, championHealth: BigNumber) => {
        const championHealthNumber = championHealth.toNumber();
        console.log("Receiver: Heal Complete!", championHealthNumber);
      }
    );
    contract.on(
      "BossAttackComplete",
      (championTokenId: BigNumber, championHealth: BigNumber) => {
        const championTokenIdNumber = championTokenId.toNumber();
        const championHealthNumber = championHealth.toNumber();
        console.log(
          "Receiver: Boss Attack Complete!",
          championTokenIdNumber,
          championHealthNumber
        );
      }
    );
  }
});

export const attackAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  if (contract) {
    set(loadingAttackAtom, true);
    await contract.attack();
    set(loadingHealAtom, false);
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
