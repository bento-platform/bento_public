export const setEquals = <T>(x: Set<T>, y: Set<T>) => x.size === y.size && [...x].every((xx) => y.has(xx));
