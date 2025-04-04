"use client";

import React, { useState } from 'react';
import { 
  Zap, 
  Code, 
  Rocket, 
  Layers, 
  Compass, 
  Cpu 
} from 'lucide-react';
import { motion } from 'framer-motion';

const ServicesBentoGrid = () => {
  const [hoveredService, setHoveredService] = useState(null);

  const services = [
    {
      icon: <Zap className="w-12 h-12 text-indigo-400" />,
      title: "AI-Powered Design",
      description: "Leverage cutting-edge AI to create visually stunning, conversion-focused designs.",
      color: "from-indigo-50 to-indigo-100",
      gridClass: "md:col-span-2 md:row-span-2",
      iconBg: "bg-indigo-100/30"
    },
    {
      icon: <Code className="w-12 h-12 text-teal-400" />,
      title: "Optimized Development",
      description: "Clean, responsive code that loads fast and looks perfect on all devices.",
      color: "from-teal-50 to-teal-100",
      gridClass: "md:col-span-1 md:row-span-1",
      iconBg: "bg-teal-100/30"
    },
    {
      icon: <Rocket className="w-12 h-12 text-rose-400" />,
      title: "Rapid Deployment",
      description: "From concept to live site in just one week, powered by AI efficiency.",
      color: "from-rose-50 to-rose-100",
      gridClass: "md:col-span-1 md:row-span-1",
      iconBg: "bg-rose-100/30"
    },
    {
      icon: <Layers className="w-12 h-12 text-purple-400" />,
      title: "Scalable Architecture",
      description: "Modular design systems that grow with your business.",
      color: "from-purple-50 to-purple-100",
      gridClass: "md:col-span-1 md:row-span-1",
      iconBg: "bg-purple-100/30"
    },
    {
      icon: <Compass className="w-12 h-12 text-emerald-400" />,
      title: "Strategic Consulting",
      description: "AI-driven insights to guide your digital transformation.",
      color: "from-emerald-50 to-emerald-100",
      gridClass: "md:col-span-1 md:row-span-1",
      iconBg: "bg-emerald-100/30"
    },
    {
      icon: <Cpu className="w-12 h-12 text-orange-400" />,
      title: "Tech Integration",
      description: "Seamless integration of cutting-edge technologies.",
      color: "from-orange-50 to-orange-100",
      gridClass: "md:col-span-1 md:row-span-1",
      iconBg: "bg-orange-100/30"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 opacity-50 blur-3xl -z-10"></div>
      
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
          Our AI-Powered Services
        </h2>
        
        <motion.div 
          className="grid md:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`${service.gridClass} group relative`}
              // onMouseEnter={() => setHoveredService(index)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <div 
                className={`
                  relative p-1 rounded-2xl 
                  bg-gradient-to-br ${service.color}
                  transform transition-all duration-300 
                  ${hoveredService === index ? '-translate-y-2 shadow-2xl' : ''}
                `}
              >
                <div 
                  className={`
                    bg-white/80 backdrop-blur-lg p-8 rounded-xl 
                    text-center relative overflow-hidden 
                    min-h-[300px] flex flex-col justify-center
                  `}
                >
                  {/* Animated Background Blob */}
                  <motion.div 
                    className={`
                      absolute -top-10 -right-10 w-24 h-24 
                      ${service.iconBg} rounded-full 
                      opacity-50 group-hover:opacity-70 
                      transition-all duration-300
                    `}
                    animate={{
                      rotate: hoveredService === index ? 360 : 0,
                      scale: hoveredService === index ? 1.2 : 1
                    }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Service Icon */}
                  <div className="flex justify-center mb-6 relative z-10">
                    <motion.div
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 10
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {service.icon}
                    </motion.div>
                  </div>

                  {/* Service Details */}
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-base">
                    {service.description}
                  </p>

                  {/* Hover CTA */}
                  <div 
                    className={`
                      absolute bottom-0 left-0 w-full 
                      bg-gradient-to-r from-indigo-500 to-rose-500 
                      text-white text-center py-2 
                      transform translate-y-full opacity-0 
                      group-hover:translate-y-0 group-hover:opacity-100 
                      transition-all duration-300
                    `}
                  >
                    Learn More
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesBentoGrid;