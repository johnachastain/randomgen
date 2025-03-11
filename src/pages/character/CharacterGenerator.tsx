import { useState } from 'react';
import { Character } from '../../character/Character';
import { getConfig, getVariantItem, makeVariantTable } from '../../character/functions';
import { characterConfig } from '../../character/config';
import { weighedVariantConfig } from '../../character/names';

export const CharacterGenerator = () => {
  const [character, setCharacter] = useState<Character>(getConfig(characterConfig))
  console.log('character1', getConfig(characterConfig))
  console.log('makeTable', makeVariantTable(weighedVariantConfig, []))
  console.log('getTableItem', getVariantItem(weighedVariantConfig, []))

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