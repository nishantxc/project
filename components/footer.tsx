"use client";

import React from 'react';
import Link from 'next/link';

const Footer = () => {
  const socialLinks = [
    { href: '#', icon: 'LinkedIn' },
    { href: '#', icon: 'Twitter' },
    { href: '#', icon: 'GitHub' },
    { href: '#', icon: 'Dribbble' }
  ];

  const footerLinks = [
    { 
      title: 'Services', 
      links: [
        { label: 'AI-Powered Design', href: '#services' },
        { label: 'Web Development', href: '#services' },
        { label: 'Conversion Optimization', href: '#services' }
      ]
    },
    { 
      title: 'Company', 
      links: [
        { label: 'About', href: '#about' },
        { label: 'Blog', href: '#blog' },
        { label: 'Contact', href: '#contact' }
      ]
    },
    { 
      title: 'Resources', 
      links: [
        { label: 'Case Studies', href: '#projects' },
        { label: 'Portfolio', href: '#projects' },
        { label: 'FAQs', href: '#faqs' }
      ]
    }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 text-gray-800 py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        {/* Logo and Tagline */}
        <div className="md:col-span-1">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500 mb-4">
            AI Design Studio
          </h3>
          <p className="text-gray-600 mb-4">
            Transforming Small Business Websites with AI-Driven Design and Development
          </p>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <Link 
                key={index} 
                href={social.href}
                className="text-gray-600 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-500 hover:to-rose-500"
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Links */}
        {footerLinks.map((section, index) => (
          <div key={index} className="md:col-span-1">
            <h4 className="font-bold mb-4 text-gray-800">{section.title}</h4>
            <div className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <Link 
                  key={linkIndex} 
                  href={link.href}
                  className="block text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Newsletter Signup */}
        <div className="md:col-span-1">
          <h4 className="font-bold mb-4 text-gray-800">Stay Updated</h4>
          <p className="text-gray-600 mb-4">Subscribe to our AI insights newsletter</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-4 py-2 rounded-l-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <button className="bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-4 py-2 rounded-r-full hover:from-indigo-600 hover:to-rose-600 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-12 pt-8 border-t border-gray-200">
        <p className="text-gray-600">
          © {new Date().getFullYear()} AI Design Studio. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;