# Hereon Industrial - Demo App

A comprehensive React Native Expo demo application showcasing an industrial monitoring and service management platform for oil & gas, refineries, and heavy equipment industries.

## 🚀 Features

### 1. Real-Time System Health Monitoring
- Live system health scores with visual indicators
- Equipment status tracking (Operational, Warning, Critical, Offline)
- Real-time IoT sensor data display
- Automatic health score calculations

### 2. Predictive Maintenance (AI & IoT)
- AI-powered failure predictions with confidence scores
- Early fault detection and wear monitoring
- Maintenance recommendations before issues occur
- Potential savings calculations

### 3. Shutdown Alerts & Quick Response
- Critical alert notifications with priority levels
- Shutdown event tracking and history
- Emergency support request capability
- AI-powered recommendations for each alert

### 4. Prepaid Service & Balance Management
- Account balance tracking with available/pending views
- Prepaid packages:
  - $25,000 Basic Operational Support
  - $50,000 Advanced Monitoring and Maintenance
  - $100,000 Full Support with Emergency Response
- Real-time balance updates and transaction history
- Top-up functionality

### 5. Subscription & Retainership Options
- Multiple subscription tiers: Basic, Standard, Premium
- Monthly and yearly billing options
- Feature comparison across plans
- Active subscription management

### 6. Equipment Failure Detection & Service Request
- Create maintenance, repair, inspection, or emergency requests
- Priority level selection (Low, Medium, High, Critical)
- Cost estimation based on request type
- Service history and status tracking

### 7. Mobile App Features
- Dashboard with quick stats and health overview
- Equipment list with detailed sensor data
- Alert management with filtering
- Service request creation and tracking
- Account and balance management

## 📱 Screens

1. **Dashboard** - Overview of system health, alerts, AI predictions, and quick actions
2. **Equipment** - List of all equipment with health scores, sensors, and metrics
3. **Alerts** - Notification center with filtering and AI recommendations
4. **Services** - Service request management and creation
5. **Account** - Balance management, subscriptions, and transactions

## 🛠 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **UI Components**: Custom components with Expo packages
- **Styling**: StyleSheet with custom theme system
- **State Management**: React Context API

## 📦 Installation

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm or yarn
   - Expo CLI (`npm install -g expo-cli`)
   - Expo Go app on your mobile device (iOS/Android)

2. **Install Dependencies**
   ```bash
   cd hereon-demo
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   # or
   npx expo start
   ```

4. **Run on Device/Simulator**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser

## 📁 Project Structure

```
hereon-demo/
├── App.tsx                 # Main app entry point
├── app.json               # Expo configuration
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── HealthRing.tsx
│   │   ├── SensorDisplay.tsx
│   │   └── StatusBadge.tsx
│   ├── context/           # React Context for state
│   │   └── AppContext.tsx
│   ├── navigation/        # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/           # App screens
│   │   ├── DashboardScreen.tsx
│   │   ├── EquipmentScreen.tsx
│   │   ├── AlertsScreen.tsx
│   │   ├── ServicesScreen.tsx
│   │   └── AccountScreen.tsx
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts
│   └── utils/             # Utility functions and data
│       ├── mockData.ts
│       └── theme.ts
└── assets/                # Images and icons
```

## 🎨 Theme

The app uses a dark industrial theme with:
- **Primary Color**: #0A84FF (Industrial Blue)
- **Accent Color**: #FF9500 (Warning Orange)
- **Background**: #0D0D0F (Dark)
- **Status Colors**: Green (Success), Orange (Warning), Red (Critical)

## 🔧 Configuration

### Changing Company Data
Edit `src/utils/mockData.ts` to modify:
- Company information
- Equipment list
- Alerts
- Service requests
- Prepaid packages
- Subscription plans

### Customizing Theme
Edit `src/utils/theme.ts` to modify:
- Colors
- Typography
- Spacing
- Border radius
- Shadows

## 📄 License

This is a demo application for Hereon Industrial Services.

## 🤝 Support

For questions about the Hereon platform, contact the Hereon team.
