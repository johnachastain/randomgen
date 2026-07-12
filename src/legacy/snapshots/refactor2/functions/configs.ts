import { CharacterProps, TreasureProps } from "./enums";
import { CharacterProperties } from "./models";
import { Config } from "./types";
import { baseUpdater, conditionUpdater, treasureUpdater, typeUpdater, valuenUpdater } from "./updaters";

export const characterConfig: Config<CharacterProperties> = {
  [CharacterProps.Strength]: {required: true, updater: baseUpdater},
  [CharacterProps.Intelligence]: {required: true, updater: baseUpdater},
  [CharacterProps.Wisdom]: {required: true, updater: baseUpdater},
  [CharacterProps.Dexterity]: {required: true, updater: baseUpdater},
  [CharacterProps.Constitution]: {required: true, updater: baseUpdater},
  [CharacterProps.Charisma]: {required: true, updater: baseUpdater},
  [CharacterProps.Treasures]: {required: true, updater: treasureUpdater}
}

export const treasureConfig: any = {
  [TreasureProps.Type]: {required: true, updater: typeUpdater},
  [TreasureProps.Condition]: {required: true, updater: conditionUpdater},
  [TreasureProps.Value]: {required: true, updater: valuenUpdater},
}