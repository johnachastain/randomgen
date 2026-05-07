import { Select } from '../components/Select'
import { useRecoilState } from "recoil";
import { adjectiveTuple, allTuple } from '../components/listOptions'
import { BaseTypeState, BaseAdjState, BaseCountState } from "../state/recoil_state"

export const BaseSelector = () => {
  const [Type, setType] = useRecoilState(BaseTypeState)
  const [Adj, setAdj] = useRecoilState(BaseAdjState)
  const [Count, setCount] = useRecoilState(BaseCountState)

  return (
    <>
      <div>
        <label htmlFor="num">Number of Items:</label>
        <input id="num" name="num" value={Count} onChange={(e) => setCount(Number(e.target.value))} />
      </div>

      <Select name='typ' label='Select Type:' value={Type} list={allTuple} onSetSelected={(i) => setType(i)} />
      <Select name='adj' label='Adjective Type' value={Adj} list={adjectiveTuple} onSetSelected={(i) => setAdj(i)} />
    </>
  )
}
