import { atom } from "jotai";
import { ItemRecord } from "./types";

export const ItemState = atom([] as Array<ItemRecord<any>>)