export function match<T>(...conditions: Array<[boolean, T]>) {
    const foundedCondition = conditions.find(([condition]) => condition) ?? conditions[0];
    return foundedCondition[1];
}