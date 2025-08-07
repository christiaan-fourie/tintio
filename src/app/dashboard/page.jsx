'use client'

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// --- Helper & Conversion Functions ---

const hslToRgb = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return { 
    r: Math.round(255 * f(0)), 
    g: Math.round(255 * f(8)), 
    b: Math.round(255 * f(4)) 
  };
};

const rgbToHsl = (r, g, b) => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { 
    h: Math.round(h * 360), 
    s: Math.round(s * 100), 
    l: Math.round(l * 100) 
  };
};

const rgbToCmyk = (r, g, b) => {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, m, y);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  return {
    c: Math.round(((c - k) / (1 - k)) * 100),
    m: Math.round(((m - k) / (1 - k)) * 100),
    y: Math.round(((y - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
};

const cmykToRgb = (c, m, y, k) => {
  c /= 100; m /= 100; y /= 100; k /= 100;
  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);
  return { 
    r: Math.round(r), 
    g: Math.round(g), 
    b: Math.round(b) 
  };
};

const rgbToHex = (r, g, b) => {
  const toHex = (c) => ('0' + c.toString(16)).slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// --- UI Components ---

const SliderControl = ({ label, value, onChange, min, max, gradient }) => (
  <div className="flex flex-col space-y-2">
    <div className="flex justify-between items-center text-sm">
      <label className="font-medium text-gray-300">{label}</label>
      <span className="w-10 text-center bg-white/10 rounded-md py-0.5">{value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={onChange}
      className="w-full h-6 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
      style={{ background: gradient }}
    />
  </div>
);

const ColorInputGroup = ({ label, value, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div className="flex items-center">
        <input
          type="text"
          readOnly
          value={value}
          className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <button
          onClick={onCopy || handleCopy}
          className="px-3 py-2 bg-white/10 border border-l-0 border-white/20 rounded-r-md hover:bg-white/20 transition-colors"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zM-1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

// --- Main Application Component ---

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  const [hsl, setHsl] = useState({ h: 200, s: 80, l: 55 });

  const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
  const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
  const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

  const handleHslChange = (channel, value) => {
    setHsl(prevHsl => ({ ...prevHsl, [channel]: Number(value) }));
  };

  const handleRgbChange = (channel, value) => {
    const newRgb = { ...rgb, [channel]: Number(value) };
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleCmykChange = (channel, value) => {
    const newCmyk = { ...cmyk, [channel]: Number(value) };
    const newRgb = cmykToRgb(newCmyk.c, newCmyk.m, newCmyk.y, newCmyk.k);
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
  };

  const handleHexChange = (e) => {
    const newHex = e.target.value;
    const newRgb = hexToRgb(newHex);
    if (newRgb) {
      setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
    }
  };

  const hueGradient = 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)';
  const saturationGradient = `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`;
  const lightnessGradient = `linear-gradient(to right, #000, hsl(${hsl.h}, ${hsl.s}%, 50%), #fff)`;
  const redGradient = `linear-gradient(to right, rgb(0, ${rgb.g}, ${rgb.b}), rgb(255, ${rgb.g}, ${rgb.b}))`;
  const greenGradient = `linear-gradient(to right, rgb(${rgb.r}, 0, ${rgb.b}), rgb(${rgb.r}, 255, ${rgb.b}))`;
  const blueGradient = `linear-gradient(to right, rgb(${rgb.r}, ${rgb.g}, 0), rgb(${rgb.r}, ${rgb.g}, 255))`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white font-sans">
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          background: #fff;
          border-radius: 50%;
          border: 2px solid #334155;
          cursor: pointer;
          margin-top: -8px; /* Centers thumb on the thicker track */
        }
        .slider-thumb::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: #fff;
          border-radius: 50%;
          border: 2px solid #334155;
          cursor: pointer;
        }
        input[type="range"].slider-thumb {
          height: 1.5rem;
        }
      `}</style>
      <nav className="flex items-center justify-between p-6 bg-white/5 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full" style={{ backgroundColor: hex }}></div>
          <h1 className="text-2xl font-bold text-white">Color Converter</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-300">Welcome, {user.displayName || user.email}</span>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-pink-500/50 text-white rounded-lg hover:bg-pink-500/80 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <main className="p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Color Preview */}
          <div className="lg:col-span-1 flex flex-col items-center space-y-6">
            <div 
              className="w-full h-64 rounded-2xl shadow-2xl border-4 border-white/10 transition-colors duration-200" 
              style={{ backgroundColor: hex }}
            ></div>
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ColorInputGroup label="HEX" value={hex} />
              <ColorInputGroup label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
            </div>
          </div>

          {/* Right Column: Sliders */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            {/* RGB Sliders */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold text-pink-400">RGB</h3>
              <SliderControl label="Red" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} min={0} max={255} gradient={redGradient} />
              <SliderControl label="Green" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} min={0} max={255} gradient={greenGradient} />
              <SliderControl label="Blue" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} min={0} max={255} gradient={blueGradient} />
            </div>

            {/* HSL Sliders */}
            <div className="flex flex-col space-y-4">
              <h3 className="text-xl font-semibold text-violet-400">HSL</h3>
              <SliderControl label="Hue" value={hsl.h} onChange={(e) => handleHslChange('h', e.target.value)} min={0} max={360} gradient={hueGradient} />
              <SliderControl label="Saturation" value={hsl.s} onChange={(e) => handleHslChange('s', e.target.value)} min={0} max={100} gradient={saturationGradient} />
              <SliderControl label="Lightness" value={hsl.l} onChange={(e) => handleHslChange('l', e.target.value)} min={0} max={100} gradient={lightnessGradient} />
            </div>

            {/* CMYK Sliders */}
            <div className="md:col-span-2 flex flex-col space-y-4 pt-4 border-t border-white/10">
              <h3 className="text-xl font-semibold text-cyan-400">CMYK</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4">
                <SliderControl label="Cyan" value={cmyk.c} onChange={(e) => handleCmykChange('c', e.target.value)} min={0} max={100} gradient={`linear-gradient(to right, white, cyan)`}/>
                <SliderControl label="Magenta" value={cmyk.m} onChange={(e) => handleCmykChange('m', e.target.value)} min={0} max={100} gradient={`linear-gradient(to right, white, magenta)`}/>
                <SliderControl label="Yellow" value={cmyk.y} onChange={(e) => handleCmykChange('y', e.target.value)} min={0} max={100} gradient={`linear-gradient(to right, white, yellow)`}/>
                <SliderControl label="Black (Key)" value={cmyk.k} onChange={(e) => handleCmykChange('k', e.target.value)} min={0} max={100} gradient={`linear-gradient(to right, white, black)`}/>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}