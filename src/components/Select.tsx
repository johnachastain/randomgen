import { ListOptionTuple } from './listOptions'

export type SelectProps = {
  name: string
  list: ListOptionTuple[]
  value: string
  label: string
  onSetSelected: (i: string) => void
}

export const Select = ({
  name,
  list,
  value,
  label,
  onSetSelected }: SelectProps) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <select
        name={name}
        id={name}
        value={value}
        onChange={(e) => onSetSelected(e.target.value)}>
        {list.map((i, idx) =>
          <option key={idx} value={i[0]}>{i[1]}</option>
        )}
      </select>
    </div>
  )
}