import React from "react";
import { useArena, useRoster } from "../hooks";

export default function Roster() {
  const { boss, goToBattle } = useArena();
  const { roster, selectedChampionId, selectChampion } = useRoster();

  return (
    <div>
      {roster.map((r, i) => (
        <div>
          <div>{r.name}</div>
          <div>{r.health}</div>
          <div>{r.maxHealth}</div>
          <div>{r.attackPower}</div>
          <div>{r.healPower}</div>
          {i !== selectedChampionId && (
            <button onClick={() => selectChampion(i)}>Select champion</button>
          )}
          {i === selectedChampionId && (
            <button onClick={goToBattle}>Go to battle!</button>
          )}
        </div>
      ))}
    </div>
  );
}
