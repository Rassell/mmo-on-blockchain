import { useAtom } from "jotai";
import React, { useEffect } from "react";

import { arenaBossAtom, arenaStateAtom, getArenaAtom } from "../state/arena";
import { SelectedChampionIdAtom } from "../state/roster";

export default function Arena() {
  const [, getArena] = useAtom(getArenaAtom);
  const [arenaState] = useAtom(arenaStateAtom);
  const [arenaBoss] = useAtom(arenaBossAtom);
  const [selectedChampionId] = useAtom(SelectedChampionIdAtom);

  useEffect(() => {
    getArena();
  }, [getArena]);

  return (
    <div>
      <h1>Arena</h1>
      <h2>State {arenaState}</h2>
      {selectedChampionId > 0 && (
        <h2>Selected champion {selectedChampionId}</h2>
      )}
      {arenaBoss && (
        <div>
          <div>{arenaBoss.name}</div>
          <div>{arenaBoss.health}</div>
        </div>
      )}
    </div>
  );
}
