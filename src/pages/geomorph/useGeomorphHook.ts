import { useRecoilState } from "recoil"
import { MapColumnsState, MapGridState, MapRowsState } from "../../state/recoil_state"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getNewGrid } from "../../geomorph/geomorphs"
import { GridItem } from "../../geomorph/Geomorph"

export interface GeomorphHook {
    mapGrid: GridItem[]
    setMapGrid: (itm: GridItem[]) => void
    rows: number 
    setRows: (n: number) => void
    columns: number
    setColumns: (n: number) => void
    editModeItem?: number
    setEditModeItem: (n: number) => void
    gridMemo: GridItem[]
    onSetEditModeItem: (i: number) => void
}

export const useGeomorphHook = (): GeomorphHook => {
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

  return {
    mapGrid, 
    setMapGrid,
    rows, 
    setRows,
    columns, 
    setColumns,
    editModeItem, 
    setEditModeItem,
    gridMemo,
    onSetEditModeItem
  }
}