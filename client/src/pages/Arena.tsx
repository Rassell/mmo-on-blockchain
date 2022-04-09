import { useAtom } from "jotai";
import React, { useEffect } from "react";

import { ArenaState } from "../Models";
import {
  arenaBossAtom,
  arenaStateAtom,
  getArenaAtom,
  goToBattleAtom,
} from "../state/arena";
import { attackAtom, loadingAttackAtom } from "../state/battle";
import { SelectedChampionIdAtom } from "../state/roster";

export default function Arena() {
  const [, getArena] = useAtom(getArenaAtom);
  const [, goToBattle] = useAtom(goToBattleAtom);
  const [, attack] = useAtom(attackAtom);
  const [, loadingAttack] = useAtom(loadingAttackAtom);
  const [arenaState] = useAtom(arenaStateAtom);
  const [arenaBoss] = useAtom(arenaBossAtom);
  const [selectedChampionId] = useAtom(SelectedChampionIdAtom);

  useEffect(() => {
    getArena();
  }, [getArena]);

  return (
    <div>
      <h1>Arena</h1>
      <h2>State {ArenaState[arenaState]}</h2>
      {selectedChampionId > 0 && (
        <h2>Selected champion {selectedChampionId}</h2>
      )}
      {arenaBoss && (
        <div>
          <div>{arenaBoss.name}</div>
          <div>{arenaBoss.health}</div>
        </div>
      )}
      {selectedChampionId > 0 && (
        <>
          {arenaState === 0 && (
            <button onClick={goToBattle}>Go to battle!</button>
          )}
          {arenaState === 1 && <button onClick={attack}>Attack</button>}
        </>
      )}
    </div>
  );
}
