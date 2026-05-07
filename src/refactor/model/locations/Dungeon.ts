import { Level } from "./Level";
import { Location } from "./Location";
export interface Dungeon extends Location {
  levels: Array<Level>
}