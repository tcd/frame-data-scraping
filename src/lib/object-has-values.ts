import { isObject } from "./is"
import { isNullOrUndefined } from "./is-null-or-undefined"

/** Returns `true` if even a single value in an object is not `null`. */
export const objectHasValues = (object: any): boolean => {
    if (!isObject(object)) { return false }

    let hasValues = false

    Object.keys(object).forEach((key) => {
        let value = object[key]
        if (!isNullOrUndefined(value)) {
            hasValues = true
        }
    })

    return hasValues
}
