import { useState, useMemo, useCallback } from 'react';
import { GridItem } from '../model/Geomorph';
import {createUseStyles} from 'react-jss'
import { Edge, Edges, Geomorph } from "../model/Geomorph";
import { getNeighbors, setGridItem, setItemInGrid, updateNeighbors, updateSelf } from '../functions/geomorphs';
import { MapGridState, MapRowsState, MapColumnsState } from "../state/recoil_state";
import { useRecoilValue, useRecoilState } from "recoil";

const useStyles = createUseStyles({
  mapItemOverlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 2, 
    gridRow: 1, 
    gridColumn: 1, 
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    justifyItems: 'center',
    color: 'white',
    padding: [0, 8],
    '& span': {
      display: 'flex',
      alignSelf: 'center',
      justifySelf: 'center'
    }
  },
  mapItemBtn: {padding: 0, margin: 0, display: 'grid'},
  mapItemImg: {zIndex: 1, gridRow: 1, gridColumn: 1}
})

export type CheckboxProps = {
  checked: boolean
  name: string
  onChange: (i: any) => void
}

export const OverlayCheckbox = (
  {name, checked, onChange}: CheckboxProps
) => {
  const handleChecked = () => onChange({ [name]: !checked })
  return (
    <span>
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={handleChecked} /> 
      {name}
    </span>
  )
}

export type MapItemProps = {
  visible: boolean
  gridItem: GridItem
  onClose?: () => void
  onSetEditModeItem: () => void
}

export const convertToEdges = (i: any): Edges => {
  return {
    top: i.top ? Edge.Connect : Edge.Closed,
    right: i.right ? Edge.Connect : Edge.Closed,
    bottom: i.bottom ? Edge.Connect : Edge.Closed,
    left: i.left ? Edge.Connect : Edge.Closed,
  }
}

export const convertFromEdges = (edges: Edges): any => {
  return {
    top: edges.top !== Edge.Closed,
    right: edges.right !== Edge.Closed,
    bottom: edges.bottom !== Edge.Closed,
    left: edges.left !== Edge.Closed,
    all: false
  }
}

export const MapItemOverlay = (
  {visible = false, gridItem, onClose}: any
) => {
  const { column, row, edges } = gridItem
  const styles = useStyles()
  const rows = useRecoilValue(MapRowsState)
  const columns = useRecoilValue(MapColumnsState)
  const [grid, setGrid] = useRecoilState(MapGridState)

  const [itmState, setItmState] = useState(convertFromEdges(edges))

  const setAny = (edge: any) => setItmState({ ...itmState, ...edge})
  const setAll = ({ all }: any) => setItmState({
    top: all, right: all, bottom: all, left: all, all
  })

  const onSave = () => {
    const newEdges: Edges =  convertToEdges(itmState)
    let updatedGrid = updateSelf(grid, gridItem, columns, rows, newEdges)
    // const test= updateNeighbors(grid, gridItem, columns, rows)


    setGrid(updatedGrid)
    onClose()
  }

  return (
    <>
    {visible ? <div className={styles.mapItemOverlay}>
      <OverlayCheckbox name='all' checked={itmState.all} onChange={setAll} />
      <OverlayCheckbox name='top' checked={itmState.top} onChange={setAny} />
      <OverlayCheckbox name='right' checked={itmState.right} onChange={setAny} />
      <OverlayCheckbox name='bottom' checked={itmState.bottom} onChange={setAny} />
      <OverlayCheckbox name='left' checked={itmState.left} onChange={setAny} />    
      <button onClick={onClose}>Close</button>
      <button onClick={onSave}>Save</button>
    </div> : null}
    </>
    )
}

export const MapItem = (
  { visible, gridItem, onSetEditModeItem }: MapItemProps
) => {
  const { geomorph, row, column} = gridItem
  const styles = useStyles()

  const handleOnClick = useCallback(() => {
    !visible ? onSetEditModeItem() : undefined
  }, [visible, onSetEditModeItem]);

  return (
    <div 
      className={styles.mapItemBtn} 
      style={{gridRow: row, gridColumn: column}} 
      onClick={handleOnClick}>
      <MapItemOverlay visible={visible} gridItem={gridItem} 
        onClose={onSetEditModeItem} />
      <img src={geomorph.src} className={styles.mapItemImg} />
    </div>
  )
}

