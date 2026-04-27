/**
 * @component ProgressBar
 * @epic Transversal
 * @hu HU007
 */

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: string;
  className?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  height = '8px', 
  className = '',
  showPercentage = false
}) => {
  const normalizedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-end mb-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {Math.round(normalizedProgress)}%
          </span>
        </div>
      )}
      <div 
        className="bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
        style={{ height }}
      >
        <div 
          className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-500 ease-out rounded-full"
          style={{ width: `${normalizedProgress}%` }}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
