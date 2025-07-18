import React, { useState } from 'react';
import { Button, Card, Alert } from 'react-bootstrap';
import VideoCallLogger from '../../services/videoCallLogger';
import testVideoCallLogger from '../../test/videoCallLoggerTest';

const VideoCallLoggerTest = () => {
  const [logs, setLogs] = useState([]);
  const [isTestRunning, setIsTestRunning] = useState(false);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTest = async () => {
    setIsTestRunning(true);
    setLogs([]);
    
    try {
      addLog('🧪 Starting VideoCallLogger test...');
      
      const appointmentId = 'test_' + Date.now();
      const logger = new VideoCallLogger(appointmentId);
      
      addLog('✅ Logger created for appointment: ' + appointmentId);
      addLog('📊 Initial stats: ' + JSON.stringify(logger.getLogStats()));
      
      // Test participant connections
      logger.onParticipantConnected('doctor');
      addLog('👨‍⚕️ Doctor connected');
      addLog('📊 Stats after doctor: ' + JSON.stringify(logger.getLogStats()));
      
      logger.onParticipantConnected('customer');  
      addLog('👤 Customer connected');
      addLog('📊 Stats after customer: ' + JSON.stringify(logger.getLogStats()));
      
      // Test chat messages
      if (logger.isLogging) {
        logger.addChatMessage('Bác sĩ', 'Xin chào!');
        logger.addChatMessage('Bệnh nhân', 'Chào bác sĩ ạ!');
        addLog('💬 Added test messages');
        addLog('📊 Stats after messages: ' + JSON.stringify(logger.getLogStats()));
      } else {
        addLog('❌ Logger is not in logging state!');
      }
      
      // Wait a bit then disconnect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      logger.onParticipantDisconnected('customer');
      addLog('👤 Customer disconnected');
      
      logger.onParticipantDisconnected('doctor');
      addLog('👨‍⚕️ Doctor disconnected');
      
      // Check localStorage
      const logUrl = localStorage.getItem(`videoCallLog_${appointmentId}`);
      addLog('💾 Log URL in localStorage: ' + (logUrl || 'NOT FOUND'));
      
      addLog('🧪 Test completed!');
      
    } catch (error) {
      addLog('❌ Test failed: ' + error.message);
      console.error('Test error:', error);
    } finally {
      setIsTestRunning(false);
    }
  };

  return (
    <Card className="m-3">
      <Card.Header>
        <h5>VideoCallLogger Test</h5>
      </Card.Header>
      <Card.Body>
        <Button 
          onClick={runTest} 
          disabled={isTestRunning}
          variant="primary"
          className="mb-3"
        >
          {isTestRunning ? 'Running Test...' : 'Run Logger Test'}
        </Button>
        
        {logs.length > 0 && (
          <Alert variant="info">
            <h6>Test Logs:</h6>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {logs.map((log, index) => (
                <div key={index} style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                  {log}
                </div>
              ))}
            </div>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
};

export default VideoCallLoggerTest;
