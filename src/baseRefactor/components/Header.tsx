
import { useRecoilState } from "recoil"
import { BaseListState, BaseTypeState } from "../state/recoil_state"

export const Header = () => {
  const [, setList] = useRecoilState(BaseListState)
  const [, setType] = useRecoilState(BaseTypeState)

  const select = (list: string, type: string) => {
    setList(list)
    setType(type)
  }

  return (
    <header>
      <nav>
        <ul id="nav">
          <li><button onClick={() => select('wilderness', 'natural')}>Wilderness</button></li>
          <li><button onClick={() => select('dungeon',    'dungeon_room')}>Dungeons</button></li>
          <li><button onClick={() => select('city',       'construction')}>Cities/Towns</button></li>
          <li><button onClick={() => select('deity',      'deity')}>Deities/Demigods</button></li>
        </ul>
      </nav>
    </header>
  )
}
