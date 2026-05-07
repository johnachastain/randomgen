import { Location } from "./Location";
import { Room } from "./Room";
export interface Level extends Location {
  subLevels: number
  rooms: Array<Room>
}