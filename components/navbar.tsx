"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#projects', label: 'Projects' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/20 backdrop-blur-md z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
         Sunfocus Solutions
        </Link>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 hover:text-indigo-600 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navLinks.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-500 hover:to-rose-500 transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg md:hidden">
            <div className="flex flex-col items-center py-4 space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  className="text-gray-800 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-500 hover:to-rose-500 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;