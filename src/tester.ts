/*
interface twoCallBack {
  (a: any, b: any): void
}

const twoMaps = (A: any[], B: any[], callback: twoCallBack) => A.map(a => B.map(b => callback(a, b)))

interface threeCallBack {
  (a: any, b: any, c: any): void
}

const threeMaps = (A: any[], B: any[], C: any[], callback: threeCallBack, ...other: any[]) =>
  A.map(a => B.map(b => C.map(c => callback(a, b, c))
  ))



// per esempio tutte le scommesse già divise per role, in un 1 x 2
const groups = [
  [1, 2, 4, 5, 2, 3, 4],
  [35, 4, 7, 8, 2, 4, 5],
  [6, 8, 45, 6, 6, 8, 6]
]
let array: any[] = []
const final: threeCallBack = (a, b, c) => { if (a + b + c > 80) array.push([a, b, c]) }
threeMaps(...groups, final)

console.log(array)

*/
let A = [1, 2, 4, 5, 2, 3, 4]
let B = [35, 4, 7, 8, 2, 4, 5]
let C = [6, 8, 45, 6, 6, 8, 6]
let array = []


const final = (...args) => {
  let sum = args.reduce((a, b) => a + b)
  if (sum > 50) array.push([...args])
}

const mapper = (A, cb: (...args: any[]) => any) => A.map(a => cb(a))

mapper(A, mapper(B, mapper(C, final)))

console.log(array)






const permutations = (obj, n) => {
  if (typeof obj == 'string') obj = [...obj]
  n = n ? n : obj.length
  // make n copies of keys/indices
  for (var j = 0, nInds = []; j < n; j++) { nInds.push(Object.keys(obj)) }
  // get product of the indices, then filter to remove the same key twice
  var arrangements = product(nInds).filter(pair => pair[0] !== pair[1])
  return arrangements.map(indices => indices.map(i => obj[i]))
}


const combinations = (obj, n) => {
  /* filter out keys out of order, e.g. [0,1] is ok but [1,0] isn't */
  const isSorted = (arr) => {
    return arr.every((value, index, array) => {
      return index === 0 || String(array[index - 1]) <= String(value);
    });
  }
  // array with n copies of the keys of obj
  return permutations(Object.keys(obj), n)
    .filter(isSorted)
    .map(indices => indices.map(i => obj[i]))
    .value()
}









// run algorithm over all the possible combinations of an array

const deepMap = (arr: any[][], algorithm) => {
  combinatons(...arr)
}
