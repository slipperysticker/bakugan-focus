import React from 'react';
import Svg, { Circle } from 'react-native-svg';

interface TimelineIconProps {
  completed: boolean;
}

/**
 * Timeline icon component for Progress screen
 * - Filled circle for completed days
 * - Empty circle for missed days
 */
export const TimelineIcon: React.FC<TimelineIconProps> = ({ completed }) => {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      {completed ? (
        // Filled circle for completed days
        <Circle cx={12} cy={12} r={10} fill="#3182ce" />
      ) : (
        // Empty circle for missed days
        <Circle cx={12} cy={12} r={10} stroke="#4a5568" strokeWidth={2} fill="none" />
      )}
    </Svg>
  );
};
