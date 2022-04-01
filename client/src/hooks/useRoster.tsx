import { BigNumber } from "ethers";
import { useEffect, useState } from "react";

import { MMOCharacterData, transformCharacterData } from "../Common";
import { useWallet } from "./useWallet";

export default function useRoster() {
  const { contract, currentAccount } = useWallet();
  const [roster, setRoster] = useState<MMOCharacterData[]>([]);
  const [selectedChampionId, setSelectedChampionId] = useState<number>(-1);

  async function selectChampion(index: number) {
    console.log("Selecting champion:", index);
    if (!contract || !currentAccount) return;

    await contract.setSelectChampion(index);
    console.log("Success champion selected:", roster[index]);
  }

  useEffect(() => {
    async function initRoster() {
      if (!contract || !currentAccount) return;
      const roster = await contract.getUserRoster();
      console.log("Roster:", roster);
      const championId: BigNumber = await contract.getSelectedChampion();
      console.log("Selected Champion index:", championId.toNumber() - 1);
      setSelectedChampionId(championId.toNumber() - 1);
      const championDataPromises = await Promise.allSettled(
        roster.map(
          async (rosterId: BigNumber) => await contract.getNFTChampion(rosterId)
        )
      );
      setRoster(
        championDataPromises.map((rp: any) => transformCharacterData(rp.value))
      );
    }

    initRoster();
  }, [contract, currentAccount]);

  return {
    roster,
    selectedChampionId,
    championSelected:
      selectedChampionId > -1 ? roster[selectedChampionId] : null,
    selectChampion,
  };
}
