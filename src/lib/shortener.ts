const ALPHANUMERIC_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const BASE = ALPHANUMERIC_CHARS.length;

export function toBase62(num: number): string {
  if (num === 0) {
    return ALPHANUMERIC_CHARS[0];
  }

  let shortCode = '';
  let currentNum = num;

  while (currentNum > 0) {
    const remainder = currentNum % BASE;
    shortCode = ALPHANUMERIC_CHARS[remainder] + shortCode;
    currentNum = Math.floor(currentNum / BASE);
  }

  return shortCode;
}
