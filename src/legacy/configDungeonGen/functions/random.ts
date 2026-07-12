export const getRandom = (n: number): number => Math.floor(Math.random() * n)
export const getRandomV2 = (n: number): number => Math.ceil(Math.random() * n)
export const uuid = (): string => crypto.randomUUID()

export function pickRandom<T>(arr: T[]): T {
  return arr[getRandom(arr.length)]
}

export function randomInRange(min: number, max: number): number {
  return min + getRandom(max - min + 1)
}
