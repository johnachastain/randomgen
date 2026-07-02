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
    onSetEditModeItem,
    regenerate,
  } = useGeomorphHook()

  return (
    <div>
      <h3>{`Geomorphs: ${name}`}</h3>
      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
        <label>
          Columns: {columns}&nbsp;
          <input type="range" min={1} max={8} value={columns}
            onChange={(e) => setColumns(Number(e.target.value))} />
        </label>
        <label>
          Rows: {rows}&nbsp;
          <input type="range" min={1} max={8} value={rows}
            onChange={(e) => setRows(Number(e.target.value))} />
        </label>
        <button onClick={regenerate}>Regenerate</button>
      </div>

      <div style={{
        display: 'inline-grid',
        gridTemplateColumns: `repeat(${columns}, 80px)`,
        gridTemplateRows: `repeat(${rows}, 80px)`,
      }}>
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
