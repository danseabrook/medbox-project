import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Pill, Settings, History, Plus, Save, Trash2, Send, User, Shield, Grid, Eye, Activity, Users, Phone, Bell, AlertTriangle, CheckCircle, Edit3 } from 'lucide-react';


// AWS Configuration
const AWS_CONFIG = {
  apiUrl: 'https://2p3qi4n5sag53lv3h5iyze6jt40bmuyu.lambda-url.eu-west-2.on.aws',
  deviceId: 'esp32-B31EEC',
  userId: 'patient123'
};

// Main App Component
const MedBoxApp = () => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const [user] = useState({
    userId: 'patient123',
    name: 'John Doe',
    email: 'john@email.com',
    timezone: 'GMT0BST,M3.5.0/1,M10.5.0',
    devices: ['esp32-B31EEC'],
    caregivers: [
      { id: 'caregiver456', name: 'Dr. Sarah Wilson', email: 'dr.wilson@clinic.com', role: 'Doctor' },
      { id: 'caregiver789', name: 'Mary Doe', email: 'mary.doe@email.com', role: 'Family' }
    ]
  });

  const [medicationLibrary, setMedicationLibrary] = useState([
    { id: 'med-1', name: 'Vitamin D', defaultDosage: '1000 IU', notes: 'Take with food' },
    { id: 'med-2', name: 'Blood Pressure Medication', defaultDosage: '10mg', notes: 'Twice daily' },
    { id: 'med-3', name: 'Calcium', defaultDosage: '500mg', notes: 'Take with meals' },
    { id: 'med-4', name: 'Aspirin', defaultDosage: '81mg', notes: 'Low dose' }
  ]);

  const [compartmentConfig, setCompartmentConfig] = useState({
    'Mon-AM': { 
      medication: 'Blood Pressure Medication', 
      dosage: '10mg', 
      time: '07:30',
      notes: 'Take with breakfast',
      enabled: true,
      adherenceRate: 88
    },
    'Mon-PM': { 
      medication: 'Blood Pressure Medication', 
      dosage: '10mg', 
      time: '19:30',
      notes: 'Take with dinner',
      enabled: true,
      adherenceRate: 88
    },
    'Wed-AM': { 
      medication: 'Vitamin D', 
      dosage: '1000 IU', 
      time: '08:00',
      notes: 'Take with food',
      enabled: true,
      adherenceRate: 92
    },
    'Fri-AM': { 
      medication: 'Vitamin D', 
      dosage: '1000 IU', 
      time: '08:00',
      notes: 'Take with food',
      enabled: true,
      adherenceRate: 92
    }
  });

  // Real-time device data
  const [deviceData, setDeviceData] = useState(null);
  const [alerts] = useState([
    {
      alertId: 'alert-1',
      type: 'missed_medication',
      severity: 'high',
      medication: 'Blood Pressure Medication',
      compartment: 'Tue-PM',
      timestamp: '2025-06-03T19:30:00Z',
      acknowledged: false,
      description: 'Medication not taken for 2 hours past scheduled time'
    }
  ]);

  // Fetch real device data
  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        const response = await fetch(AWS_CONFIG.apiUrl);
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          setDeviceData(result.data[0]); // Latest device status
        }
      } catch (error) {
        console.error('Failed to fetch device data:', error);
      }
    };

    fetchDeviceData();
    const interval = setInterval(fetchDeviceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getNavItems = () => {
    return [
      { id: 'overview', label: 'Overview', icon: Grid },
      { id: 'compartments', label: 'Compartments', icon: Eye },
      { id: 'medications', label: 'Medications', icon: Pill },
      { id: 'history', label: 'History', icon: History },
      { id: 'caregivers', label: 'Caregivers', icon: Users },
      { id: 'settings', label: 'Settings', icon: Settings }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">MedBox Pro</h1>
                <p className="text-sm text-gray-600">14-Compartment Medication System</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">👤 {user.name}</span>
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700">
                  {deviceData ? 'Device Online' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {getNavItems().map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 transition-colors ${
                    isActive 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <OverviewDashboard 
            compartmentConfig={compartmentConfig}
            alerts={alerts}
            deviceData={deviceData}
          />
        )}
        
        {activeTab === 'compartments' && (
          <CompartmentManager 
            compartmentConfig={compartmentConfig}
            setCompartmentConfig={setCompartmentConfig}
            medicationLibrary={medicationLibrary}
            deviceData={deviceData}
          />
        )}

        {activeTab === 'medications' && (
          <MedicationLibrary 
            medicationLibrary={medicationLibrary}
            setMedicationLibrary={setMedicationLibrary}
          />
        )}
        
        {activeTab === 'history' && (
          <HistoryView deviceData={deviceData} />
        )}

        {activeTab === 'caregivers' && (
          <CaregiverManagement user={user} />
        )}
        
        {activeTab === 'settings' && (
          <SettingsPanel user={user} deviceData={deviceData} />
        )}
      </main>
    </div>
  );
};

// Overview Dashboard with Real Device Data
const OverviewDashboard = ({ compartmentConfig, alerts, deviceData }) => {
  const getTodaysCompartments = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
    const todayCompartments = Object.entries(compartmentConfig)
      .filter(([compartment, config]) => compartment.startsWith(today) && config.enabled)
      .map(([compartment, config]) => ({ compartment, ...config }));
    
    return todayCompartments;
  };

  const getOverallAdherenceRate = () => {
    const rates = Object.values(compartmentConfig)
      .filter(config => config.adherenceRate)
      .map(config => config.adherenceRate);
    
    if (rates.length === 0) return 0;
    return Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length);
  };

  const todaysCompartments = getTodaysCompartments();
  const configuredCount = Object.keys(compartmentConfig).length;
  const activeMedications = new Set(Object.values(compartmentConfig).map(c => c.medication)).size;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Dashboard</h2>
        <p className="text-gray-600">Your medication management overview</p>
      </div>

      {/* Real Device Status */}
      {deviceData && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Device Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {deviceData.deviceId || 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Device ID</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {deviceData.readable_time ? new Date(deviceData.readable_time).toLocaleTimeString() : 'N/A'}
              </div>
              <div className="text-sm text-gray-600">Last Seen</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {deviceData.lastMedicationName || 'None'}
              </div>
              <div className="text-sm text-gray-600">Last Medication</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((deviceData.uptime || 0) / 3600000)}h
              </div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts */}
      {alerts.filter(a => !a.acknowledged).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-900 mb-3">Active Alerts</h3>
          {alerts.filter(a => !a.acknowledged).map(alert => (
            <div key={alert.alertId} className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">{alert.description}</p>
                  <p className="text-sm text-gray-600">{alert.medication} - {alert.compartment}</p>
                </div>
              </div>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Acknowledge
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Pill className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Medications</p>
              <p className="text-2xl font-bold text-gray-900">{activeMedications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Grid className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Configured Compartments</p>
              <p className="text-2xl font-bold text-gray-900">{configuredCount}/14</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Adherence Rate</p>
              <p className="text-2xl font-bold text-gray-900">{getOverallAdherenceRate()}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Caregivers</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Compartments */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Compartments</h3>
        {todaysCompartments.length > 0 ? (
          <div className="space-y-3">
            {todaysCompartments.map(comp => (
              <div key={comp.compartment} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Grid className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{comp.compartment}: {comp.medication}</p>
                    <p className="text-sm text-gray-600">{comp.dosage}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{comp.time}</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600">{comp.adherenceRate}% adherence</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No compartments configured for today</p>
        )}
      </div>

      {/* Compartment Grid Preview */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compartment Overview</h3>
        <CompartmentGrid compartmentConfig={compartmentConfig} compact={true} />
      </div>
    </div>
  );
};

// Compartment Grid Component
const CompartmentGrid = ({ compartmentConfig, compact = false, onCompartmentClick = null }) => {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const PERIODS = ['AM', 'PM'];

  const getCompartmentClass = (day, period) => {
    const compartment = `${day}-${period}`;
    const config = compartmentConfig[compartment];
    
    let baseClass = compact ? "p-2 text-xs" : "p-3 text-sm";
    baseClass += " border rounded-lg text-center transition-all";
    
    if (onCompartmentClick) {
      baseClass += " cursor-pointer hover:shadow-md hover:border-blue-300";
    }
    
    if (config) {
      return baseClass + " bg-blue-50 border-blue-200 text-blue-800";
    }
    
    return baseClass + " bg-gray-50 border-gray-200 text-gray-600";
  };

  return (
    <div className="grid grid-cols-8 gap-2">
      {/* Header */}
      <div className="text-center font-medium text-gray-700"></div>
      {DAYS.map(day => (
        <div key={day} className="text-center font-medium text-gray-700 py-2">
          {day}
        </div>
      ))}
      
      {/* Rows */}
      {PERIODS.map(period => (
        <React.Fragment key={period}>
          <div className="text-center font-medium text-gray-700 py-2">
            {period}
          </div>
          {DAYS.map(day => {
            const compartment = `${day}-${period}`;
            const config = compartmentConfig[compartment];
            
            return (
              <div
                key={compartment}
                className={getCompartmentClass(day, period)}
                onClick={() => onCompartmentClick && onCompartmentClick(compartment)}
                title={config ? `${config.medication} - ${config.dosage} at ${config.time}` : 'Empty compartment'}
              >
                <div className="font-medium">{day}-{period}</div>
                {!compact && config && (
                  <div className="text-xs mt-1 truncate">
                    {config.medication}
                  </div>
                )}
                {compact && config && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mt-1"></div>
                )}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

// Compartment Manager with Real Device Integration
const CompartmentManager = ({ compartmentConfig, setCompartmentConfig, medicationLibrary, deviceData }) => {
  const [selectedCompartment, setSelectedCompartment] = useState(null);
  const [editingCompartment, setEditingCompartment] = useState(null);
  const [deploymentStatus, setDeploymentStatus] = useState(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [compartmentForm, setCompartmentForm] = useState({
    medication: '',
    dosage: '',
    time: '',
    notes: '',
    enabled: true
  });

  const handleCompartmentClick = (compartment) => {
    setSelectedCompartment(compartment);
  };

  const deployToDevice = async () => {
    setIsDeploying(true);
    setDeploymentStatus(null);

    try {
      // This would call your deploy Lambda function
      // For now, we'll simulate a successful deployment
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      setDeploymentStatus({ 
        type: 'success', 
        message: 'Configuration deployed to ESP32 successfully!' 
      });
      
      alert('Configuration would be deployed to ESP32! (Deploy function not yet implemented)');
    } catch (error) {
      setDeploymentStatus({ 
        type: 'error', 
        message: `Deployment failed: ${error.message}` 
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const configuredCount = Object.keys(compartmentConfig).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Compartment Schedule</h2>
          <p className="text-gray-600">
            Configure your 14 compartments - each has a sensor to detect when opened
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={deployToDevice}
            disabled={configuredCount === 0 || isDeploying}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white ${
              isDeploying 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {isDeploying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Deploy to MedBox</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Deployment Status */}
      {deploymentStatus && (
        <div className={`p-4 rounded-lg border ${
          deploymentStatus.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center space-x-2">
            {deploymentStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span className="font-medium">{deploymentStatus.message}</span>
          </div>
        </div>
      )}

      {/* Device Status */}
      {deviceData && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Device Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Device:</span>
              <p className="font-medium">{deviceData.deviceId}</p>
            </div>
            <div>
              <span className="text-gray-600">Last Update:</span>
              <p className="font-medium">
                {deviceData.readable_time ? new Date(deviceData.readable_time).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-600">User:</span>
              <p className="font-medium">{deviceData.userId}</p>
            </div>
            <div>
              <span className="text-gray-600">Records:</span>
              <p className="font-medium">{deviceData.debug_total_records || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Rest of compartment manager components would go here */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Click a compartment to configure
        </h3>
        <CompartmentGrid 
          compartmentConfig={compartmentConfig}
          compact={false}
          onCompartmentClick={handleCompartmentClick}
        />
      </div>

      {/* Add the rest of your compartment configuration UI here */}
    </div>
  );
};

// Placeholder components for other tabs
const MedicationLibrary = ({ medicationLibrary, setMedicationLibrary }) => (
  <div className="bg-white p-6 rounded-lg border">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Medication Library</h2>
    <p className="text-gray-600">Medication management coming soon...</p>
  </div>
);

const HistoryView = ({ deviceData }) => (
  <div className="bg-white p-6 rounded-lg border">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Medication History</h2>
    {deviceData && (
      <div className="space-y-2">
        <p><strong>Latest Device Update:</strong> {deviceData.readable_time}</p>
        <p><strong>Last Medication:</strong> {deviceData.lastMedicationName || 'None recorded'}</p>
        <p><strong>Total Records:</strong> {deviceData.debug_total_records}</p>
      </div>
    )}
  </div>
);

const CaregiverManagement = ({ user }) => (
  <div className="bg-white p-6 rounded-lg border">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Caregiver Management</h2>
    <p className="text-gray-600">Caregiver features coming soon...</p>
  </div>
);

const SettingsPanel = ({ user, deviceData }) => (
  <div className="bg-white p-6 rounded-lg border">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Settings</h2>
    {deviceData && (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Device Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Device ID:</span>
            <p className="font-medium">{deviceData.deviceId}</p>
          </div>
          <div>
            <span className="text-gray-600">User ID:</span>
            <p className="font-medium">{deviceData.userId}</p>
          </div>
          <div>
            <span className="text-gray-600">Uptime:</span>
            <p className="font-medium">{Math.round((deviceData.uptime || 0) / 3600000)} hours</p>
          </div>
          <div>
            <span className="text-gray-600">Last Update:</span>
            <p className="font-medium">{deviceData.readable_time || 'N/A'}</p>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default MedBoxApp;