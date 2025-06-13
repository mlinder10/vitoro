const HEX_BASE = 16;
const SHIFT_MAGNITUDE = 0.2;

function clamp(value: number, min = 0, max = 255): number {
  return Math.min(Math.max(value, min), max);
}

function padHex(value: number): string {
  return value.toString(HEX_BASE).padStart(2, "0");
}

export function shiftColor(
  color: string,
  shiftMagnitude = SHIFT_MAGNITUDE
): string {
  color = color.replace("#", "");
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (color.length !== 6) throw new Error("Invalid hex color format");

  const originalColor = "#" + color;
  const isDark = isColorDark(originalColor);
  const shift = isDark ? 1 + shiftMagnitude : 1 - shiftMagnitude;

  let r = Math.round(clamp(parseInt(color.substring(0, 2), HEX_BASE) * shift));
  let g = Math.round(clamp(parseInt(color.substring(2, 4), HEX_BASE) * shift));
  let b = Math.round(clamp(parseInt(color.substring(4, 6), HEX_BASE) * shift));

  return `#${padHex(r)}${padHex(g)}${padHex(b)}`;
}

export function isColorDark(color: string) {
  color = color.replace("#", "");
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (color.length !== 6) throw new Error("Invalid hex color format");
  let r = parseInt(color.substring(0, 2), HEX_BASE);
  let g = parseInt(color.substring(2, 4), HEX_BASE);
  let b = parseInt(color.substring(4, 6), HEX_BASE);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}

console.log(shiftColor("#2afb37"));
