import { useEffect } from 'react'
import { useAtomValue } from 'jotai'
import { create, Attributes } from '../functions/create'
import { ItemRecord, ItemState, updateProperty } from '../functions/basic'

export const TextElement = (
  {label, value}: {label: string, value: string}
) => {
  return (
    <li key={label}>
      <label>
        {`${label}: `}
      </label>
      {`${value}`}
    </li>
  )
}


export const ButtonElement = (
  {label, value, objId}: {label: string, value: string, objId: string}
) => {

  const handleUpdate = (id: string, key: Attributes) => {
    updateProperty(id, key as string, 3)
  }

  return (
    <li key={label}>
      <label>
        {`${label}: `}
      </label>
      <button onClick={() => {}}>
        {`${value}`}
      </button>
    </li>
  )
}

export const BlockElement = ({obj}: {obj: any}): any => {
  return (
  <ul>
    { Object.entries(obj ?? {}).map(([key, value]) => {
      const {id} = value ?? {} as any
      if (id) {
        const objValue = value as ItemRecord<any>

        return <li key={key}>
          <h3>{`${key}:`}</h3>
          <BlockElement obj={objValue.properties} />
          </li>
      }

      const strValue = value as string
      return (
        <TextElement key={key} label={key} value={strValue} />
      )
    })}
  </ul>
  )}

export const PageGenerator = () => {
  const List = useAtomValue(ItemState) ?? []

  useEffect(() => {
    const test = create()
    console.log(test)
    return () => {}
  }, [])

  return (
    <div>
      <h3>Character:</h3>
      <BlockElement obj={List[0]?.properties ?? {}} />
    </div>
  )
}