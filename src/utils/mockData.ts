import {
  Equipment,
  Alert,
  ServiceRequest,
  PrepaidPackage,
  Subscription,
  Transaction,
  Company,
  AIPrediction,
  DashboardStats,
} from '../types';

// Mock Company Data
export const mockCompany: Company = {
  id: 'comp-001',
  name: 'Apex Petroleum Corp',
  industry: 'oil_gas',
  accountBalance: {
    available: 67450.00,
    pending: 2500.00,
    totalSpent: 182550.00,
    lastTopUp: '2024-01-10T14:30:00Z',
  },
  subscription: {
    id: 'sub-001',
    name: 'Premium Industrial',
    tier: 'premium',
    price: 8500,
    billingCycle: 'monthly',
    features: [
      '24/7 AI Monitoring',
      'Unlimited Service Requests',
      'Priority Emergency Response',
      'Advanced Analytics Dashboard',
      'Predictive Maintenance AI',
      'Dedicated Account Manager',
    ],
    isActive: true,
  },
  equipmentCount: 24,
  activeAlerts: 3,
};

// Mock Equipment Data
export const mockEquipment: Equipment[] = [
  {
    id: 'eq-001',
    name: 'Main Compressor Unit A',
    type: 'compressor',
    location: 'Processing Plant - Section A',
    healthScore: 94,
    status: 'operational',
    lastMaintenance: '2024-01-05T08:00:00Z',
    nextMaintenance: '2024-02-05T08:00:00Z',
    iotSensors: [
      {
        id: 'sen-001',
        type: 'temperature',
        value: 82,
        unit: '°F',
        threshold: { warning: 95, critical: 110 },
        status: 'normal',
        lastReading: '2024-01-15T10:30:00Z',
      },
      {
        id: 'sen-002',
        type: 'pressure',
        value: 145,
        unit: 'PSI',
        threshold: { warning: 160, critical: 180 },
        status: 'normal',
        lastReading: '2024-01-15T10:30:00Z',
      },
      {
        id: 'sen-003',
        type: 'vibration',
        value: 2.1,
        unit: 'mm/s',
        threshold: { warning: 4.5, critical: 7.0 },
        status: 'normal',
        lastReading: '2024-01-15T10:30:00Z',
      },
    ],
    metrics: {
      uptime: 99.2,
      efficiency: 92.5,
      energyConsumption: 1250,
      operatingHours: 8640,
    },
  },
  {
    id: 'eq-002',
    name: 'Turbine Generator #3',
    type: 'turbine',
    location: 'Power Station - Bay 3',
    healthScore: 78,
    status: 'warning',
    lastMaintenance: '2023-12-15T08:00:00Z',
    nextMaintenance: '2024-01-20T08:00:00Z',
    iotSensors: [
      {
        id: 'sen-004',
        type: 'temperature',
        value: 198,
        unit: '°F',
        threshold: { warning: 190, critical: 220 },
        status: 'warning',
        lastReading: '2024-01-15T10:30:00Z',
      },
      {
        id: 'sen-005',
        type: 'rpm',
        value: 3580,
        unit: 'RPM',
        threshold: { warning: 3600, critical: 3800 },
        status: 'normal',
        lastReading: '2024-01-15T10:30:00Z',
      },
      {
        id: 'sen-006',
        type: 'vibration',
        value: 4.8,
        unit: 'mm/s',
        threshold: { warning: 4.5, critical: 7.0 },
        status: 'warning',
        lastReading: '2024-01-15T10:30:00Z',
      },
    ],
    metrics: {
      uptime: 96.8,
      efficiency: 88.2,
      energyConsumption: 3200,
      operatingHours: 12450,
    },
  },
  {
    id: 'eq-003',
    name: 'Crude Oil Pump P-102',
    type: 'pump',
    location: 'Transfer Station - Unit B',
    healthScore: 45,
    status: 'critical',
    lastMaintenance: '2023-11-20T08:00:00Z',
    nextMaintenance: '2024-01-16T08:00:00Z',
    iotSensors: [
      {
        id: 'sen-007',
        type: 'pressure',
        value: 172,
        unit: 'PSI',
        threshold: { warning: 160, critical: 180 },
        status: 'critical',
        lastReading: '2024-01-15T10:30:00Z',
      },
      {
        id: 'sen-008',
        type: 'flow',
        value: 850,
        unit: 'GPM',
        threshold: { warning: 1000, critical: 750 },
        status: 'warning',
        lastReading: '2024-01-15T10:30:00Z',
      },
      {
        id: 'sen-009',
        type: 'temperature',
        value: 156,
        unit: '°F',
        threshold: { warning: 140, critical: 165 },
        status: 'critical',
        lastReading: '2024-01-15T10:30:00Z',
      },
    ],
    metrics: {
      uptime: 82.1,
      efficiency: 71.5,
      energyConsumption: 890,
      operatingHours: 9200,
    },
  },
  {
    id: 'eq-004',
    name: 'Control Valve CV-45',
    type: 'valve',
    location: 'Pipeline Junction - Alpha',
    healthScore: 98,
    status: 'operational',
    lastMaintenance: '2024-01-10T08:00:00Z',
    nextMaintenance: '2024-04-10T08:00:00Z',
    iotSensors: [
      {
        id: 'sen-010',
        type: 'pressure',
        value: 95,
        unit: 'PSI',
        threshold: { warning: 120, critical: 150 },
        status: 'normal',
        lastReading: '2024-01-15T10:30:00Z',
      },
    ],
    metrics: {
      uptime: 99.9,
      efficiency: 99.1,
      energyConsumption: 45,
      operatingHours: 6500,
    },
  },
  {
    id: 'eq-005',
    name: 'Diesel Generator DG-01',
    type: 'generator',
    location: 'Emergency Power - Building C',
    healthScore: 89,
    status: 'operational',
    lastMaintenance: '2024-01-02T08:00:00Z',
    nextMaintenance: '2024-03-02T08:00:00Z',
    iotSensors: [
      {
        id: 'sen-011',
        type: 'temperature',
        value: 175,
        unit: '°F',
        threshold: { warning: 200, critical: 230 },
        status: 'normal',
        lastReading: '2024-01-15T10:30:00Z',
      },
      {
        id: 'sen-012',
        type: 'rpm',
        value: 1800,
        unit: 'RPM',
        threshold: { warning: 1900, critical: 2100 },
        status: 'normal',
        lastReading: '2024-01-15T10:30:00Z',
      },
    ],
    metrics: {
      uptime: 99.5,
      efficiency: 94.2,
      energyConsumption: 450,
      operatingHours: 2100,
    },
  },
  {
    id: 'eq-006',
    name: 'Industrial Motor M-220',
    type: 'motor',
    location: 'Assembly Line - Zone 4',
    healthScore: 0,
    status: 'offline',
    lastMaintenance: '2024-01-12T08:00:00Z',
    nextMaintenance: '2024-01-18T08:00:00Z',
    iotSensors: [
      {
        id: 'sen-013',
        type: 'temperature',
        value: 0,
        unit: '°F',
        threshold: { warning: 180, critical: 210 },
        status: 'normal',
        lastReading: '2024-01-12T15:30:00Z',
      },
    ],
    metrics: {
      uptime: 0,
      efficiency: 0,
      energyConsumption: 0,
      operatingHours: 4500,
    },
  },
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-001',
    equipmentId: 'eq-003',
    equipmentName: 'Crude Oil Pump P-102',
    type: 'critical',
    title: 'Critical Pressure Alert',
    message: 'Pump pressure has exceeded critical threshold at 172 PSI. Immediate inspection required.',
    timestamp: '2024-01-15T10:28:00Z',
    isRead: false,
    requiresAction: true,
    aiRecommendation: 'Recommend immediate shutdown and seal inspection. Historical data suggests potential bearing failure within 24-48 hours.',
  },
  {
    id: 'alert-002',
    equipmentId: 'eq-002',
    equipmentName: 'Turbine Generator #3',
    type: 'warning',
    title: 'Elevated Temperature Warning',
    message: 'Operating temperature trending above normal parameters. Current: 198°F',
    timestamp: '2024-01-15T09:45:00Z',
    isRead: false,
    requiresAction: true,
    aiRecommendation: 'Schedule maintenance within 5 days. Cooling system inspection recommended.',
  },
  {
    id: 'alert-003',
    equipmentId: 'eq-002',
    equipmentName: 'Turbine Generator #3',
    type: 'warning',
    title: 'Vibration Anomaly Detected',
    message: 'Vibration levels have increased to 4.8 mm/s, exceeding warning threshold.',
    timestamp: '2024-01-15T08:30:00Z',
    isRead: true,
    requiresAction: false,
    aiRecommendation: 'Monitor closely. If vibration exceeds 6.0 mm/s, shutdown recommended.',
  },
  {
    id: 'alert-004',
    equipmentId: 'eq-001',
    equipmentName: 'Main Compressor Unit A',
    type: 'info',
    title: 'Scheduled Maintenance Reminder',
    message: 'Routine maintenance scheduled for February 5th, 2024.',
    timestamp: '2024-01-15T06:00:00Z',
    isRead: true,
    requiresAction: false,
  },
  {
    id: 'alert-005',
    equipmentId: 'eq-006',
    equipmentName: 'Industrial Motor M-220',
    type: 'shutdown',
    title: 'Emergency Shutdown Executed',
    message: 'Motor was shut down due to overheating. Maintenance team dispatched.',
    timestamp: '2024-01-12T15:30:00Z',
    isRead: true,
    requiresAction: false,
    aiRecommendation: 'Full motor inspection required. Potential winding damage detected.',
  },
];

