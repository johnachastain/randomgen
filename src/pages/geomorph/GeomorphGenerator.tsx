import { useMemo, useState, useCallback, useEffect } from 'react';
import { getNewGrid } from '../../geomorph/geomorphs';
import { GridItem } from '../../geomorph/Geomorph';
import { MapItem } from './MapItem';
import { useRecoilState } from "recoil";
import { MapGridState, MapRowsState, MapColumnsState } from "../../state/recoil_state";

export type SelectProps = {
  name: string
}

export const GeomorphGenerator = ({name}: SelectProps) => {
  const [mapGrid, setMapGrid] = useRecoilState(MapGridState)
  const [rows, setRows] = useRecoilState(MapRowsState)
  const [columns, setColumns] = useRecoilState(MapColumnsState)
  
  const [editModeItem, setEditModeItem] =useState<number>()

  const gridMemo: GridItem[] = useMemo(
    () => getNewGrid(columns, rows),
    [rows, columns]
  );

  useEffect(() => {
    setMapGrid(gridMemo)
  }, [gridMemo]);

  const onSetEditModeItem = useCallback((i: number) => {
    setEditModeItem(i !== editModeItem ? i : undefined)
  }, [editModeItem, setEditModeItem]);

  return (
    <div>
      <h3>{`Geomorphs: ${name}`}</h3>
      <div>
        <label htmlFor="rows">Number of Rows:</label>
        <input id="rows" name="rows" value={rows} 
          onChange={(e) => setRows(Number(e.target.value))}/>
      </div>
      <div>
        <label htmlFor="rows">Number of Columns:</label>
        <input id="rows" name="columns" value={columns} 
          onChange={(e) => setColumns(Number(e.target.value))}/>
      </div>

        <div style={{ display: 'grid' }}>
          {mapGrid.map(
            (g, i) => (
            <MapItem
              key={i} 
              gridItem={g}
              onSetEditModeItem={() => onSetEditModeItem(i)}
              visible={editModeItem === i} />)
          )}
        </div>
    </div>
  )
}