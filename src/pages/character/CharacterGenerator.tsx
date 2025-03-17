import { useState } from 'react';
import { Character } from '../../character/Character';
import { getTupleConfig } from '../../character/functions';
import { characterConfigTuple } from '../../character/config';

export const CharacterGenerator = () => {
  const [character, setCharacter] = useState<Character>(getTupleConfig(characterConfigTuple))

  return (
    <div>
      <h3>Character Generator</h3>
      <ul>
        {Object.keys(character).map(key => (
          <li key={key}>
            <label>{`${key}: `}</label>
            <button>
              {`${character[key as keyof Character]}`}
            </button>
          </li>
        ))
        }
      </ul>
    </div>
  )
}