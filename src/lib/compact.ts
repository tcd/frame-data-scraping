import { isString } from "lodash"
import { isStringEmpty } from "./is-string-empty"
import { isNullOrUndefined } from "./is-null-or-undefined"

// export const compact = <T>(x: T): T => {
//     if (isNullOrUndefined(x)) {
//         return x
//     }
//     if (Array.isArray(x)) {
//         return compactArray(x) as unknown as T
//     }
// }

/**
 * Return `null` & `undefined` values from an array
 */
export const compactArray = <T>(x: T[]): T[] => {
    if (isNullOrUndefined(x)) {
        return []
    }
    return x.filter(y => !isNullOrUndefined(y))
}

/**
 * Return `null` & `undefined` properties from an object
 */
export const compactObject = <T>(object: T): T => {
    let newObject = {...object}
    Object.keys(newObject).forEach((k) => {
        if (isNullOrUndefined(newObject[k])) {
            delete(newObject[k])
        }
        if (isString(newObject[k])) {
            if (isStringEmpty(newObject[k])) {
                delete(newObject[k])
            }
        }
    })
    return newObject
}
