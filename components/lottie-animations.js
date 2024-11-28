import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import animationData from '../public/images/tonic-lady.json';

export default function LottieAnimation() {
  const [isStopped, setIsStopped] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStopped(false);
    }, 1350);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Lottie 
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: '100%', height: '100%' }}
      initialSegment={isStopped ? [0, 0] : undefined}
    />
  );
}