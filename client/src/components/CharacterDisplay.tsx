import React, { ReactNode } from "react";

import { sword, health, healPower } from "../assets/icons";
import { Champion } from "../Models";

interface IProps {
  champion: Champion;
  bottom?: ReactNode;
}

export default function RenderChampion({ champion, bottom }: IProps) {
  return (
    <div className="p-2 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4 flex-col text-black gap-5">
      <div>
        <p>{champion.name}</p>
      </div>
      <img
        src={champion.gifUris.idle}
        alt={champion.name}
        className="w-52 h-52"
      />
      <div className="flex justify-center gap-10 text-white">
        <div className="bg-cyan-600 p-3 rounded">
          <img alt="health_icon" src={health} className="w-7 h-7 mb-3" />
          <p>{champion.maxHealth}</p>
        </div>
        <div className="bg-red-400 p-3 rounded">
          <img alt="sword_icon" src={sword} className="w-7 h-7 mb-3" />
          <p>{champion.attackPower}</p>
        </div>
        <div className="bg-green-400 p-3 rounded">
          <img alt="heal_icon" src={healPower} className="w-7 h-7 mb-3" />
          <p>{champion.healPower}</p>
        </div>
      </div>
      {bottom}
    </div>
  );
}
