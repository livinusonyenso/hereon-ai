import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IoTSensor } from '../types';
import { Colors, Spacing, Typography, BorderRadius, getStatusColor } from '../utils/theme';

interface SensorDisplayProps {
  sensor: IoTSensor;
  compact?: boolean;
}

export const SensorDisplay: React.FC<SensorDisplayProps> = ({ sensor, compact = false }) => {
  const statusColor = getStatusColor(sensor.status);
  
  const getSensorIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (sensor.type) {
      case 'temperature':
        return 'thermometer';
      case 'pressure':
        return 'speedometer';
      case 'vibration':
        return 'pulse';
      case 'flow':
        return 'water';
      case 'humidity':
        return 'water-outline';
      case 'rpm':
        return 'sync';
      default:
        return 'analytics';
    }
  };

  const formatSensorName = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={[styles.compactIconContainer, { backgroundColor: `${statusColor}20` }]}>
          <Ionicons name={getSensorIcon()} size={14} color={statusColor} />
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactLabel}>{formatSensorName(sensor.type)}</Text>
          <Text style={[styles.compactValue, { color: statusColor }]}>
            {sensor.value.toFixed(1)} {sensor.unit}
          </Text>
        </View>
      </View>
    );
  }

  const getStatusPercentage = (): number => {
    const range = sensor.threshold.critical - 0;
    const current = sensor.value;
    return Math.min((current / range) * 100, 100);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <Ionicons name={getSensorIcon()} size={16} color={statusColor} />
          <Text style={styles.label}>{formatSensorName(sensor.type)}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
      </View>
      
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color: statusColor }]}>
          {sensor.value.toFixed(1)}
        </Text>
        <Text style={styles.unit}>{sensor.unit}</Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${getStatusPercentage()}%`,
                backgroundColor: statusColor,
              },
            ]}
          />
        </View>
        <View style={styles.thresholdContainer}>
          <Text style={styles.thresholdText}>
            Warn: {sensor.threshold.warning} {sensor.unit}
          </Text>
          <Text style={styles.thresholdText}>
            Crit: {sensor.threshold.critical} {sensor.unit}
          </Text>
        </View>
      </View>
    </View>
  );
};

interface SensorGridProps {
  sensors: IoTSensor[];
}

export const SensorGrid: React.FC<SensorGridProps> = ({ sensors }) => {
  return (
    <View style={styles.grid}>
      {sensors.map((sensor) => (
        <View key={sensor.id} style={styles.gridItem}>
          <SensorDisplay sensor={sensor} />
        </View>
      ))}
    </View>
  );
};

export const CompactSensorList: React.FC<SensorGridProps> = ({ sensors }) => {
  return (
    <View style={styles.compactList}>
      {sensors.map((sensor) => (
        <SensorDisplay key={sensor.id} sensor={sensor} compact />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  value: {
    ...Typography.statSmall,
    color: Colors.text,
  },
  unit: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  progressContainer: {
    gap: Spacing.xs,
  },
  progressBackground: {
    height: 4,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  thresholdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  thresholdText: {
    ...Typography.caption,
    color: Colors.textTertiary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    flex: 1,
    minWidth: '45%',
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  compactIconContainer: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactContent: {
    flex: 1,
  },
  compactLabel: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  compactValue: {
    ...Typography.body,
    fontWeight: '600',
  },
  compactList: {
    gap: Spacing.sm,
  },
});
