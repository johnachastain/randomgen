import { useEffect, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { create } from '../functions/character'
import { updateProperty } from '../functions/basic'
import { ConfigTypes } from '../functions/enums'
import { ItemRecord } from '../functions/types'
import { ItemFamily, ItemState } from '../functions/state'

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

  const handleUpdate = (id: string, key: string) => {
    updateProperty(id, key)
  }

  return (
    <li key={label}>
      <label>
        {`${label}: `}
      </label>
      <button onClick={() => {handleUpdate(objId, label)}}>
        {`${value}`}
      </button>
    </li>
  )
}

export const BlockElement = ({obj}: {obj: any}): any => {
  const { id: objId } = obj ?? {}

  const [ item ] = useAtom(ItemFamily(objId))
  const testProps = item?.properties

  return (
  <ul>
    { Object.entries(testProps ?? {}).map(([key, value]) => {

      const {id} = value ?? {} as any
      if (id) {
        const objValue = value as ItemRecord<any>

        return <li key={key}>
          <h3>{`${key}:`}</h3>
          <BlockElement obj={objValue} />
          </li>
      }

      const strValue = value as string
      return (
        <ButtonElement 
          key={key} 
          label={key} 
          value={strValue} 
          objId={objId} />
      )
    })}
  </ul>
  )}

export const PageGenerator = () => {
  // const List = useAtomValue(ItemState) ?? []
  // console.log('List', List)
  const [state, setState] =  useState<ItemRecord<any>>()

  useEffect(() => {
    const entry = create()
    setState(entry)
  }, [])

  return (
    <div>
      <h3>Character:</h3>
      <BlockElement obj={state} />
    </div>
  )
}