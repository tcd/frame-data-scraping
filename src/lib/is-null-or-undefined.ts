/**
 * Checks for any of the following:
 *   - A `null` value
 *   - An `undefined` value
 */
export const isNullOrUndefined = (x: any): boolean => {
    if (x === undefined) { return true }
    if (x === null)      { return true }
    return false
}
