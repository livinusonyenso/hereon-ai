import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Equipment,
  Alert,
  ServiceRequest,
  Company,
  AIPrediction,
  DashboardStats,
  Transaction,
} from '../types';
import {
  mockCompany,
  mockEquipment,
  mockAlerts,
  mockServiceRequests,
  mockAIPredictions,
  mockDashboardStats,
  mockTransactions,
} from '../utils/mockData';

interface AppContextType {
  // Data
  company: Company;
  equipment: Equipment[];
  alerts: Alert[];
  serviceRequests: ServiceRequest[];
  aiPredictions: AIPrediction[];
  dashboardStats: DashboardStats;
  transactions: Transaction[];
  
  // Actions
  markAlertAsRead: (alertId: string) => void;
  createServiceRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt'>) => void;
  updateEquipmentStatus: (equipmentId: string, status: Equipment['status']) => void;
  topUpBalance: (amount: number) => void;
  refreshData: () => void;
  
  // UI State
  isLoading: boolean;
  lastUpdated: Date;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [company, setCompany] = useState<Company>(mockCompany);
  const [equipment, setEquipment] = useState<Equipment[]>(mockEquipment);
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(mockServiceRequests);
  const [aiPredictions] = useState<AIPrediction[]>(mockAIPredictions);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>(mockDashboardStats);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate sensor value fluctuations
      setEquipment(prev => prev.map(eq => ({
        ...eq,
        iotSensors: eq.iotSensors.map(sensor => ({
          ...sensor,
          value: sensor.value + (Math.random() - 0.5) * 2,
          lastReading: new Date().toISOString(),
        })),
      })));
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const createServiceRequest = (request: Omit<ServiceRequest, 'id' | 'createdAt'>) => {
    const newRequest: ServiceRequest = {
      ...request,
      id: `sr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setServiceRequests(prev => [newRequest, ...prev]);
    
    // Deduct estimated cost from balance
    const newBalance = company.accountBalance.available - request.estimatedCost;
    setCompany(prev => ({
      ...prev,
      accountBalance: {
        ...prev.accountBalance,
        available: newBalance,
        pending: prev.accountBalance.pending + request.estimatedCost,
      },
    }));

    // Add transaction
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'deduction',
      amount: request.estimatedCost,
      description: `Service request: ${request.description.substring(0, 50)}...`,
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const updateEquipmentStatus = (equipmentId: string, status: Equipment['status']) => {
    setEquipment(prev => {
      const updatedEquipment = prev.map(eq =>
        eq.id === equipmentId ? { ...eq, status } : eq
      );
      
      // Update dashboard stats with the new equipment state
      setDashboardStats(currentStats => ({
        ...currentStats,
        operationalEquipment: updatedEquipment.filter(e => e.status === 'operational').length,
        warningEquipment: updatedEquipment.filter(e => e.status === 'warning').length,
        criticalEquipment: updatedEquipment.filter(e => e.status === 'critical').length,
      }));
      
      return updatedEquipment;
    });
  };

  const topUpBalance = (amount: number) => {
    const newBalance = company.accountBalance.available + amount;
    
    setCompany(prev => ({
      ...prev,
      accountBalance: {
        ...prev.accountBalance,
        available: newBalance,
        lastTopUp: new Date().toISOString(),
      },
    }));

    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'deposit',
      amount,
      description: 'Account top-up',
      timestamp: new Date().toISOString(),
      balanceAfter: newBalance,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const value: AppContextType = {
    company,
    equipment,
    alerts,
    serviceRequests,
    aiPredictions,
    dashboardStats,
    transactions,
    markAlertAsRead,
    createServiceRequest,
    updateEquipmentStatus,
    topUpBalance,
    refreshData,
    isLoading,
    lastUpdated,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
