export const range = (n) => Array.from(Array(n).keys());
export const noop = () => {};
export const identity = (x) => x;
export const sum = (xs) => xs.reduce((acc, x) => acc + x, 0);
