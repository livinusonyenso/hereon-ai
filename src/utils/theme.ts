// Hereon Industrial Theme - Dark industrial aesthetic with accent colors
export const Colors = {
  // Primary palette - Industrial Blue
  primary: '#0A84FF',
  primaryDark: '#0066CC',
  primaryLight: '#4DA3FF',
  
  // Accent - Warning Orange for industrial alerts
  accent: '#FF9500',
  accentLight: '#FFB340',
  
  // Status Colors
  success: '#30D158',
  warning: '#FF9F0A',
  critical: '#FF453A',
  info: '#64D2FF',
  
  // Background - Dark industrial theme
  background: '#0D0D0F',
  backgroundSecondary: '#1C1C1E',
  backgroundTertiary: '#2C2C2E',
  card: '#1C1C1E',
  cardElevated: '#2C2C2E',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#8E8E93',
  textTertiary: '#636366',
  textInverse: '#000000',
  
  // Borders
  border: '#38383A',
  borderLight: '#48484A',
  
  // Health Score Gradient
  healthExcellent: '#30D158',
  healthGood: '#34C759',
  healthWarning: '#FF9F0A',
  healthCritical: '#FF453A',
  
  // Equipment Status
  operational: '#30D158',
  maintenance: '#0A84FF',
  offline: '#8E8E93',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Typography = {
  // Headers
  h1: {
    fontSize: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 22,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.1,
  },
  // Body
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  // Labels
  label: {
    fontSize: 12,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    letterSpacing: 0.3,
  },
  // Numbers/Stats
  statLarge: {
    fontSize: 48,
    fontWeight: '700' as const,
    letterSpacing: -1,
  },
  statMedium: {
    fontSize: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
  },
  statSmall: {
    fontSize: 24,
    fontWeight: '600' as const,
    letterSpacing: -0.3,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  }),
};

export const getHealthColor = (score: number): string => {
  if (score >= 90) return Colors.healthExcellent;
  if (score >= 70) return Colors.healthGood;
  if (score >= 50) return Colors.healthWarning;
  return Colors.healthCritical;
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'operational':
    case 'normal':
    case 'completed':
      return Colors.success;
    case 'warning':
    case 'pending':
    case 'assigned':
      return Colors.warning;
    case 'critical':
    case 'shutdown':
    case 'emergency':
      return Colors.critical;
    case 'offline':
    case 'cancelled':
      return Colors.textTertiary;
    case 'maintenance':
    case 'in-progress':
    case 'info':
      return Colors.primary;
    default:
      return Colors.textSecondary;
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'critical':
      return Colors.critical;
    case 'high':
      return Colors.warning;
    case 'medium':
      return Colors.primary;
    case 'low':
      return Colors.success;
    default:
      return Colors.textSecondary;
  }
};
