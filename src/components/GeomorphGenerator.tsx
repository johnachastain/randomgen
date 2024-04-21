import { useMemo, useState, useCallback, useEffect } from 'react';
import { getNewGrid } from '../functions/geomorphs';
import { GridItem } from '../model/Geomorph';
import { MapItem } from './MapItem';
import { useRecoilValue, useRecoilState } from "recoil";
import { MapGridState, MapRowsState, MapColumnsState } from "../state/recoil_state";


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