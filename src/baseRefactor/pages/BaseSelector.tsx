import { Select } from '../components/Select'
import { useRecoilState, useRecoilValue } from "recoil"
import {
  naturalTuple, constructionTuple, dungeonTuple, deitiesTuple, allTuple, adjectiveTuple
} from '../components/listOptions'
import { BaseTypeState, BaseAdjState, BaseCountState, BaseListState } from "../state/recoil_state"

export const BaseSelector = () => {
  const List  = useRecoilValue(BaseListState)
  const [Type,  setType]  = useRecoilState(BaseTypeState)
  const [Adj,   setAdj]   = useRecoilState(BaseAdjState)
  const [Count, setCount] = useRecoilState(BaseCountState)

  const typeOptions =
    List === 'wilderness' ? naturalTuple      :
    List === 'dungeon'    ? dungeonTuple      :
    List === 'city'       ? constructionTuple :
    List === 'deity'      ? deitiesTuple      :
    allTuple

  return (
    <>
      <div>
        <label htmlFor="num">Number of Items:</label>
        <input id="num" name="num" value={Count} onChange={(e) => setCount(Number(e.target.value))} />
      </div>

      <Select name='typ' label='Select Type:' value={Type} list={typeOptions} onSetSelected={(i) => setType(i)} />
      <Select name='adj' label='Adjective Type' value={Adj} list={adjectiveTuple} onSetSelected={(i) => setAdj(i)} />
    </>
  )
}
