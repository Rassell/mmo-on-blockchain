import { useCallback, useEffect, useState } from "react";

import { MMOCharacterData, transformCharacterData } from "../Common";
import { useWallet } from "./useWallet";

export default function useArena() {
  const { contract } = useWallet();
  const [arenaState, setArenaState] = useState();
  const [boss, setBoss] = useState<MMOCharacterData | null>();

  const getActualBoss = useCallback(async () => {
    if (contract) {
      const arenaBoss = await contract.getArenaBoss();
      setBoss(transformCharacterData(arenaBoss));
    }
  }, [contract]);

  async function goToBattle() {
    console.log("Going to battle!");
    if (contract) {
      await contract.addChampionToArena();
    }
  }

  useEffect(() => {
    if (contract) {
      contract.on("ArenaStarted", getActualBoss);
    }

    getActualBoss();

    return () => {
      if (contract) {
        contract.off("ArenaStarted", getActualBoss);
      }
    };
  }, [contract, getActualBoss]);

  return {
    boss,
    goToBattle,
  };
}
