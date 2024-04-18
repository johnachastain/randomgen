import { useMemo, useEffect } from 'react';
import { useRecoilValue, useRecoilState } from "recoil";
import { BaseListState, BaseTypeState, BaseAdjState, BaseCountState, BaseOutputState, SyntaxMap } from "../state/recoil_state";
import { getSyntaxList } from '../legacy/functions'
import { ListItem } from "./ListItem";

export type SelectProps = {
  name: string
}


export const GeomorphGenerator = ({name}: SelectProps) => {
  const List = useRecoilValue(BaseListState);
  const Type = useRecoilValue(BaseTypeState);
  const Adj = useRecoilValue(BaseAdjState);
  const Count = useRecoilValue(BaseCountState);
  const [Output, setOutput] = useRecoilState(BaseOutputState)
  
  // const syntaxList: string[] =  getSyntaxList(Count, Type, Adj)
  const syntaxMemo: SyntaxMap[] = useMemo(
    () => {
      const syntaxList: string[] =  getSyntaxList(Count, Type, Adj)
      return syntaxList.map((n,i) => {
        return {
          name: n,
          key: i,
          checked: false
        }
      })
    },
    [Count, Type, Adj]
  );

  useEffect(() => {
    setOutput(syntaxMemo)
  }, [syntaxMemo]);

  return (
    <div>
      <h3>{`Geomorphs: ${name}`}</h3>
      <ol>
        {Output.map(
          (i:SyntaxMap) => <ListItem 
            key={i.key} 
            item={i} />
        )}
      </ol>
    </div>
  )
}