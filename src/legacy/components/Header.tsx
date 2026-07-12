
// import React from "react";
import { useRecoilState } from "recoil";
import { BaseListState } from "../state/recoil_state";

export const Header = () => {   
  const [List, setList] = useRecoilState(BaseListState);

  return (
    <header>
      <nav>
        <ul id="nav">
          <li><button onClick={() => setList('wilderness')}>Wilderness</button></li>
          <li><button onClick={() => setList('dungeon')}>Dungeons</button></li>
          <li><button onClick={() => setList('city')}>Cities/Towns</button></li>
          <li><button onClick={() => setList('deity')}>Deities/Demigods</button></li>
        </ul>
      </nav>
    </header>
  )
}