// Mock Service Requests
export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'sr-001',
    equipmentId: 'eq-003',
    equipmentName: 'Crude Oil Pump P-102',
    type: 'emergency',
    priority: 'critical',
    status: 'assigned',
    description: 'Emergency inspection and repair required due to critical pressure readings.',
    createdAt: '2024-01-15T10:35:00Z',
    estimatedCost: 4500,
    assignedTechnician: 'John Martinez',
  },
  {
    id: 'sr-002',
    equipmentId: 'eq-002',
    equipmentName: 'Turbine Generator #3',
    type: 'maintenance',
    priority: 'high',
    status: 'pending',
    description: 'Cooling system inspection and vibration analysis required.',
    createdAt: '2024-01-15T09:50:00Z',
    estimatedCost: 2800,
  },
  {
    id: 'sr-003',
    equipmentId: 'eq-006',
    equipmentName: 'Industrial Motor M-220',
    type: 'repair',
    priority: 'high',
    status: 'in-progress',
    description: 'Motor rewinding and bearing replacement after emergency shutdown.',
    createdAt: '2024-01-12T16:00:00Z',
    estimatedCost: 8500,
    assignedTechnician: 'Sarah Chen',
  },
  {
    id: 'sr-004',
    equipmentId: 'eq-001',
    equipmentName: 'Main Compressor Unit A',
    type: 'inspection',
    priority: 'low',
    status: 'completed',
    description: 'Routine quarterly inspection and filter replacement.',
    createdAt: '2024-01-05T08:00:00Z',
    estimatedCost: 850,
    assignedTechnician: 'Mike Thompson',
  },
];

// Mock Prepaid Packages
export const mockPrepaidPackages: PrepaidPackage[] = [
  {
    id: 'pkg-001',
    name: 'Basic Operational',
    price: 25000,
    description: 'Essential monitoring and support for small-scale operations',
    features: [
      'Basic equipment monitoring',
      'Standard response time (24-48 hrs)',
      'Monthly health reports',
      'Email support',
      'Up to 10 equipment units',
    ],
  },
  {
    id: 'pkg-002',
    name: 'Advanced Monitoring',
    price: 50000,
    description: 'Enhanced monitoring with predictive maintenance',
    features: [
      'Real-time AI monitoring',
      'Priority response time (4-8 hrs)',
      'Weekly health reports',
      'Phone & email support',
      'Up to 25 equipment units',
      'Predictive maintenance alerts',
      'Custom dashboards',
    ],
    recommended: true,
  },
  {
    id: 'pkg-003',
    name: 'Full Industrial',
    price: 100000,
    description: 'Complete support with emergency response and AI analysis',
    features: [
      '24/7 AI monitoring & analysis',
      'Emergency response (< 2 hrs)',
      'Daily health reports',
      'Dedicated account manager',
      'Unlimited equipment units',
      'Advanced predictive AI',
      'Custom integrations',
      'On-site emergency team',
      'Annual equipment audit',
    ],
  },
];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-basic',
    name: 'Basic',
    tier: 'basic',
    price: 2500,
    billingCycle: 'monthly',
    features: [
      'Equipment monitoring',
      'Basic alerts',
      'Monthly reports',
      'Email support',
    ],
    isActive: false,
  },
  {
    id: 'sub-standard',
    name: 'Standard',
    tier: 'standard',
    price: 5500,
    billingCycle: 'monthly',
    features: [
      'Real-time monitoring',
      'AI-powered alerts',
      'Weekly reports',
      'Priority support',
      'Predictive maintenance',
    ],
    isActive: false,
  },
  {
    id: 'sub-premium',
    name: 'Premium',
    tier: 'premium',
    price: 8500,
    billingCycle: 'monthly',
    features: [
      '24/7 AI monitoring',
      'Unlimited requests',
      'Emergency response',
      'Advanced analytics',
      'Predictive AI',
      'Dedicated manager',
    ],
    isActive: true,
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    type: 'deposit',
    amount: 50000,
    description: 'Prepaid package top-up - Advanced Monitoring',
    timestamp: '2024-01-10T14:30:00Z',
    balanceAfter: 67450,
  },
  {
    id: 'txn-002',
    type: 'deduction',
    amount: 850,
    description: 'Service: Routine inspection - Compressor Unit A',
    timestamp: '2024-01-05T16:00:00Z',
    balanceAfter: 17450,
  },
  {
    id: 'txn-003',
    type: 'deduction',
    amount: 8500,
    description: 'Monthly subscription - Premium Industrial',
    timestamp: '2024-01-01T00:00:00Z',
    balanceAfter: 18300,
  },
  {
    id: 'txn-004',
    type: 'deposit',
    amount: 25000,
    description: 'Prepaid package top-up - Basic Operational',
    timestamp: '2023-12-20T10:00:00Z',
    balanceAfter: 26800,
  },
  {
    id: 'txn-005',
    type: 'deduction',
    amount: 3200,
    description: 'Emergency service: Pump P-102 inspection',
    timestamp: '2023-12-18T14:30:00Z',
    balanceAfter: 1800,
  },
];

// Mock AI Predictions
export const mockAIPredictions: AIPrediction[] = [
  {
    id: 'pred-001',
    equipmentId: 'eq-003',
    equipmentName: 'Crude Oil Pump P-102',
    predictionType: 'failure',
    confidence: 87,
    predictedDate: '2024-01-17T00:00:00Z',
    recommendation: 'Replace mechanical seals and inspect impeller. High probability of seal failure based on pressure and temperature trends.',
    potentialSavings: 45000,
    severity: 'high',
  },
  {
    id: 'pred-002',
    equipmentId: 'eq-002',
    equipmentName: 'Turbine Generator #3',
    predictionType: 'maintenance',
    confidence: 72,
    predictedDate: '2024-01-25T00:00:00Z',
    recommendation: 'Schedule cooling system maintenance. Temperature trends indicate reduced cooling efficiency.',
    potentialSavings: 12000,
    severity: 'medium',
  },
  {
    id: 'pred-003',
    equipmentId: 'eq-001',
    equipmentName: 'Main Compressor Unit A',
    predictionType: 'optimization',
    confidence: 91,
    predictedDate: '2024-02-01T00:00:00Z',
    recommendation: 'Adjust operating parameters to improve efficiency by 5-8%. Current settings are suboptimal for load patterns.',
    potentialSavings: 8500,
    severity: 'low',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalEquipment: 24,
  operationalEquipment: 20,
  warningEquipment: 2,
  criticalEquipment: 1,
  overallHealth: 87,
  activeAlerts: 3,
  pendingRequests: 2,
  monthlySpend: 12150,
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// Helper function to format time
export const formatTime = (dateString: string): string => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Helper function to format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
};
