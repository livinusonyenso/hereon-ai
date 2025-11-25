// Equipment and Asset Types
export interface Equipment {
  id: string;
  name: string;
  type: 'pump' | 'compressor' | 'turbine' | 'valve' | 'sensor' | 'motor' | 'generator';
  location: string;
  healthScore: number;
  status: 'operational' | 'warning' | 'critical' | 'offline' | 'maintenance';
  lastMaintenance: string;
  nextMaintenance: string;
  iotSensors: IoTSensor[];
  metrics: EquipmentMetrics;
}

export interface IoTSensor {
  id: string;
  type: 'temperature' | 'pressure' | 'vibration' | 'flow' | 'humidity' | 'rpm';
  value: number;
  unit: string;
  threshold: {
    warning: number;
    critical: number;
  };
  status: 'normal' | 'warning' | 'critical';
  lastReading: string;
}

export interface EquipmentMetrics {
  uptime: number;
  efficiency: number;
  energyConsumption: number;
  operatingHours: number;
}

// Alert Types
export interface Alert {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'info' | 'warning' | 'critical' | 'shutdown';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  requiresAction: boolean;
  aiRecommendation?: string;
}

// Service Request Types
export interface ServiceRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: 'maintenance' | 'emergency' | 'inspection' | 'repair';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  createdAt: string;
  estimatedCost: number;
  assignedTechnician?: string;
}

// Financial Types
export interface PrepaidPackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export interface Subscription {
  id: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium';
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'deduction' | 'refund';
  amount: number;
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export interface AccountBalance {
  available: number;
  pending: number;
  totalSpent: number;
  lastTopUp: string;
}

// Company/User Types
export interface Company {
  id: string;
  name: string;
  industry: 'oil_gas' | 'refinery' | 'industrial' | 'construction' | 'manufacturing';
  logo?: string;
  accountBalance: AccountBalance;
  subscription?: Subscription;
  equipmentCount: number;
  activeAlerts: number;
}

// AI Prediction Types
export interface AIPrediction {
  id: string;
  equipmentId: string;
  equipmentName: string;
  predictionType: 'failure' | 'maintenance' | 'optimization';
  confidence: number;
  predictedDate: string;
  recommendation: string;
  potentialSavings: number;
  severity: 'low' | 'medium' | 'high';
}

// Dashboard Stats
export interface DashboardStats {
  totalEquipment: number;
  operationalEquipment: number;
  warningEquipment: number;
  criticalEquipment: number;
  overallHealth: number;
  activeAlerts: number;
  pendingRequests: number;
  monthlySpend: number;
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  EquipmentDetail: { equipmentId: string };
  AlertDetail: { alertId: string };
  ServiceRequestDetail: { requestId: string };
  TopUp: undefined;
  SubscriptionDetail: { subscriptionId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Equipment: undefined;
  Alerts: undefined;
  Services: undefined;
  Account: undefined;
};
