"use client"

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const SorryPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: '60%', left: '65%' });
  const [clickCount, setClickCount] = useState(0);
  const [showHearts, setShowHearts] = useState(false);

  const sorryMessages = [
    "I know I messed up, and I'm truly sorry...",
    "You mean the world to me, and I hate that I hurt you.",
    "I promise to do better because you deserve nothing but the best.",
    "Please give me another chance to make things right. ❤️"
  ];

  const getRandomPosition = () => {
    const positions = [
      { top: '20%', left: '20%' },
      { top: '20%', left: '70%' },
      { top: '70%', left: '20%' },
      { top: '70%', left: '70%' },
      { top: '40%', left: '80%' },
      { top: '80%', left: '50%' },
      { top: '30%', left: '10%' },
      { top: '60%', left: '15%' },
      { top: '15%', left: '50%' },
      { top: '75%', left: '75%' }
    ];
    return positions[Math.floor(Math.random() * positions.length)];
  };

  const handleNoClick = () => {
    setClickCount(prev => prev + 1);
    setNoButtonPosition(getRandomPosition());
    
    // Add some playful feedback
    if (clickCount === 2) {
      alert("Come on, you know you want to forgive me! ");
    } else if (clickCount === 5) {
      alert("I'll keep trying until you say yes! ");
    } else if (clickCount === 8) {
      alert("You're making this harder than it needs to be! ");
    }
  };

  const handleYesClick = () => {
    setShowHearts(true);
    setTimeout(() => {
      alert("Thank you for forgiving me! I love you so much! ");
      setShowPopup(false);
      setShowHearts(false);
      setClickCount(0);
    }, 1000);
  };

  const openPopup = () => {
    setShowPopup(true);
    setNoButtonPosition({ top: '60%', left: '65%' });
    setClickCount(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating hearts background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-stone-300 opacity-20 animate-pulse"
            size={Math.random() * 30 + 20}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Main container */}
        <div className="bg-stone-50/80 backdrop-blur-sm border border-stone-200 rounded-3xl p-12 shadow-2xl">
          {/* Animated heart */}
          <div className="mb-8">
            <Heart 
              className="mx-auto text-stone-600 animate-bounce" 
              size={80}
              fill="currentColor"
            />
          </div>

          {/* Main heading */}
          <h1 className="text-6xl font-light text-stone-800 mb-8 tracking-wider">
            I'm Sorry
          </h1>

          {/* Sorry messages */}
          <div className="space-y-4 mb-12">
            {sorryMessages.map((message, index) => (
              <p 
                key={index}
                className="text-lg text-stone-600 font-light italic leading-relaxed"
                style={{ animationDelay: `${index * 0.5}s` }}
              >
                {message}
              </p>
            ))}
          </div>

          {/* Main CTA button */}
          <button
            onClick={openPopup}
            className="group bg-stone-800 hover:bg-stone-900 text-stone-50 px-12 py-4 rounded-full text-xl font-light tracking-wide transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-3 mx-auto"
          >
            <Sparkles className="group-hover:animate-spin" size={24} />
            Click here if you're ready to forgive me
            <Sparkles className="group-hover:animate-spin" size={24} />
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-stone-50 to-amber-50 rounded-3xl p-8 max-w-md w-full relative border-2 border-stone-800 shadow-2xl">
            {/* Hearts animation when forgiven */}
            {showHearts && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <Heart
                    key={i}
                    className="absolute text-red-400 animate-ping"
                    size={30}
                    fill="currentColor"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`
                    }}
                  />
                ))}
              </div>
            )}

            <div className="text-center relative z-10">
              <Heart 
                className="mx-auto text-stone-600 mb-6" 
                size={60}
                fill="currentColor"
              />
              
              <h2 className="text-2xl font-light text-stone-800 mb-8 tracking-wide">
                Do you forgive me?
              </h2>

              <div className="relative h-32">
                {/* Yes button - always in the same place */}
                <button
                  onClick={handleYesClick}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-stone-800 hover:bg-stone-900 text-stone-50 px-8 py-3 rounded-full text-lg font-light transition-all duration-300 hover:scale-105"
                >
                  Yes, I forgive you ❤️
                </button>

                {/* No button - moves around */}
                <button
                  onClick={handleNoClick}
                  className="absolute bg-stone-300 hover:bg-stone-400 text-stone-800 px-8 py-3 rounded-full text-lg font-light transition-all duration-300 transform hover:scale-105"
                  style={{
                    top: noButtonPosition.top,
                    left: noButtonPosition.left,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  No way 😤
                </button>
              </div>

              {clickCount > 0 && (
                <p className="mt-6 text-sm text-stone-600 italic">
                  Attempts to say no: {clickCount} 
                  {clickCount > 3 && " (You're being stubborn! 😏)"}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SorryPage;