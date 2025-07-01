"use client"

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

const StarField = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const stars = [];
    const numStars = 200;
    
    // Create stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * 0.02 + 0.01
      });
    }
    
    let animationFrame;
    const animate = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        star.opacity += star.twinkle * (Math.random() > 0.5 ? 1 : -1);
        star.opacity = Math.max(0.2, Math.min(1, star.opacity));
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add galaxy effect with colored stars
        if (Math.random() > 0.95) {
          const colors = ['rgba(147, 51, 234, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(236, 72, 153, 0.6)'];
          ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: 'radial-gradient(ellipse at center, rgba(147, 51, 234, 0.1) 0%, rgba(3, 7, 18, 1) 70%)' }}
    />
  );
      };

const AnimatedSection = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const FeatureCard = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        boxShadow: "0 20px 40px rgba(147, 51, 234, 0.2)"
      }}
      className="bg-gray-800 rounded-xl p-6 cursor-pointer transition-all duration-300"
    >
      {children}
    </motion.div>
  );
};

const LibLanding = () => {
  const { scrollYProgress } = useScroll();
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const headerRef = useRef(null);
  
  return (
    <div className="relative bg-gray-950 text-white font-sans overflow-hidden">
      {/* Animated Header */}
      <motion.header
        ref={headerRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="shadow-xl shadow-white/5 fixed w-full py-6 px-4 sm:px-12 flex justify-between items-center border-b border-gray-800 backdrop-blur-sm z-50"
      >
        <motion.h1       
          className="text-2xl font-bold text-white cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          MindLinkUI
        </motion.h1>
        <motion.a 
          href="#get-started" 
          className="bg-white text-black py-2 px-4 rounded-lg font-medium hover:bg-gray-200 relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 opacity-0"
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
          Get Started
        </motion.a>
      </motion.header>

      {/* Hero Section with Galaxy Background */}
      <section className="min-h-screen flex flex-col items-center justify-center gap-8 text-center py-24 px-6 sm:px-12 relative overflow-hidden">
        <StarField />
        
        <motion.div
          style={{ y: yParallax }}
          className="relative z-10"
        >
          <motion.h2 
            className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <motion.span
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              style={{ backgroundSize: "200% 200%" }}
            >
              The Missing UI Toolkit
            </motion.span>
            <br />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              for AI-First Agentic and Saas Products
            </motion.span>
          </motion.h2>
          
          <motion.p 
            className="text-xl max-w-2xl mx-auto text-gray-400 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            MindLinkUI helps modern SaaS and AI startups ship polished AI-native interfaces and user onboarding flows 10x faster — with beautiful, accessible components built on top of ShadCN + Tailwind.
          </motion.p>
          
          <motion.div 
            className="flex justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <motion.a 
              href="#get-started" 
              className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 relative overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255, 255, 255, 0.2)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500"
                initial={{ x: "-100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: -1 }}
              />
              Get Started
            </motion.a>
            <motion.a 
              href="https://github.com/yourusername/neuronui" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="border border-white px-6 py-3 rounded-lg font-semibold text-white hover:bg-white hover:text-black relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ scale: 0, borderRadius: "50%" }}
                whileHover={{ scale: 1, borderRadius: "0%" }}
                transition={{ duration: 0.4 }}
                style={{ zIndex: -1 }}
              />
              View on GitHub
            </motion.a>
          </motion.div>
        </motion.div>
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-4 h-4 bg-purple-500 rounded-full opacity-60"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-32 right-16 w-6 h-6 bg-blue-500 rounded-full opacity-40"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -15, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-32 left-1/4 w-3 h-3 bg-pink-500 rounded-full opacity-70"
          animate={{ 
            y: [0, -25, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </section>

      {/* Features Section */}
      <AnimatedSection className="py-24 px-6 sm:px-12 bg-gray-900 relative" delay={0.2}>
        <motion.div style={{ y: yParallaxSlow }}>
          <motion.h3 
            className="text-3xl font-bold text-center mb-16"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            ✨ What Makes NeuronUI Special
          </motion.h3>
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: "🧠",
                title: "AI-Native Components",
                description: "Prompt inputs, chat UIs, AI toggles, citation views, and streaming outputs built for OpenAI, Claude, and LangChain — with built-in context support and streaming UX patterns."
              },
              {
                icon: "🚀",
                title: "Onboarding-First Design",
                description: "Ship engaging onboarding flows with guided tours, feature callouts, progress checklists, and nudges — optimized for SaaS activation and retention."
              },
              {
                icon: "🎯",
                title: "ShadCN + Tailwind Powered",
                description: "NeuronUI is built as a plug-and-play extension to ShadCN, following its design tokens, themes, and accessibility standards. Bring your own branding effortlessly."
              },
              {
                icon: "📦",
                title: "Minimal, Tree-Shakeable, Modular",
                description: "Install only the components you need. Bundle-friendly, performant, and made to scale with modern app architectures."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="p-6 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
              >
                <motion.div
                  className="text-2xl mb-2"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatedSection>

      {/* Components Section */}
      <AnimatedSection className="py-24 px-6 sm:px-12" delay={0.3}>
        <motion.h3 
          className="text-3xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          📦 Featured Components
        </motion.h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto text-gray-300">
          {[
            { title: "PromptInput", description: "Smart input field with streaming support, context tags, templates, and retry." },
            { title: "ChatHistory", description: "AI-ready chat thread UI with streaming bubbles and user/AI separation." },
            { title: "GuidedTour", description: "Multi-step onboarding flow with progress, popovers, and skip logic." },
            { title: "FeatureCallout", description: "Highlight new features with animations, CTAs, and placement control." },
            { title: "SpeechToTextInput", description: "Voice-enabled prompt input with Web Speech API and fallback UX." },
            { title: "CheckListCard", description: "Track onboarding tasks and progress visually — linked to user profile/localStorage." }
          ].map((component, index) => (
            <FeatureCard key={index} delay={index * 0.1}>
              <motion.h4 
                className="text-lg font-bold mb-2"
                whileHover={{ color: "#a855f7" }}
                transition={{ duration: 0.2 }}
              >
                {component.title}
              </motion.h4>
              <p>{component.description}</p>
            </FeatureCard>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-24 px-6 sm:px-12 bg-gray-900 text-center relative overflow-hidden" id="get-started" delay={0.4}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-pink-900/20"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />
        
        <motion.h3 
          className="text-4xl font-extrabold mb-4 relative z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Start Building AI-Native & Onboarding-First Interfaces Today
        </motion.h3>
        <motion.p 
          className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          NeuronUI is open-source and ready to plug into your ShadCN/Tailwind stack in seconds. Start shipping faster and smarter.
        </motion.p>
        <motion.a 
          href="https://github.com/yourusername/neuronui" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 relative z-10 inline-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 20px 40px rgba(255, 255, 255, 0.2)",
            y: -5
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 0.1 }}
            transition={{ duration: 0.3 }}
          />
          Get It on GitHub
        </motion.a>
      </AnimatedSection>

      {/* Footer */}
      <motion.footer 
        className="py-6 text-center text-gray-500 border-t border-gray-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        © 2025 NeuronUI. Built for modern SaaS teams.
      </motion.footer>
    </div>
  );
};

export default LibLanding;