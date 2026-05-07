import { atom } from "recoil";

export type SyntaxMap = {
  name: string,
  key: number,
  checked: boolean
}

const BaseListState = atom({
  key: "Refactor_BaseListState",
  default: ''
});

const BaseTypeState = atom({
  key: "Refactor_BaseTypeState",
  default: ''
});

const BaseAdjState = atom({
  key: "Refactor_BaseAdjState",
  default: ''
});

const BaseCountState = atom({
  key: "Refactor_BaseCountState",
  default: 50
});

const BaseOutputState = atom({
  key: "Refactor_BaseOutputState",
  default: [] as SyntaxMap[]
});

export {
  BaseListState,
  BaseTypeState,
  BaseAdjState,
  BaseCountState,
  BaseOutputState,
};
