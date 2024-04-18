import { useMemo, useState } from 'react';
import { getGrid } from '../legacy/geomorphs';
import { GridItem } from '../model/Geomorph';

export type SelectProps = {
  name: string
}

export type MapItemProps = {
  gridItem: GridItem
}

export const MapItem = ({gridItem: { geomorph, row, column }}: MapItemProps) => {
  return <img src={geomorph.src} style={{gridRow: row, gridColumn: column}} />
}

export const GeomorphGenerator = ({name}: SelectProps) => {
  const [rows, setRows] = useState(5)
  const [columns, setColumns] = useState(5)

  const gridMemo: GridItem[] = useMemo(
    () => getGrid(columns, rows),
    [rows, columns]
  );

  return (
    <div>
      <h3>{`Geomorphs: ${name}`}</h3>
        <div style={{ display: 'grid' }}>
          {gridMemo.map(
            (g) => <MapItem gridItem={g} />
          )}
        </div>
    </div>
  )
}