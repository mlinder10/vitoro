import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HEX_BASE = 16;
const SHIFT_MAGNITUDE = 0.2;

export function shiftColor(hexColor: string): string {
  function hexToRgb(hex: string) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    if (hex.length !== 6) throw new Error("Invalid hex color");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return { r, g, b };
  }

  function rgbToHex(r: number, g: number, b: number) {
    return (
      "#" +
      [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")
    );
  }

  function rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h, s, l };
  }

  function hslToRgb(h: number, s: number, l: number) {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    };
  }

  const { r, g, b } = hexToRgb(hexColor);
  const { h, s, l } = rgbToHsl(r, g, b);

  const isDark = l < 0.5;
  const newL = Math.max(
    0,
    Math.min(1, isDark ? l + SHIFT_MAGNITUDE : l - SHIFT_MAGNITUDE)
  );

  const { r: r2, g: g2, b: b2 } = hslToRgb(h, s, newL);
  return rgbToHex(r2, g2, b2);
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
  const r = parseInt(color.substring(0, 2), HEX_BASE);
  const g = parseInt(color.substring(2, 4), HEX_BASE);
  const b = parseInt(color.substring(4, 6), HEX_BASE);
  return r * 0.299 + g * 0.587 + b * 0.114 < 128;
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function generateColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function trimTo(text: string, length: number) {
  if (text.length > length) {
    return (
      text
        .substring(0, length - 3)
        .split(" ")
        .slice(0, -1)
        .join(" ") + "..."
    );
  }
  return text;
}
