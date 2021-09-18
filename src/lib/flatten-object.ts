import { isStringEmpty } from "@lib";

// export const flattenObject = (obj: any, prefix = "") => {
//   return Object.keys(obj).reduce((acc, k) => {
//     const pre = prefix.length ? prefix + "." : ""
//     if (typeof obj[k] === "object") {
//         Object.assign(acc, flattenObject(obj[k], pre + k))
//     } else {
//         acc[pre + k] = obj[k]
//     }
//     return acc
//   }, {})
// }


// export const flattenObject = (ob: any, prefix = "") => {
//   var toReturn = {};

//   for (var i in ob) {
//       if (!ob.hasOwnProperty(i)) continue;

//       if ((typeof ob[i]) == 'object' && ob[i] !== null) {
//           var flatObject = flattenObject(ob[i]);
//           for (var x in flatObject) {
//               if (!flatObject.hasOwnProperty(x)) continue;

//               toReturn[i + '.' + x] = flatObject[x];
//           }
//       } else {
//           toReturn[i] = ob[i];
//       }
//   }
//   return toReturn;
// }

/** https://stackoverflow.com/a/66900543/7687024 */
export const flattenObject = (ob: any, prefix = "--") => {
  let ans = {}
  let magic = function (obj: any, parent: string = null) {
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null && Array.isArray(obj[key]) === false) {
        if (isStringEmpty(parent)) {
          magic(obj[key], key)
        } else {
          magic(obj[key], parent + prefix + key)
        }
      } else {
        if (isStringEmpty(parent)) {
          ans[key] = obj[key];
        } else {
          ans[parent + prefix + key] = obj[key]
        }
      }
    }
  }
  magic(ob);
  return ans;
}
