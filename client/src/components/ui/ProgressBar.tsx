import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress,
  height = 8,
  color = 'bg-indigo-600',
  backgroundColor = 'bg-gray-200'
}) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    // Animate progress change
    const timer = setTimeout(() => {
      setWidth(progress);
    }, 10);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  return (
    <div 
      className={`w-full rounded-full overflow-hidden ${backgroundColor}`}
      style={{ height: `${height}px` }}
      role="progressbar" 
      aria-valuenow={progress} 
      aria-valuemin={0} 
      aria-valuemax={100}
    >
      <div 
        className={`h-full ${color} transition-all duration-300 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export default ProgressBar;