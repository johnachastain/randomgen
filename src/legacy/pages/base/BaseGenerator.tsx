import { SyntaxMap } from "../../state/recoil_state";
import { ListItem } from "../../components/ListItem";
import { useBaseHook } from './useBaseHook';

export type SelectProps = { name: string }

export const BaseGenerator = ({name}: SelectProps) => {
  const {
    List, 
    Type,
    Adj,
    Count,
    Output, 
  } = useBaseHook()

  return (
    <div>
      <h3>{`Generator: ${name}`}</h3>
      {List}/{Type}/{Adj}/{Count}
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