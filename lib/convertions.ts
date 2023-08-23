// This is a ts Module that converts color modes ( RGB, HSL, HEX, CMYK, HSV ) to each other.

// RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
    let hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}

// HEX to RGB 
export function hexToRgb(hex: string): number[] {
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);
    let rgb = [r, g, b];
    return rgb;
}

// RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): number[] {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;
    if (max != min) {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    let hsl = [h, s, l];
    return hsl;
}

// HSL to RGB
export function hslToRgb(h: number, s: number, l: number): number[] {
    let r, g, b;
    if (s == 0) {
        r = g = b = l;
    } else {
        let hue2rgb = function hue2rgb(p: number, q: number, t: number): number {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * (6 * t);
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (6 * (2 / 3 - t));
            return p;
        }
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    let rgb = [r * 255, g * 255, b * 255];
    return rgb;
}

// RGB to CMYK
export function rgbToCmyk(r: number, g: number, b: number): number[] {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));
    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);
    let cmyk = [c, m, y, k];
    return cmyk;
}

// CMYK to RGB
export function cmykToRgb(c: number, m: number, y: number, k: number): number[] {
    let r = 255 * (1 - c) * (1 - k);
    let g = 255 * (1 - m) * (1 - k);
    let b = 255 * (1 - y) * (1 - k);
    let rgb = [r, g, b];
    return rgb;
}

// RGB to HSV
export function rgbToHsv(r: number, g: number, b: number): number[] {
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, v = max;
    let d = max - min;
    s = max == 0 ? 0 : d / max;
    if (max != min) {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    let hsv = [h, s, v];
    return hsv;
}

// HSV to RGB
export function hsvToRgb(h: number, s: number, v: number): number[] {
    let r:number = 0;
    let g:number = 0;
    let b:number = 0;
    let i = Math.floor(h * 6);
    let f = h * 6 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    let rgb = [r * 255, g * 255, b * 255];
    return rgb;
}

// HEX to CMYK
export function hexToCmyk(hex: string): number[] {
    let rgb = hexToRgb(hex);
    let cmyk = rgbToCmyk(rgb[0], rgb[1], rgb[2]);
    return cmyk;
}

// CMYK to HEX
export function cmykToHex(c: number, m: number, y: number, k: number): string {
    let rgb = cmykToRgb(c, m, y, k);
    let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    return hex;
}

// HEX to HSL
export function hexToHsl(hex: string): number[] {
    let rgb = hexToRgb(hex);
    let hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    return hsl;
}

// HSL to HEX
export function hslToHex(h: number, s: number, l: number): string {
    let rgb = hslToRgb(h, s, l);
    let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    return hex;
}

// HEX to HSV
export function hexToHsv(hex: string): number[] {
    let rgb = hexToRgb(hex);
    let hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    return hsv;
}

// HSV to HEX
export function hsvToHex(h: number, s: number, v: number): string {
    let rgb = hsvToRgb(h, s, v);
    let hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
    return hex;
}

// HSL to CMYK
export function hslToCmyk(h: number, s: number, l: number): number[] {
    let rgb = hslToRgb(h, s, l);
    let cmyk = rgbToCmyk(rgb[0], rgb[1], rgb[2]);
    return cmyk;
}

// CMYK to HSL
export function cmykToHsl(c: number, m: number, y: number, k: number): number[] {
    let rgb = cmykToRgb(c, m, y, k);
    let hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    return hsl;
}

// HSL to HSV
export function hslToHsv(h: number, s: number, l: number): number[] {
    let rgb = hslToRgb(h, s, l);
    let hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    return hsv;
}

// HSV to HSL
export function hsvToHsl(h: number, s: number, v: number): number[] {
    let rgb = hsvToRgb(h, s, v);
    let hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
    return hsl;
}

// CMYK to HSV
export function cmykToHsv(c: number, m: number, y: number, k: number): number[] {
    let rgb = cmykToRgb(c, m, y, k);
    let hsv = rgbToHsv(rgb[0], rgb[1], rgb[2]);
    return hsv;
}

// HSV to CMYK
export function hsvToCmyk(h: number, s: number, v: number): number[] {
    let rgb = hsvToRgb(h, s, v);
    let cmyk = rgbToCmyk(rgb[0], rgb[1], rgb[2]);
    return cmyk;
}
