import { atom, selector } from "recoil";

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



// const filteredBaseListState = selector({
//   key: "filteredBaseListState",
//   get: ({ get }) => {
//     // const filter = get(ListFilterState);
//     // const list = get(BaseListState);

//     // switch (filter) {
//     //   case "Show Completed":
//     //     return list.filter((item) => item.isComplete);
//     //   case "Show Uncompleted":
//     //     return list.filter((item) => !item.isComplete);
//     //   default:
//     //     return list;
//     // }
//   }
// });

// const ListStatsState = selector({
//   key: "ListStatsState",
//   get: ({ get }) => {
//     const List = get(BaseListState);
//     const totalNum = List.length;
//     // const totalCompletedNum = List.filter((item) => item.isComplete).length;
//     let allText = "";
//     // List
//     //   .filter((item) => !item.isComplete)
//     //   .map((item) => (allText = allText + " " + item.text));
//     // const totalUncompletedNum = totalNum - totalCompletedNum;
//     // const percentCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum;

//     return {
//       totalNum,
//       // totalCompletedNum,
//       // totalUncompletedNum,
//       // percentCompleted,
//       allText
//     };
//   }
// });

export {
  BaseListState,
  BaseTypeState,
  BaseAdjState,
  BaseCountState,
  BaseOutputState,


  // filteredBaseListState,
  // ListStatsState
};