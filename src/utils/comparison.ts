/**
 * Checks if two values are equal.
 */
export function areValuesEqual(val1: unknown, val2: unknown): boolean {
    if (
        typeof val1 === "object" &&
        val1 !== null &&
        typeof val2 === "object" &&
        val2 !== null
    ) {
        return areObjectsEqual(
            val1 as Record<string, unknown>,
            val2 as Record<string, unknown>,
        );
    }
    return val1 === val2;
}

/**
 * Checks if two objects are equal.
 */
export function areObjectsEqual(
    obj1: Record<string, unknown> | null | undefined,
    obj2: Record<string, unknown> | null | undefined,
): boolean {
    if (
        typeof obj1 !== "object" ||
        obj1 === null ||
        typeof obj2 !== "object" ||
        obj2 === null
    ) {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        if (
            !Object.prototype.hasOwnProperty.call(obj2, key) ||
            !areValuesEqual(obj1[key], obj2[key])
        ) {
            return false;
        }
    }
    return true;
}
