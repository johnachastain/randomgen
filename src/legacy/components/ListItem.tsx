import { useState, useCallback } from 'react'
import { useRecoilState } from "recoil";
import {BaseOutputState, SyntaxMap } from "../state/recoil_state";

export type ListItemProps = {
  item: SyntaxMap
}

export const ListItem = ({item}: ListItemProps) => {
  const { name, key, checked } = item
  const [editMode, setEditMode] = useState(false)
  const [editText, setEditText] = useState(name)
  const [Output, setOutput] = useRecoilState(BaseOutputState)

  const onChecked = useCallback((s:SyntaxMap) => {
    const updates = Output.map((i) => i.key === s.key ? s : i)
    setOutput(updates)
  }, [Output]);

  const onEdit = useCallback((s:SyntaxMap) => {
    const updates = Output.map((i) => i.key === s.key ? s : i)
    setOutput(updates)
  }, [Output]);

  return (
    <li>
      <input name={`itm${key}`} type="checkbox" checked={checked} 
        onChange={() => {
          const update = { ...item, checked: !checked}
          onChecked(update)
          }} />
      {!editMode ? 
        <button onClick={() => setEditMode(true)}>
          {name}
        </button> :
        <span>
          <input type="text" value={editText} 
            onChange={(e) => setEditText(e.target.value)} />
          <button onClick={() => {
            const update = { ...item, name: editText}
            onEdit(update)
            setEditMode(false)}}>Save</button>
        </span>
      }
    </li>
  )
}