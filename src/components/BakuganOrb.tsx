import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Polygon, G, Defs, RadialGradient, Stop } from 'react-native-svg';

interface BakuganOrbProps {
  power: number;
}

/**
 * Bakugan-inspired orb component with SVG design
 * Features:
 * - Hexagonal core with radial gradient
 * - Two rotating rings
 * - 6 energy dots around hexagon
 * - Color changes based on power level
 */
export const BakuganOrb: React.FC<BakuganOrbProps> = ({ power }) => {
  /**
   * Get orb color based on power level
   * Color progression represents player's journey
   */
  const getOrbColor = (power: number): string => {
    if (power < 10) return '#4a5568';   // Gray - Beginner
    if (power < 30) return '#3182ce';   // Blue - Novice
    if (power < 60) return '#38a169';   // Green - Intermediate
    if (power < 100) return '#d69e2e';  // Gold - Advanced
    if (power < 200) return '#e53e3e';  // Red - Expert
    return '#9f7aea';                   // Purple - Master
  };

  const orbColor = getOrbColor(power);
  const size = 200;
  const center = size / 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* Radial gradient for orb glow effect */}
          <RadialGradient id="orbGradient" cx="50%" cy="50%">
            <Stop offset="0%" stopColor={orbColor} stopOpacity="1" />
            <Stop offset="70%" stopColor={orbColor} stopOpacity="0.6" />
            <Stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.2" />
          </RadialGradient>
        </Defs>

        {/* Outer ring */}
        <Circle
          cx={center}
          cy={center}
          r={90}
          stroke={orbColor}
          strokeWidth={2}
          fill="none"
          opacity={0.3}
        />

        {/* Middle ring */}
        <Circle
          cx={center}
          cy={center}
          r={70}
          stroke={orbColor}
          strokeWidth={3}
          fill="none"
          opacity={0.5}
        />

        {/* Core hexagon */}
        <G>
          <Polygon
            points={`${center},${center - 50} ${center + 43},${center - 25} ${center + 43},${center + 25} ${center},${center + 50} ${center - 43},${center + 25} ${center - 43},${center - 25}`}
            fill="url(#orbGradient)"
            stroke={orbColor}
            strokeWidth={4}
          />
        </G>

        {/* Inner core circle */}
        <Circle
          cx={center}
          cy={center}
          r={25}
          fill={orbColor}
          opacity={0.8}
        />

        {/* Energy dots (6 around hexagon) */}
        {[0, 60, 120, 180, 240, 300].map((angle, index) => {
          const rad = (angle * Math.PI) / 180;
          const x = center + 60 * Math.cos(rad);
          const y = center + 60 * Math.sin(rad);
          return (
            <Circle
              key={index}
              cx={x}
              cy={y}
              r={4}
              fill={orbColor}
              opacity={0.9}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
