import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing, Typography, Shadows } from '../utils/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          fontSize: 13,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.md,
          fontSize: 17,
          iconSize: 22,
        };
      default:
        return {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm + 4,
          fontSize: 15,
          iconSize: 18,
        };
    }
  };

  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: Colors.backgroundTertiary,
          },
          text: {
            color: Colors.text,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: Colors.primary,
          },
          text: {
            color: Colors.primary,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
          },
          text: {
            color: Colors.primary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: Colors.critical,
          },
          text: {
            color: Colors.text,
          },
        };
      default:
        return {
          container: {},
          text: {
            color: Colors.text,
          },
        };
    }
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();
  const isDisabled = disabled || loading;

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {loading ? (
        <ActivityIndicator
          color={variantStyles.text.color}
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.text.color as string}
              style={styles.iconLeft}
            />
          )}
          <Text
            style={[
              styles.text,
              { fontSize: sizeStyles.fontSize },
              variantStyles.text,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={sizeStyles.iconSize}
              color={variantStyles.text.color as string}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </View>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}
        style={[fullWidth && styles.fullWidth, style]}
      >
        <LinearGradient
          colors={isDisabled ? [Colors.textTertiary, Colors.textTertiary] : [Colors.primary, Colors.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.button,
            {
              paddingHorizontal: sizeStyles.paddingHorizontal,
              paddingVertical: sizeStyles.paddingVertical,
            },
            isDisabled && styles.disabled,
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        variantStyles.container,
        {
          paddingHorizontal: sizeStyles.paddingHorizontal,
          paddingVertical: sizeStyles.paddingVertical,
        },
        isDisabled && styles.disabled,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 24,
  color = Colors.text,
  backgroundColor = Colors.backgroundTertiary,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.iconButton,
        {
          width: size + 16,
          height: size + 16,
          backgroundColor,
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  iconButton: {
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
