"use client";

import { useEffect, useRef } from 'react';

const CameraTest = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();
  }, []);

  return (
    <div className="p-6">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full max-w-md aspect-video rounded-lg shadow-lg"
      />
    </div>
  );
};

export default CameraTest;