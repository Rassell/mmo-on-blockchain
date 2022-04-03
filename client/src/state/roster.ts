import { BigNumber } from "ethers";
import { atom } from "jotai";

import { MMOCharacterData, transformCharacterData } from "../Common";
import { AccountAtom, ContractAtom } from "./wallet";

export const RosterAtom = atom<MMOCharacterData[]>([]);
export const SelectedChampionIdAtom = atom<number>(-1);

export const selectChampionAtom = atom(null, async (get, set, index: number) => {
  console.log("Selecting champion:", index);
  const contract = get(ContractAtom);
  const currentAccount = get(AccountAtom);
  if (!contract || !currentAccount) return;

  const roster = get(RosterAtom);

  await contract.setSelectChampion(index);
  console.log("Success champion selected:", roster[index]);
});

export const initRosterAtom = atom(null, async (get, set) => {
  const contract = get(ContractAtom);
  const currentAccount = get(AccountAtom);
  if (!contract || !currentAccount) return;

  const roster = await contract.getUserRoster();
  console.log("Roster:", roster);

  const championId: BigNumber = await contract.getSelectedChampion();
  set(SelectedChampionIdAtom, championId.toNumber() - 1);
  console.log("Selected Champion index:", championId.toNumber() - 1);
  
  const championDataPromises = await Promise.allSettled(
    roster.map(
      async (rosterId: BigNumber) => await contract.getNFTChampion(rosterId)
    )
  );
  set(
    RosterAtom,
    championDataPromises.map((rp: any) => transformCharacterData(rp.value))
  );
});
