import { BigNumber } from "ethers";
import { atom } from "jotai";

import { MMOCharacterData, transformCharacterData } from "../Common";
import { AccountAtom, RosterContractAtom } from "./wallet";

export const RosterAtom = atom<MMOCharacterData[]>([]);
export const SelectedChampionIdAtom = atom<number>(-1);

export const selectChampionAtom = atom(
  null,
  async (get, set, rosterId: number) => {
    console.log("Selecting champion:", rosterId);
    const contract = get(RosterContractAtom);
    const currentAccount = get(AccountAtom);
    if (!contract || !currentAccount) return;

    const txn = await contract.setSelectChampion(rosterId, {
      gasLimit: 300000,
    });

    console.log("Mining...", txn.hash);
    await txn.wait();
    console.log("Mined -- ", txn.hash);

    console.log("Success champion selected:", rosterId);
  }
);

export const initRosterAtom = atom(null, async (get, set) => {
  const contract = get(RosterContractAtom);
  const currentAccount = get(AccountAtom);
  if (!contract || !currentAccount) return;

  const roster = await contract.getUserRoster();
  console.log("Roster:", roster);

  const championId: BigNumber = await contract.getSelectedChampion(
    currentAccount
  );
  set(SelectedChampionIdAtom, championId.toNumber());
  console.log("Selected Champion id:", championId.toNumber());

  const championDataPromises = await Promise.allSettled(
    roster.map(async (rosterId: BigNumber) => ({
      ...(await contract.getNFTChampion(rosterId)),
      rosterId: rosterId.toNumber(),
    }))
  );
  set(
    RosterAtom,
    championDataPromises.map((rp: any) => transformCharacterData(rp.value))
  );
});
