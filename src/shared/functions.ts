export const getRandom = (n: number): number => Math.floor(Math.random() * n)

export const getItem = (arr: any): any => {
  const itm = arr.at(getRandom(arr.length));
  const result = typeof itm == 'object' ? getItem(itm) : itm
  return result
}

export const capitalizeInitial = (str: string): string =>
  `${str.charAt(0).toUpperCase()}${str.slice(1)}`