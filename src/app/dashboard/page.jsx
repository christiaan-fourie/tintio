'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, collection, addDoc, deleteDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';

// --- HELPER & CONVERSION FUNCTIONS ---

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
    let h = 0, s, l = (max + min) / 2;

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
    const toHex = (c) => ('0' + Math.round(c).toString(16)).slice(-2);
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

const SliderControl = ({ label, value, onChange, min, max, gradient }) => (
    <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center text-sm">
            <label className="font-medium text-gray-300">{label}</label>
            <span className="w-12 text-center bg-white/10 rounded-md py-0.5 tabular-nums">{value}</span>
        </div>
        <input
            type="range"
            min={min}
            max={max}
            value={value}
            onChange={onChange}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            style={{ background: gradient }}
        />
    </div>
);

const ColorInputGroup = ({ label, value, onCopy, onHexChange, isHex = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        try {
            const tempInput = document.createElement('textarea');
            tempInput.value = value;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            <div className="flex items-center">
                <input
                    type="text"
                    readOnly={!isHex}
                    value={value}
                    onChange={isHex ? onHexChange : undefined}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 font-mono"
                />
                <button
                    onClick={onCopy || handleCopy}
                    className="px-3 py-2 bg-white/10 border border-l-0 border-white/20 rounded-r-md hover:bg-white/20 transition-colors"
                    aria-label={`Copy ${label} value`}
                >
                    {copied ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-lg text-green-400" viewBox="0 0 16 16">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3z" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
};

const PaletteDisplay = ({ title, colors, onColorClick }) => (
    <div>
        <h4 className="text-lg font-semibold text-gray-300 mb-2">{title}</h4>
        <div className="flex space-x-2">
            {colors.map((color, index) => (
                <div
                    key={index}
                    className="w-full h-16 rounded-lg cursor-pointer border-2 border-transparent hover:border-white transition-all"
                    style={{ backgroundColor: color }}
                    onClick={() => onColorClick(color)}
                />
            ))}
        </div>
    </div>
);

const SavedColor = ({ color, onSelect, onDelete }) => (
    <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg group">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelect(color.hex)}>
            <div className="w-8 h-8 rounded-full border-2 border-white/20" style={{ backgroundColor: color.hex }}></div>
            <span className="font-mono text-sm">{color.hex}</span>
        </div>
        <button onClick={() => onDelete(color.id)} className="p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
            </svg>
        </button>
    </div>
);


// --- PALETTE GENERATION FUNCTIONS ---

const generatePalettes = (hsl) => {
    const { h, s, l } = hsl;

    const complementary = [{ ...hsl, h: (h + 180) % 360 }];

    const analogous = [
        { ...hsl, h: (h + 30) % 360 },
        { ...hsl },
        { ...hsl, h: (h + 330) % 360 }
    ];

    const triadic = [
        { ...hsl, h: (h + 120) % 360 },
        { ...hsl },
        { ...hsl, h: (h + 240) % 360 }
    ];

    const tetradic = [
        { ...hsl, h: h },
        { ...hsl, h: (h + 90) % 360 },
        { ...hsl, h: (h + 180) % 360 },
        { ...hsl, h: (h + 270) % 360 }
    ];

    // Convert HSL values to hex for display
    const convertToHex = (colors) => {
        return colors.map(color => {
            const rgb = hslToRgb(color.h, color.s, color.l);
            return rgbToHex(rgb.r, rgb.g, rgb.b);
        });
    };

    return {
        complementary: convertToHex(complementary),
        analogous: convertToHex(analogous),
        triadic: convertToHex(triadic),
        tetradic: convertToHex(tetradic)
    };
};

// --- MAIN APPLICATION COMPONENT ---

export default function App() {
    const { user, loading, logout, auth } = useAuth();
    const router = useRouter();
    const [db, setDb] = useState(null);

    const [hsl, setHsl] = useState({ h: 200, s: 80, l: 55 });
    const [hexValue, setHexValue] = useState(rgbToHex(hslToRgb(200, 80, 55).r, hslToRgb(200, 80, 55).g, hslToRgb(200, 80, 55).b));
    const [history, setHistory] = useState([]);
    const [savedColors, setSavedColors] = useState([]);
    
    const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

    // Initialize Firestore
    useEffect(() => {
        if (auth) {
            setDb(getFirestore(auth.app));
        }
    }, [auth]);

    // Firestore: Fetch saved colors
    useEffect(() => {
        if (!db || !user) return;
        
        const userId = user.uid;
        const collectionPath = `artifacts/${appId}/users/${userId}/colors`;
        const q = query(collection(db, collectionPath));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const colors = [];
            querySnapshot.forEach((doc) => {
                colors.push({ id: doc.id, ...doc.data() });
            });
            setSavedColors(colors);
        }, (error) => {
            console.error("Error fetching saved colors:", error);
        });

        return () => unsubscribe();
    }, [db, user, appId]);


    // Memoized color calculations
    const { rgb, hex, cmyk } = useMemo(() => {
        const currentRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        const currentHex = rgbToHex(currentRgb.r, currentRgb.g, currentRgb.b);
        const currentCmyk = rgbToCmyk(currentRgb.r, currentRgb.g, currentRgb.b);
        return { rgb: currentRgb, hex: currentHex, cmyk: currentCmyk };
    }, [hsl]);

    const palettes = useMemo(() => generatePalettes(hsl), [hsl]);

    // Update hex input when color changes
    useEffect(() => {
        setHexValue(hex);
    }, [hex]);

    // Add to history on color change (debounced)
    useEffect(() => {
        const handler = setTimeout(() => {
            setHistory(prev => {
                const newHistory = [hex, ...prev.filter(h => h !== hex)];
                return newHistory.slice(0, 10); // Keep last 10
            });
        }, 500);
        return () => clearTimeout(handler);
    }, [hex]);

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

    const handleHexInputChange = (e) => {
        const newHex = e.target.value;
        setHexValue(newHex);
        if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(newHex)) {
            const newRgb = hexToRgb(newHex);
            if (newRgb) {
                setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
            }
        }
    };

    const selectColor = useCallback((colorStr) => {
        let newRgb;
        if (colorStr.startsWith('#')) {
            newRgb = hexToRgb(colorStr);
        } else if (colorStr.startsWith('hsl')) {
            const parts = colorStr.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
            if(parts) {
               newRgb = hslToRgb(Number(parts[1]), Number(parts[2]), Number(parts[3]));
            }
        }
        if (newRgb) {
            setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b));
        }
    }, []);
    
    const handleSaveColor = async () => {
        if (!db || !user) {
            alert("You must be logged in to save colors.");
            return;
        }
        const userId = user.uid;
        const collectionPath = `artifacts/${appId}/users/${userId}/colors`;

        // Prevent duplicates
        if (savedColors.some(c => c.hex === hex)) {
            console.log("Color already saved.");
            return;
        }
        try {
            await addDoc(collection(db, collectionPath), { hex: hex, createdAt: new Date() });
        } catch (error) {
            console.error("Error saving color: ", error);
        }
    };

    const handleDeleteColor = async (id) => {
        if (!db || !user) return;
        const userId = user.uid;
        const docPath = `artifacts/${appId}/users/${userId}/colors/${id}`;
        try {
            await deleteDoc(doc(db, docPath));
        } catch (error) {
            console.error("Error deleting color: ", error);
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
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <p className="text-white text-2xl animate-pulse">Loading Color Universe...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white font-sans">
            <style>{`
                .slider-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none; appearance: none;
                    width: 20px; height: 20px;
                    background: #fff; border-radius: 50%;
                    border: 3px solid #4f46e5; cursor: pointer;
                    margin-top: -8px; 
                }
                .slider-thumb::-moz-range-thumb {
                    width: 20px; height: 20px;
                    background: #fff; border-radius: 50%;
                    border: 3px solid #4f46e5; cursor: pointer;
                }
            `}</style>
            <nav className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full border-2 border-white/20" style={{ backgroundColor: hex }}></div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">Color Pro</h1>
                </div>
                {user && (
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300 hidden sm:block">Welcome!</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-pink-500/50 text-white rounded-lg hover:bg-pink-500/80 transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                )}
            </nav>

            <main className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Preview & Saved */}
                    <div className="lg:col-span-3 flex flex-col space-y-6">
                        <div
                            className="w-full h-64 rounded-2xl shadow-2xl border-4 border-white/10 transition-colors duration-200 flex items-center justify-center"
                            style={{ backgroundColor: hex }}
                        >
                           <button onClick={handleSaveColor} className="flex items-center space-x-2 px-4 py-2 bg-black/30 rounded-lg backdrop-blur-sm hover:bg-black/50 transition-all">
                               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-bookmark-plus" viewBox="0 0 16 16">
                                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                                  <path d="M8 4a.5.5 0 0 1 .5.5V6H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V7H6a.5.5 0 0 1 0-1h1.5V4.5A.5.5 0 0 1 8 4z"/>
                                </svg>
                               <span>Save Color</span>
                           </button>
                        </div>
                        <div className="w-full bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
                            <h3 className="text-lg font-semibold text-gray-300 mb-3">Saved Colors</h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                {savedColors.length > 0 ? savedColors.map(c => 
                                    <SavedColor key={c.id} color={c} onSelect={selectColor} onDelete={handleDeleteColor} />
                                ) : <p className="text-gray-400 text-sm text-center py-4">No colors saved yet.</p>}
                            </div>
                        </div>
                        <div className="w-full bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
                            <h3 className="text-lg font-semibold text-gray-300 mb-3">History</h3>
                            <div className="flex flex-wrap gap-2">
                                {history.map((color, i) => (
                                    <div key={i} onClick={() => selectColor(color)} className="w-8 h-8 rounded-full cursor-pointer border-2 border-white/20" style={{backgroundColor: color}}></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Sliders & Values */}
                    <div className="lg:col-span-5 grid grid-cols-1 gap-6">
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                <ColorInputGroup label="HEX" value={hexValue} onHexChange={handleHexInputChange} isHex={true} />
                                <ColorInputGroup label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} />
                                <ColorInputGroup label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} />
                                <ColorInputGroup label="CMYK" value={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="flex flex-col space-y-4">
                                    <h3 className="text-xl font-semibold text-pink-400">RGB</h3>
                                    <SliderControl label="R" value={rgb.r} onChange={(e) => handleRgbChange('r', e.target.value)} min={0} max={255} gradient={redGradient} />
                                    <SliderControl label="G" value={rgb.g} onChange={(e) => handleRgbChange('g', e.target.value)} min={0} max={255} gradient={greenGradient} />
                                    <SliderControl label="B" value={rgb.b} onChange={(e) => handleRgbChange('b', e.target.value)} min={0} max={255} gradient={blueGradient} />
                                </div>
                                <div className="flex flex-col space-y-4">
                                    <h3 className="text-xl font-semibold text-violet-400">HSL</h3>
                                    <SliderControl label="H" value={hsl.h} onChange={(e) => handleHslChange('h', e.target.value)} min={0} max={360} gradient={hueGradient} />
                                    <SliderControl label="S" value={hsl.s} onChange={(e) => handleHslChange('s', e.target.value)} min={0} max={100} gradient={saturationGradient} />
                                    <SliderControl label="L" value={hsl.l} onChange={(e) => handleHslChange('l', e.target.value)} min={0} max={100} gradient={lightnessGradient} />
                                </div>
                            </div>
                        </div>
                         <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-cyan-400 mb-4">CMYK</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                                <SliderControl label="C" value={cmyk.c} onChange={(e) => handleCmykChange('c', e.target.value)} min={0} max={100} gradient={`linear-gradient(to right, white, cyan)`}/>
                                <SliderControl label="M" value={cmyk.m} onChange={(e) => handleCmykChange('m', e.target.value)} min={0} max={100} gradient={`linear-gradient(to right, white, magenta)`}/>
                                <SliderControl label="Y" value={cmyk.y} onChange={(e) => handleCmykChange('y', e.target.value)} min={0} max={100} gradient={`linear-gradient(to right, white, yellow)`}/>
                                <SliderControl label="K" value={cmyk.k} onChange={(e) => handleCmykChange('k', e.target.value)} min={0} max={100} gradient={`linear-gradient(to right, white, black)`}/>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Palettes */}
                    <div className="lg:col-span-4 flex flex-col space-y-6">
                        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                            <h3 className="text-xl font-semibold text-teal-400 mb-4">Color Palettes</h3>
                            <div className="space-y-4">
                                <PaletteDisplay title="Complementary" colors={palettes.complementary} onColorClick={selectColor} />
                                <PaletteDisplay title="Analogous" colors={palettes.analogous} onColorClick={selectColor} />
                                <PaletteDisplay title="Triadic" colors={palettes.triadic} onColorClick={selectColor} />
                                <PaletteDisplay title="Tetradic" colors={palettes.tetradic} onColorClick={selectColor} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
