import { Select } from './Select'
import { useRecoilState } from "recoil";
import { all, adjective } from '../data/listOptions'
import { BaseTypeState, BaseAdjState, BaseCountState } from "../state/recoil_state"

export const BaseSelector = () => {
  const [Type, setType] = useRecoilState(BaseTypeState)
  const [Adj, setAdj] = useRecoilState(BaseAdjState)
  const [Count, setCount] = useRecoilState(BaseCountState)

   return (
    <>
      <div>
        <label htmlFor="num">Number of Items:</label>
        <input id="num" name="num" value={Count} onChange={(e) => setCount(Number(e.target.value))}/>
      </div>

      <Select name='typ' label='Select Type:' value={Type} list={all} onSetSelected={(i) => setType(i)} />
      <Select name='adj' label='Adjective Type' value={Adj} list={adjective} onSetSelected={(i) => setAdj(i)} />
      
      {/* <div style={{visibility: 'hidden'}}>
        <p className="hint1">Select the Number of items and the Type of items you would like, then click <strong>Submit</strong>.</p>

        <p className="hint2">Now click the checkbox of any items would would like to keep in the list, <br/>and click <strong>Submit</strong> button to replace unwanted list items.</p>
      </div> */}
    </>
  )
}