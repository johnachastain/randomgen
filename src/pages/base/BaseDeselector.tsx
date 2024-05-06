
import { useCallback } from 'react';
import { useRecoilState } from "recoil";
import { BaseOutputState } from "../../state/recoil_state";

export const BaseDeselector = () => {
  const [Output, setOutput] = useRecoilState(BaseOutputState)

  const onBulkSelect = useCallback((bool: boolean) => {
    const updates = Output.map((i) => {
      return { ...i, checked: bool}
    })
    setOutput(updates)
  }, [Output]);

  const onBulkDelete = useCallback((bool: boolean) => {
    const updates = Output.filter((i) => i.checked === bool)
    setOutput(updates)
  }, [Output]);

   return (
    <nav>
      <ul>
        <li><button onClick={() => onBulkDelete(true)}>Delete All Unchecked</button></li>
        <li><button onClick={() => onBulkDelete(false)}>Delete All Checked</button></li>
        <li><button onClick={() => onBulkSelect(false)}>Deselect All</button></li>
        <li><button onClick={() => onBulkSelect(true)}>Select All</button></li>
      </ul>
    </nav>
  )
}