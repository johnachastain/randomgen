export const getRandom = (n: number) => Math.floor(Math.random()* n)

export const getItem:any = (arr: any) => {
	const itm = arr.at(getRandom(arr.length));
  const result = typeof itm == 'object' ? getItem(itm) : itm
  return result
}