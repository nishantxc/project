"use client";

import React, { useState } from "react";
import { Lightbulb, Zap, Rocket, Code, MousePointer, Star } from "lucide-react";
import BlogSection from "@/components/blogs";
import ServicesBentoGrid from "@/components/services";

const PortfolioSite = () => {
  const [activeProject, setActiveProject] = useState(null);

  const projects = [
    {
      title: "E-Commerce Fitness Startup",
      description:
        "Converted 38% more sales with AI-optimized landing page design",
      technologies: ["React", "AI Copywriting", "Conversion Optimization"],
    },
    {
      title: "SaaS Platform Launch",
      description:
        "Reduced customer acquisition cost by 22% through strategic design",
      technologies: ["Next.js", "AI Content", "SEO Optimization"],
    },
    {
      title: "Local Restaurant Digital Presence",
      description: "Increased online reservations by 45% with intuitive UI/UX",
      technologies: ["Tailwind CSS", "AI Design", "Mobile-First"],
    },
  ];

  const services = [
    {
      icon: <Zap className="w-12 h-12 text-indigo-400" />,
      title: "AI-Powered Design",
      description:
        "Leverage cutting-edge AI to create visually stunning, conversion-focused designs.",
    },
    {
      icon: <Code className="w-12 h-12 text-teal-400" />,
      title: "Optimized Development",
      description:
        "Clean, responsive code that loads fast and looks perfect on all devices.",
    },
    {
      icon: <Rocket className="w-12 h-12 text-rose-400" />,
      title: "Rapid Deployment",
      description:
        "From concept to live site in just one week, powered by AI efficiency.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 text-gray-800 font-['Inter'] overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-blue-100/20 to-purple-100/30 opacity-50 blur-3xl -z-10"></div>
        <div className="text-center max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500 animate-gradient-x">
            Kickstart your dream project today!
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Transforming Small Business and Websites with AI-Driven Design and
            Development
          </p>
          <button className="group relative px-8 py-3 rounded-full overflow-hidden border border-indigo-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <span className="relative z-10 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-600 group-hover:from-indigo-700 group-hover:to-rose-700 transition-all">
              Start Your Project
            </span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-indigo-200 to-rose-200 transition-all duration-300"></span>
          </button>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-pink-50/30 to-blue-50/20 opacity-50 blur-3xl -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
            Recent Projects
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group relative p-1 rounded-2xl bg-gradient-to-br from-white/50 to-purple-100 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
                // onMouseEnter={() => setActiveProject(project)}
                onMouseLeave={() => setActiveProject(null)}
              >
                <div className="bg-white/80 h-[35vh] backdrop-blur-lg p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-indigo-100 to-rose-100 rounded-full opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 relative z-10">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4 relative z-10">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 relative z-10">
                    {project.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gradient-to-br from-indigo-100 to-rose-100 px-3 py-1 rounded-full text-xs text-gray-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services Section */}
      {/* <div className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/20 opacity-50 blur-3xl -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
            Our AI-Powered Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative p-1 rounded-2xl bg-gradient-to-br from-white/50 to-purple-100/30 transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl text-center relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-100 to-rose-100 rounded-full opacity-50 group-hover:opacity-70 transition-all duration-300"></div>
                  <div className="flex justify-center mb-6 relative z-10">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
      <ServicesBentoGrid />

      {/* Blog Section */}
      <BlogSection />

      {/* Call to Action */}
      <div className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-purple-50/30 to-blue-50/20 opacity-50 blur-3xl -z-10"></div>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">
            Ready to Transform Your Online Presence?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Let's create a landing page that turns visitors into customers
          </p>
          <button className="group relative px-10 py-4 rounded-full overflow-hidden border border-indigo-200 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <span className="relative z-10 text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-600 group-hover:from-indigo-700 group-hover:to-rose-700 transition-all">
              Get Started Now
            </span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-r from-indigo-200 to-rose-200 transition-all duration-300"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioSite;
