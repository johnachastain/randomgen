import { useRecoilState, useRecoilValue } from "recoil"
import { BaseAdjState, BaseCountState, BaseListState, BaseOutputState, BaseTypeState, SyntaxMap } from "../../state/recoil_state"
import { useEffect, useMemo } from "react"

import { getSyntaxList } from "../../functions/functions"

export interface BaseHook {
    List: string
    Type: string
    Adj: string
    Count: number
    Output: SyntaxMap[] 
    setOutput: (itm: SyntaxMap[]) =>void
    syntaxMemo: SyntaxMap[]
}

export const useBaseHook = (): BaseHook => {
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
  

  return {
    List, 
    Type,
    Adj,
    Count,
    Output, 
    setOutput,
    syntaxMemo
  }
}