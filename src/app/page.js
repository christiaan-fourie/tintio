'use client'

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: "🎨",
      title: "Smart Palette Creation",
      description: "AI-powered color combinations that work perfectly together"
    },
    {
      icon: "📸",
      title: "Image Color Extraction",
      description: "Extract beautiful palettes from any image instantly"
    },
    {
      icon: "🔄",
      title: "Color Conversions",
      description: "Convert between HEX, RGB, HSL, CMYK and more formats"
    },
    {
      icon: "✨",
      title: "Advanced Tools",
      description: "Color harmony, accessibility checks, and gradient generators"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-white/10 backdrop-blur-lg">
        <div className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Tintio Logo" width={42} height={42} className="rounded-lg" />
          <h1 className="text-2xl font-bold text-white">Tintio</h1>
        </div>
        <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-lg">
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-20 px-6">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text">
          Create Perfect
          <br />
          Color Palettes
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Your advanced toolkit for color palette creation, image extraction, and intelligent color management
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg text-lg font-semibold hover:from-pink-600 hover:to-violet-600 transition-all duration-300 shadow-xl">
            Start Creating
          </button>
          <button className="px-8 py-4 border-2 border-white/30 text-white rounded-lg text-lg font-semibold hover:bg-white/10 transition-all duration-300">
            View Gallery
          </button>
        </div>

        {/* Color Palette Preview */}
        <div className="flex justify-center space-x-2 mb-8">
          {['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'].map((color, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-lg shadow-lg hover:scale-110 transition-transform duration-300 cursor-pointer"
              style={{ backgroundColor: color }}
            ></div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-16">
            Powerful Features for Color Professionals
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Try It Live
          </h3>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
            <div className="mb-6">
              <label className="block text-white text-lg mb-4">Upload an image to extract colors:</label>
              <div className="border-2 border-dashed border-white/30 rounded-lg p-8 hover:border-white/50 transition-colors duration-300 cursor-pointer">
                <div className="text-white/60">
                  <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Drop your image here or click to browse
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-red-400 to-pink-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">#FF4081</div>
              <div className="bg-gradient-to-br from-blue-400 to-indigo-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">#3F51B5</div>
              <div className="bg-gradient-to-br from-green-400 to-teal-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">#009688</div>
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 h-20 rounded-lg flex items-center justify-center text-white font-semibold">#FF9800</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-violet-500 rounded"></div>
                <span className="text-white font-bold text-lg">Tintio</span>
              </div>
              <p className="text-gray-400">The future of color palette creation</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Features</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Palette Generator</li>
                <li>Image Extraction</li>
                <li>Color Converter</li>
                <li>Accessibility Tools</li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Resources</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Documentation</li>
                <li>API Reference</li>
                <li>Tutorials</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Twitter</li>
                <li>GitHub</li>
                <li>Discord</li>
                <li>Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Tintio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
