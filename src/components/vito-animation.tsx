"use client";

import Lottie from "lottie-react";
import vitoAnimationData from "../../Vito_landing.json";

interface VitoAnimationProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function VitoAnimation({ 
  width = 300, 
  height = 400, 
  className = "" 
}: VitoAnimationProps) {
  return (
    <div className={`flex justify-center ${className}`}>
      <Lottie
        animationData={vitoAnimationData}
        style={{ width, height }}
        loop={true}
        autoplay={true}
      />
    </div>
  );
}
