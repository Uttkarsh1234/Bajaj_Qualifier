// utils.js
export const getFibonacci = (n) => {
    let res = [0, 1];
    for (let i = 2; i < n; i++) res.push(res[i - 1] + res[i - 2]);
    return n <= 0 ? [] : res.slice(0, n);
};

export const isPrime = (num) => {
    if (num <= 1 || !Number.isInteger(num)) return false;
    for (let i = 2, s = Math.sqrt(num); i <= s; i++) if (num % i === 0) return false;
    return true;
};

const gcd = (a, b) => (!b ? a : gcd(b, a % b));
export const getHCF = (arr) => arr.reduce((a, b) => gcd(Math.abs(a), Math.abs(b)));
export const getLCM = (arr) => arr.reduce((a, b) => (Math.abs(a * b) / gcd(a, b)));