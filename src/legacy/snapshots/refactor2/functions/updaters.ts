
import { CharacterProperties, TreasureProperties } from "./models";
import { d6x3, getRandom, getRandomV2 } from "./random"
import { createTreasure, } from "./treasure"
import { ItemRecord, Updater } from "./types"

export const conditions = [
"Dusty", 
"Ancient", 
"Dull", 
"Greasy", 
"Repaired", 
"Fine", 
"Grand", 
"Pristine", 
"Ornate", 
"Engraved", 
"Sturdy", 
"Gilded", 
"Broken", 
"Flawed", 
"Faulty", 
"Chipped", 
"Worn",  
"Warped", 
"Rotting", 
"Rusty", 
"Tarnished", 
"Moldy", 
"Rusting"
];

export const types = [
"Dagger",
"Ring",
"Bone",
"Key"
];

export const getItem = (arr: Array<string>) => arr[getRandom(arr.length)]

export const typeUpdater: Updater<ItemRecord<TreasureProperties>, string> = (obj) => getItem(types)
export const conditionUpdater: Updater<ItemRecord<TreasureProperties>, string> = (obj) => getItem(conditions) 
export const valuenUpdater: Updater<ItemRecord<TreasureProperties>, number> = (obj) => getRandomV2(10_000)

export const baseUpdater: Updater<ItemRecord<CharacterProperties>, number> = (obj) => d6x3() 
export const treasureUpdater: Updater<ItemRecord<CharacterProperties>, any> = (obj) => createTreasure(obj.id)