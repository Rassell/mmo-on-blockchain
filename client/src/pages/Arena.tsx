import { useAtom } from "jotai";
import React, { useEffect } from "react";

import { ArenaState } from "../Models";
import { arenaStateAtom, getArenaAtom, goToBattleAtom } from "../state/arena";
import { attackAtom, loadingAttackAtom } from "../state/battle";
import { SelectedChampionIdAtom } from "../state/roster";

export default function Arena() {
  const [, getArena] = useAtom(getArenaAtom);
  const [, goToBattle] = useAtom(goToBattleAtom);
  const [, attack] = useAtom(attackAtom);
  const [, loadingAttack] = useAtom(loadingAttackAtom);
  const [arenaState] = useAtom(arenaStateAtom);
  const [selectedChampionId] = useAtom(SelectedChampionIdAtom);

  const { boss, state } = arenaState;

  useEffect(() => {
    getArena();
  }, [getArena]);

  return (
    <div>
      <h1>Arena</h1>
      <h2>State {ArenaState[state]}</h2>
      {selectedChampionId > 0 && (
        <h2>Selected champion {selectedChampionId}</h2>
      )}
      {state === 1 && boss && (
        <div>
          <div>{boss.name}</div>
          <div>{boss.health}</div>
        </div>
      )}
      {selectedChampionId > 0 && (
        <>
          {state === 0 && <button onClick={goToBattle}>Go to battle!</button>}
          {state === 1 && <button onClick={attack}>Attack</button>}
        </>
      )}
    </div>
  );
}
