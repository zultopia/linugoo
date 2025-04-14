'use client';

import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface CircleProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const CircleProgress: React.FC<CircleProgressProps> = ({
  percentage,
  size = 80,
  strokeWidth = 10,
  color = "#4CAF50",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = ((100 - percentage) / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle stroke="#E0E0E0" fill="none" cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} />
        {/* Progress Circle */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
        />
        {/* Percentage value is displayed separately, not inside SVG */}
      </Svg>
    </View>
  );
};

export default CircleProgress;