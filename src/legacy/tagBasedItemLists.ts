
// import { a } from 'indefinite'

export type ListItem = {
  name: string 
  tags: string[] 
  odds: number
}
export type ListItemTable = (arr: ListItem[], themes: string[]) => string[]

export const makeTable: ListItemTable = (arr, themes) => {
  let sum: string[] = [];
  arr.forEach(
    (itm) => {
      const matches = themes.filter((theme) => itm.tags.includes(theme));
      let newArr = [];
      const num = (matches.length + 1) * itm.odds

      for (let i=0; i < num; i++) {
        newArr.push(itm.name);
      }

      sum = [ ...sum, ...newArr]
    });
  return sum;
}

export const getIndefinite = (word: string):string => ''// a(word)

export const getDeterminer = (word:string, plural: boolean) => {
  const r = getRandom(100);
  if (r <= 50) {
    return `the ${word}`
  } else {
    if (plural) {
      return `some ${word}`
    }
    return getIndefinite(word)
  }
}

export const getRarity = (odds: number) => {
  switch(odds) {
    case 1:
      return 'rare'
    case 2:
      return 'uncommon'
    case 3:
      return 'common'
    default:
      return 'rare'
  }
}

export const getRandom = (n: any) => Math.floor(Math.random()*n)
export const getItem: any = (arr:any) => {
	const itm = arr.at(getRandom(arr.length));
  return typeof itm == 'object' ? getItem(itm) : itm
}

export const test = () => {
  const testList: ListItem[] = [
    {name: 'Apple', tags: ['blue', 'yellow'], odds: 1},
    {name: 'Orange', tags: ['green', 'red'], odds: 2},
    {name: 'Bananna', tags: ['red', 'yellow'], odds: 3},
  ];
  const result = makeTable(testList, ['blue', 'green'])
  
  for (let i=0; i < 20; i++) {
    console.log(`${getItem(result)} - ${i}`)
  }
}

