import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  const healthColor = getHealthColor(score);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View 
        style={[
          styles.ring, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: Colors.backgroundTertiary,
          }
        ]}
      />
      <View 
        style={[
          styles.progressRing, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: healthColor,
            borderTopColor: healthColor,
            borderRightColor: score > 25 ? healthColor : 'transparent',
            borderBottomColor: score > 50 ? healthColor : 'transparent',
            borderLeftColor: score > 75 ? healthColor : 'transparent',
            transform: [{ rotate: '-45deg' }],
          }
        ]}
      />
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
  const healthColor = getHealthColor(score);

  return (
    <View style={[styles.miniContainer, { width: size, height: size }]}>
      <View 
        style={[
          styles.ring, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: Colors.backgroundTertiary,
          }
        ]}
      />
      <View 
        style={[
          styles.progressRing, 
          { 
            width: size, 
            height: size, 
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: healthColor,
            borderTopColor: healthColor,
            borderRightColor: score > 25 ? healthColor : 'transparent',
            borderBottomColor: score > 50 ? healthColor : 'transparent',
            borderLeftColor: score > 75 ? healthColor : 'transparent',
            transform: [{ rotate: '-45deg' }],
          }
        ]}
      />
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
  ring: {
    position: 'absolute',
  },
  progressRing: {
    position: 'absolute',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: '600',
    color: Colors.text,
  },
  labelText: {
    fontSize: 11,
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
