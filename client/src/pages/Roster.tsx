import React, { useEffect } from "react";
import { useAtom } from "jotai";

import {
  initRosterAtom,
  RosterAtom,
  selectChampionAtom,
  SelectedChampionIdAtom,
} from "../state/roster";
import { goToBattleAtom } from "../state/arena";

export default function Roster() {
  const [roster] = useAtom(RosterAtom);
  const [selectedChampionId] = useAtom(SelectedChampionIdAtom);
  const [, initRoster] = useAtom(initRosterAtom);
  const [, selectChampion] = useAtom(selectChampionAtom);

  useEffect(() => {
    initRoster();
  }, [initRoster]);

  return (
    <div>
      {roster.map((r, i) => (
        <div key={`roster_i_${i}`}>
          <div>{r.name}</div>
          <div>{r.health}</div>
          <div>{r.maxHealth}</div>
          <div>{r.attackPower}</div>
          <div>{r.healPower}</div>
          {i !== selectedChampionId && (
            <button onClick={() => selectChampion(i)}>Select champion</button>
          )}
        </div>
      ))}
    </div>
  );
}
