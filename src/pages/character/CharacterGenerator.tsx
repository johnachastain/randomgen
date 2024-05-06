import { useState } from 'react';
import { Character } from '../../character/Character';
import { getConfig, getTableItem, makeTable } from '../../character/functions';
import { characterConfig } from '../../character/config';
import { tableConfig } from '../../character/names';

export const CharacterGenerator = () => {
  const [character, setCharacter] =useState<Character>(getConfig(characterConfig))
  console.log('character1', getConfig(characterConfig))
  console.log(makeTable(tableConfig, []))
  console.log(getTableItem(tableConfig, []))

  return (
    <div>
      {/* <h3>Character Generator</h3>
      { Object.keys(character).map(key => (
          <p key={key}>{`${key}: ${character[key as keyof Character]}`}</p>
        ))
      } */}
    </div>
  )
}