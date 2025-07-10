import React, { useState, useEffect } from 'react';

function ESP32Data() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Add this function
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://2p3qi4n5sag53lv3h5iyze6jt40bmuyu.lambda-url.eu-west-2.on.aws/');
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  // Add this refresh function
  const handleRefresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div>Loading ESP32 data...</div>;

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Live ESP32 Data</h2>
        {/* Add the button here */}
        <button 
          onClick={handleRefresh} 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Refresh Now
        </button>
      </div>
      {data?.success ? (
        <div>
          <p>Found {data.count} records from your device:</p>
          {data.data.map(item => (
            <div key={item.eventId} style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
              <p><strong>Device:</strong> {item.deviceId}</p>
              <p><strong>User:</strong> {item.userId}</p>
              <p><strong>Time:</strong> {new Date(item.timestamp * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'red' }}>Error loading data</p>
      )}
    </div>
  );
}

export default ESP32Data;