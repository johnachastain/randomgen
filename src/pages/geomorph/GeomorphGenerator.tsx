import { MapItem } from './MapItem';
import { useGeomorphHook } from './useGeomorphHook';

export type SelectProps = { name: string }

export const GeomorphGenerator = ({name}: SelectProps) => {
  const {
    mapGrid, 
    rows, 
    setRows,
    columns, 
    setColumns,
    editModeItem, 
    onSetEditModeItem
  } = useGeomorphHook()

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