import { isNumber } from "lodash"

import { isNullOrUndefined  } from "@lib"

export const isBoolean = (x: any): boolean => {
    if (x === true)  { return true }
    if (x === false) { return true }
    return false
}

export const isString = (x: any): boolean => {
    return (typeof x === "string" || x instanceof String)
}

export const isObject = (x: any): boolean => {
    if (isNullOrUndefined(x)) { return false }
    if (isBoolean(x))         { return false }
    if (isString(x))          { return false }
    if (isNumber(x))          { return false }
    if (Array.isArray(x))     { return false }
    return true
}
