import { createItm } from './basic';
import { ConfigTypes } from './enums';
import { ItemRecord } from './types';
import { TreasureProperties } from './models';
import { treasureConfig } from './configs';

export const createTreasure = (parentId?: string): ItemRecord<TreasureProperties> => {
   return  createItm<TreasureProperties>(ConfigTypes.Treasure, treasureConfig, parentId)
}
