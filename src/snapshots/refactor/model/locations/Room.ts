import { Door } from "../Objects/Door";
import { Location } from "./Location";
import { Wall } from "../Objects/Wall";
export interface Room extends Location {
  walls?: Array<Wall>
  floor?: boolean
  ceiling?: boolean
  doors?: Array<Door>
  stairs?: boolean
  traps?: boolean
}