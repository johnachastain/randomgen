import { atom } from "recoil";

export type SyntaxMap = {
  name: string,
  key: number,
  checked: boolean
}

const BaseListState = atom({
  key: "BaseListState",
  default: ''
});

const BaseTypeState = atom({
  key: "BaseTypeState",
  default: ''
});

const BaseAdjState = atom({
  key: "BaseAdjState",
  default: ''
});

const BaseCountState = atom({
  key: "BaseCountState",
  default: 50
});

const BaseOutputState = atom({
  key: "BaseOutputState",
  default: [] as SyntaxMap[]
});

export {
  BaseListState,
  BaseTypeState,
  BaseAdjState,
  BaseCountState,
  BaseOutputState,
};
