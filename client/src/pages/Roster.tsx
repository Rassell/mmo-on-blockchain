import React, { useEffect } from "react";
import { useAtom } from "jotai";

import {
  initRosterAtom,
  RosterAtom,
  selectChampionAtom,
  SelectedChampionIdAtom,
} from "../state/roster";
import RenderChampion from "../components/CharacterDisplay";

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
      {roster.map((character, index) => (
        <RenderChampion
          key={`roster_${character.name}_${index}`}
          champion={character}
          bottom={
            character.rosterId !== selectedChampionId && (
              <button onClick={() => selectChampion(character.rosterId)}>
                Select champion
              </button>
            )
          }
        />
      ))}
    </div>
  );
}
