"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowRight, Play, Pause, Star, Check, X } from 'lucide-react';
import Waves from "@/components/Lightning"

const STHIR = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showExclusiveOffer, setShowExclusiveOffer] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const videoRef = useRef(null);

  // Sophisticated scroll tracking
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse tracking for premium interactions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Exclusive offer trigger (psychological timing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExclusiveOffer(true);
    }, 45000); // 45 seconds - optimal psychological timing
    return () => clearTimeout(timer);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      text: "The quality is unmatched. Every stitch, every detail - it's clear this isn't just clothing, it's craftsmanship.",
      author: "Arjun Mehta",
      title: "Creative Director, Mumbai",
      rating: 5
    },
    {
      text: "I've never received so many compliments on a single piece. The cut, the feel - it's perfection.",
      author: "Priya Sharma",
      title: "Fashion Influencer, Delhi",
      rating: 5
    },
    {
      text: "Finally, a brand that understands what premium actually means. Worth every rupee.",
      author: "Karan Singh",
      title: "Entrepreneur, Chandigarh",
      rating: 5
    }
  ];

  const products = [
    {
      name: "The Minimalist",
      price: "₹2,499",
      originalPrice: "₹3,499",
      image: "/japanese.png",
      description: "Clean lines. Perfect fit. Timeless design.",
      features: ["100% Organic Cotton", "Zero-waste Production", "Unisex Cut"]
    },
    {
      name: "The Statement",
      price: "₹2,799",
      originalPrice: "₹3,799",
      image: "/hailuo.png",
      description: "Bold expression. Subtle sophistication.",
      features: ["Heritage Prints", "Premium Finish", "Limited Edition"]
    },
    {
      name: "The Essential",
      price: "₹2,299",
      originalPrice: "₹3,299",
      image: "/scar.png",
      description: "Everyday luxury. Extraordinary comfort.",
      features: ["Breathable Fabric", "Reinforced Seams", "Fade Resistant"]
    }
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      // Trigger exclusive access
      setTimeout(() => {
        setShowExclusiveOffer(true);
      }, 2000);
    }
  };

  const ExclusiveOfferModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-500 ${showExclusiveOffer ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative bg-white text-black p-8 rounded-2xl max-w-md mx-4 transform transition-all duration-500">
        <button
          onClick={() => setShowExclusiveOffer(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Exclusive Access</h3>
          <p className="text-gray-600 mb-6">
            You've been selected for early access to our limited collection.
            Only 100 pieces available.
          </p>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Early Bird Discount</p>
              <p className="text-2xl font-bold">30% OFF</p>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Claim Exclusive Access
            </button>

            <p className="text-xs text-gray-400">
              Offer expires in 24 hours. Limited to first 100 customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative bg-white text-black font-sans">

      {/* Premium Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-sm shadow-sm shadow-black">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">sthir.</div>

          <div className="hidden md:flex space-x-8 text-md">
            <a href="#story" className="hover:text-gray-600 transition-colors">Story</a>
            <a href="#collection" className="hover:text-gray-600 transition-colors">Collection</a>
            <a href="#craft" className="hover:text-gray-600 transition-colors">Craft</a>
            <a href="#community" className="hover:text-gray-600 transition-colors">Community</a>
          </div>

          <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Shop Now
          </button>
        </div>
      </nav>
      {/* Hero Section - Sophisticated Manipulation */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Lightning Background */}
        <div className="absolute inset-0">
          <Waves
            lineColor="white"
            backgroundColor="orange"
            waveSpeedX={0.01}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={100}
            xGap={10}
            yGap={10}
          />
        </div>

        <div className="relative z-10 text-center max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <div className="inline-block px-4 py-2 bg-black text-white font-amita text-sm rounded-full mb-6">
              Crafted in Chandigarh
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              <span className="block text-black font-amita tracking-wide mb-2">STHIR.</span>
              <span className="w-full block text-3xl md:text-6xl font-light text-black font-amita lowercase">
                Rooted in Authenticity
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-black mb-2 max-w-2xl mx-auto leading-relaxed">
              "sthir" (स्थिर) signifies a state of grounded strength and unwavering presence.
            </p>
            <p className="text-xl md:text-2xl text-black mb-8 max-w-2xl mx-auto leading-relaxed">
              Where heritage meets modern minimalism. Each piece tells a story of sustainable craftsmanship and timeless design.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center">
              Explore Collection
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </button>

            <button className="px-8 py-4 border border-black text-black rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300">
              Our Story
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown size={32} className="text-gray-400" />
        </div>
      </section>

      {/* Social Proof - Subtle Manipulation */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-gray-600 mb-4">Trusted by creators and tastemakers</p>
            <div className="flex justify-center items-center space-x-12 text-gray-400">
              <div className="text-2xl font-bold">2.5K+</div>
              <div className="text-2xl font-bold">98%</div>
              <div className="text-2xl font-bold">4.9★</div>
              <div className="text-2xl font-bold">Zero</div>
            </div>
            <div className="flex justify-center items-center space-x-12 text-sm text-gray-500 mt-2">
              <div>Happy Customers</div>
              <div>Satisfaction Rate</div>
              <div>Average Rating</div>
              <div>Returns</div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section - Emotional Connection */}
      <section id="story" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight font-amita">
                Born from the streets of Chandigarh
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                STHIR emerged from a simple belief: that authentic streetwear should honor its roots while embracing the future. Our name means "steady" in Sanskrit – a reflection of our commitment to timeless design and sustainable practices.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Each piece is thoughtfully crafted with 100% organic cotton, zero-waste production, and a deep respect for the artisans who bring our vision to life.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="text-green-600" size={20} />
                  <span>100% Organic Cotton</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-green-600" size={20} />
                  <span>Zero-Waste Production</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-green-600" size={20} />
                  <span>Fair Trade Certified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="text-green-600" size={20} />
                  <span>Gender-Neutral Design</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-3xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🏙️
                </div>
              </div>

              {/* Floating elements for visual interest */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-black rounded-full flex items-center justify-center text-white font-bold">
                EST<br />2024
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collection - Premium Product Display */}
      <section id="collection" className="py-20 bg-gradient-to-b from-white to-orange-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 font-amita">
              The Foundation Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three essential pieces that form the cornerstone of conscious streetwear. Each design represents our commitment to quality, sustainability, and timeless style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {products.map((product, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative bg-white rounded-lg p-2 h-full border border-gray-200">
                  <h3 className="w-full text-xl text-center font-light font-amita tracking-wide lowercase mb-1">{product.name}</h3>
                  <div className="aspect-square bg-gray-100 rounded-lg mb-6 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-8">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover z-10"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '🖤';
                      }}
                    />
                  </div>
                  <h3 className="z-1 absolute bottom-28 right-0 w-full text-lg text-center font-light font-amita tracking-wide lowercase mb-2">{product.name}</h3>

                  <div className="space-y-4">
                    <div>
                      <p className="text-gray-600 mb-4">{product.description}</p>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-2xl font-bold">{product.price}</span>
                        <span className="text-gray-400 line-through">{product.originalPrice}</span>
                      </div>
                    </div>

                    {/* <div className="space-y-2">
                      {product.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                          <div className="w-1 h-1 bg-black rounded-full" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div> */}

                    {/* <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors group-hover:bg-gray-800">
                      Add to Cart
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Social Validation */}
      <section className="py-20 bg-gradient-to-b from-orange-400 to-orange-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-16 font-amita">What Our Community Says</h2>

          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-8">
                    <div className="bg-gray-50 rounded-2xl p-8">
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      <p className="text-xl italic text-gray-600 mb-6 leading-relaxed">
                        "{testimonial.text}"
                      </p>

                      <div>
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-gray-500 text-sm">{testimonial.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentTestimonial ? 'bg-black' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Email Capture - Psychological Timing */}
      <section className="py-20 bg-gradient-to-b from-orange-700 to-orange-950 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6 font-amita">
            Join the Movement
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Be the first to know about new drops, exclusive events, and the stories behind each piece.
          </p>

          {!isSubscribed ? (
            <div className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 rounded-l-full bg-white text-black focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  onClick={handleEmailSubmit}
                  className="bg-white text-black px-6 py-3 rounded-r-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-full">
                <Check size={20} />
                <span>Welcome to the STHIR community!</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-6 font-amita lowercase">STHIR.</h3>
              <p className="text-gray-600 leading-relaxed">
                Rooted in authenticity, designed for the future. Sustainable streetwear from the heart of India.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-amita">Shop</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Collection</a></li>
                <li><a href="#" className="hover:text-black transition-colors">New Arrivals</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Sale</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-amita">Company</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">About</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Sustainability</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 font-amita">Support</h4>
              <ul className="space-y-2 text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Returns</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
            <p>&copy; 2024 STHIR. All rights reserved. Made with ❤️ in Chandigarh.</p>
          </div>
        </div>
      </footer>

      {/* Exclusive Offer Modal */}
      <ExclusiveOfferModal />
    </div>
  );
};

export default STHIR;