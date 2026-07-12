import { useState, useCallback, useEffect } from 'react';
import { createUseStyles } from 'react-jss'
import { Edge, Edges, GridItem } from "./geomorph/Geomorph";
import { updateSelf } from './geomorph/geomorphs';
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
      justifySelf: 'center',
      gap: 4,
    }
  },
  mapItemBtn: { padding: 0, margin: 0, display: 'grid' },
  mapItemImg: { zIndex: 1, gridRow: 1, gridColumn: 1, width: '100%', display: 'block' }
})

export type ItemState = {
  top: Edge
  right: Edge
  bottom: Edge
  left: Edge
}

export const convertFromEdges = (edges: Edges): ItemState => ({
  top:    edges.top    ?? Edge.Closed,
  right:  edges.right  ?? Edge.Closed,
  bottom: edges.bottom ?? Edge.Closed,
  left:   edges.left   ?? Edge.Closed,
})

export const convertToEdges = (i: ItemState): Edges => ({
  top: i.top, right: i.right, bottom: i.bottom, left: i.left,
})

const DIRECTIONS: (keyof ItemState)[] = ['top', 'right', 'bottom', 'left']

const EdgeSelector = (
  { name, value, onChange }: { name: keyof ItemState; value: Edge; onChange: (v: Partial<ItemState>) => void }
) => (
  <span>
    <select value={value} onChange={e => onChange({ [name]: e.target.value as Edge })}>
      <option value={Edge.Closed}>Closed</option>
      <option value={Edge.Open}>Open</option>
      <option value={Edge.Connect}>Connect</option>
    </select>
    {name}
  </span>
)

export type MapItemProps = {
  visible: boolean
  gridItem: GridItem
  onClose?: () => void
  onSetEditModeItem: () => void
}

export const MapItemOverlay = ({ visible = false, gridItem, onClose }: any) => {
  const { edges } = gridItem
  const styles = useStyles()
  const rows = useRecoilValue(MapRowsState)
  const columns = useRecoilValue(MapColumnsState)
  const [grid, setGrid] = useRecoilState(MapGridState)
  const [itmState, setItmState] = useState<ItemState>(convertFromEdges(edges))

  const onChangeHandler = (update: Partial<ItemState>) => {
    setItmState(prev => ({ ...prev, ...update }))
  }

  useEffect(() => { !visible && setItmState(convertFromEdges(edges)) }, [edges])

  const onSave = () => {
    const newEdges: Edges = convertToEdges(itmState)
    const updatedGrid = updateSelf(grid, gridItem, columns, rows, newEdges)
    setGrid(updatedGrid)
    onClose()
  }

  return (
    <>
      {visible ? (
        <div className={styles.mapItemOverlay}>
          {DIRECTIONS.map(dir => (
            <EdgeSelector key={dir} name={dir} value={itmState[dir]} onChange={onChangeHandler} />
          ))}
          <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
            <button onClick={onClose}>Close</button>
            <button onClick={onSave}>Save</button>
          </div>
        </div>
      ) : null}
    </>
  )
}

export const MapItem = ({ visible, gridItem, onSetEditModeItem }: MapItemProps) => {
  const { geomorph, row, column } = gridItem
  const styles = useStyles()

  const handleOnClick = useCallback(() => {
    !visible ? onSetEditModeItem() : undefined
  }, [visible, onSetEditModeItem]);

  return (
    <div
      className={styles.mapItemBtn}
      style={{ gridRow: row, gridColumn: column }}
      onClick={handleOnClick}>
      <MapItemOverlay visible={visible} gridItem={gridItem} onClose={onSetEditModeItem} />
      <img src={geomorph.src} className={styles.mapItemImg} />
    </div>
  )
}
