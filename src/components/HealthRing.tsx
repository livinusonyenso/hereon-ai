import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors, Typography, getHealthColor } from '../utils/theme';

interface HealthRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const HealthRing: React.FC<HealthRingProps> = ({
  score,
  size = 120,
  strokeWidth = 10,
  showLabel = true,
  label = 'Health',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  const healthColor = getHealthColor(score);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={healthColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={healthColor} stopOpacity="0.6" />
          </LinearGradient>
        </Defs>
        
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.backgroundTertiary}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#healthGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      <View style={styles.centerContent}>
        <Text style={[styles.scoreText, { color: healthColor }]}>
          {Math.round(score)}
        </Text>
        {showLabel && (
          <Text style={styles.labelText}>{label}</Text>
        )}
      </View>
    </View>
  );
};

interface MiniHealthRingProps {
  score: number;
  size?: number;
}

export const MiniHealthRing: React.FC<MiniHealthRingProps> = ({
  score,
  size = 44,
}) => {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;
  const healthColor = getHealthColor(score);

  return (
    <View style={[styles.miniContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.backgroundTertiary}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={healthColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.miniCenterContent}>
        <Text style={[styles.miniScoreText, { color: healthColor }]}>
          {Math.round(score)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    ...Typography.statMedium,
    color: Colors.text,
  },
  labelText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  miniContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniCenterContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniScoreText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
