import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography, getStatusColor, getPriorityColor } from '../utils/theme';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'outlined' | 'subtle';
  showIcon?: boolean;
  style?: ViewStyle;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
  variant = 'subtle',
  showIcon = false,
  style,
}) => {
  const color = getStatusColor(status);
  
  const getIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (status) {
      case 'operational':
      case 'completed':
      case 'normal':
        return 'checkmark-circle';
      case 'warning':
      case 'pending':
        return 'warning';
      case 'critical':
      case 'shutdown':
      case 'emergency':
        return 'alert-circle';
      case 'offline':
      case 'cancelled':
        return 'close-circle';
      case 'maintenance':
      case 'in-progress':
      case 'assigned':
        return 'construct';
      default:
        return 'ellipse';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: Spacing.sm,
          paddingVertical: 2,
          fontSize: 10,
          iconSize: 10,
        };
      case 'large':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          fontSize: 14,
          iconSize: 16,
        };
      default:
        return {
          paddingHorizontal: Spacing.sm + 4,
          paddingVertical: 4,
          fontSize: 11,
          iconSize: 12,
        };
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: color,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: color,
        };
      default:
        return {
          backgroundColor: `${color}20`,
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const textColor = variant === 'filled' ? Colors.textInverse : color;

  return (
    <View
      style={[
        styles.badge,
        getVariantStyles(),
        {
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      {showIcon && (
        <Ionicons
          name={getIcon()}
          size={sizeStyles.iconSize}
          color={textColor}
          style={styles.icon}
        />
      )}
      <Text
        style={[
          styles.text,
          {
            fontSize: sizeStyles.fontSize,
            color: textColor,
          },
        ]}
      >
        {status.replace(/-/g, ' ').replace(/_/g, ' ').toUpperCase()}
      </Text>
    </View>
  );
};

interface PriorityBadgeProps {
  priority: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'medium',
  style,
}) => {
  const color = getPriorityColor(priority);
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: Spacing.sm, paddingVertical: 2, fontSize: 9 };
      case 'large':
        return { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, fontSize: 13 };
      default:
        return { paddingHorizontal: Spacing.sm + 2, paddingVertical: 3, fontSize: 10 };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.priorityBadge,
        {
          backgroundColor: `${color}25`,
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        style,
      ]}
    >
      <View style={[styles.priorityDot, { backgroundColor: color }]} />
      <Text style={[styles.text, { fontSize: sizeStyles.fontSize, color }]}>
        {priority.toUpperCase()}
      </Text>
    </View>
  );
};

interface AlertTypeBadgeProps {
  type: 'info' | 'warning' | 'critical' | 'shutdown';
  size?: 'small' | 'medium';
  style?: ViewStyle;
}

export const AlertTypeBadge: React.FC<AlertTypeBadgeProps> = ({
  type,
  size = 'medium',
  style,
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'critical':
        return { color: Colors.critical, icon: 'alert-circle' as const, label: 'CRITICAL' };
      case 'shutdown':
        return { color: Colors.critical, icon: 'power' as const, label: 'SHUTDOWN' };
      case 'warning':
        return { color: Colors.warning, icon: 'warning' as const, label: 'WARNING' };
      default:
        return { color: Colors.info, icon: 'information-circle' as const, label: 'INFO' };
    }
  };

  const config = getTypeConfig();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.alertBadge,
        {
          backgroundColor: `${config.color}20`,
          paddingHorizontal: isSmall ? Spacing.sm : Spacing.sm + 4,
          paddingVertical: isSmall ? 2 : 4,
        },
        style,
      ]}
    >
      <Ionicons
        name={config.icon}
        size={isSmall ? 10 : 12}
        color={config.color}
        style={styles.icon}
      />
      <Text
        style={[
          styles.text,
          {
            fontSize: isSmall ? 9 : 10,
            color: config.color,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
});
