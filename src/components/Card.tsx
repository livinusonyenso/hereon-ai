import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity, StyleProp } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, BorderRadius, Spacing, Shadows } from '../utils/theme';

interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'gradient' | 'outlined';
  gradientColors?: string[];
  onPress?: () => void;
  padding?: keyof typeof Spacing | number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  gradientColors,
  onPress,
  padding = 'md',
}) => {
  const paddingValue = typeof padding === 'number' ? padding : Spacing[padding];
  
  const getCardStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: Colors.cardElevated,
          ...Shadows.md,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: Colors.border,
        };
      case 'gradient':
        return {};
      default:
        return {
          backgroundColor: Colors.card,
        };
    }
  };

  const content = (
    <View style={[styles.card, getCardStyle(), { padding: paddingValue }, style]}>
      {children}
    </View>
  );

  if (variant === 'gradient') {
    const defaultColors: [string, string] = [Colors.primary, Colors.primaryDark];
    const colors: [string, string, ...string[]] = gradientColors && gradientColors.length >= 2 
      ? [gradientColors[0], gradientColors[1], ...gradientColors.slice(2)]
      : defaultColors;
    
    if (onPress) {
      return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { padding: paddingValue }, style]}
          >
            {children}
          </LinearGradient>
        </TouchableOpacity>
      );
    }
    
    return (
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { padding: paddingValue }, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
});
