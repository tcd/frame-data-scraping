import { isNullOrUndefined } from "./is-null-or-undefined"

export const isStringEmpty = (str: any, excludeNewLines: boolean = false): boolean => {
    if (isNullOrUndefined(str)) { return true }
    if (str === "")             { return true }
    if (str?.trim()?.length === 0) {
        if (str?.match(/\s*\n\s*/) && excludeNewLines) { return false }
        return true
    }
    return false
}
