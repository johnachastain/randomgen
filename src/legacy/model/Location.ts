import { Base } from "./Base";

export enum LocationType {
  Natural = 'natural',
  Construct = 'construct',
  Hybrid = 'hybrid'
}
export interface Location extends Base {
  environs: string
  locType: LocationType
}