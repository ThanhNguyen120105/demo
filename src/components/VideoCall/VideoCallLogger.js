import { useState, useRef, useCallback } from 'react';

class VideoCallLogger {
  constructor(appointmentId, userRole) {
    console.log('🏗️ VideoCallLogger constructor called');
    console.log('📋 appointmentId:', appointmentId);
    console.log('👤 userRole:', userRole);
    console.log('🪟 Window type:', window.opener ? 'POPUP' : 'MAIN');
    
    this.appointmentId = appointmentId;
    this.userRole = userRole;
    this.logData = {
      appointmentId,
      sessionId: this.generateSessionId(),
      participants: {
        doctor: {
          joined: null,
          left: null,
          duration: 0
        },
        patient: {
          joined: null,
          left: null,
          duration: 0
        }
      },
      callStatus: {
        startTime: null,
        endTime: null,
        totalDuration: 0,
        bothParticipantsConnected: false,
        callCompletedProperly: false
      },
      chatMessages: [],
      connectionEvents: [],
      qualityMetrics: {
        connectionIssues: 0,
        reconnections: 0,
        averageLatency: 0
      }
    };
    this.isLogging = false;
    this.bothConnectedTime = null;
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Bắt đầu logging session
  startLogging() {
    console.log('🎬 VideoCallLogger.startLogging() called');
    console.log('📋 Appointment ID:', this.appointmentId);
    console.log('👤 User Role:', this.userRole);
    
    this.isLogging = true;
    this.logData.callStatus.startTime = new Date().toISOString();
    this.logConnectionEvent('SESSION_STARTED', `${this.userRole} started logging`);
    console.log('📊 Video call logging started for appointment:', this.appointmentId);
  }

  // Kết thúc logging session
  endLogging() {
    if (!this.isLogging) return;
    
    this.isLogging = false;
    this.logData.callStatus.endTime = new Date().toISOString();
    this.calculateTotalDuration();
    this.logConnectionEvent('SESSION_ENDED', 'Logging session completed');
    console.log('📊 Video call logging ended for appointment:', this.appointmentId);
  }

  // Log khi user tham gia
  logUserJoined(userRole, uid) {
    const timestamp = new Date().toISOString();
    
    if (this.logData.participants[userRole]) {
      this.logData.participants[userRole].joined = timestamp;
      this.logData.participants[userRole].uid = uid;
    }

    this.logConnectionEvent('USER_JOINED', `${userRole} joined with UID: ${uid}`);
    
    // Kiểm tra xem cả hai có đã kết nối chưa
    this.checkBothParticipantsConnected();
    console.log(`👤 ${userRole} joined the video call`);
  }

  // Log khi user rời khỏi
  logUserLeft(userRole, uid) {
    const timestamp = new Date().toISOString();
    
    if (this.logData.participants[userRole]) {
      this.logData.participants[userRole].left = timestamp;
      this.calculateParticipantDuration(userRole);
    }

    this.logConnectionEvent('USER_LEFT', `${userRole} left with UID: ${uid}`);
    
    // Kiểm tra xem cuộc gọi đã kết thúc chưa
    this.checkCallCompletion();
    console.log(`👤 ${userRole} left the video call`);
  }

  // Log tin nhắn chat
  logChatMessage(sender, message, senderName) {
    const chatEntry = {
      timestamp: new Date().toISOString(),
      sender,
      senderName,
      message: message.trim(),
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    };

    this.logData.chatMessages.push(chatEntry);
    console.log(`💬 Chat message logged from ${sender}: ${message.substring(0, 50)}...`);
  }

  // Log connection events
  logConnectionEvent(eventType, details) {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      details,
      userRole: this.userRole
    };

    this.logData.connectionEvents.push(event);
  }

  // Log connection issues
  logConnectionIssue(issueType, details) {
    this.logData.qualityMetrics.connectionIssues++;
    this.logConnectionEvent('CONNECTION_ISSUE', `${issueType}: ${details}`);
    console.log(`⚠️ Connection issue logged: ${issueType}`);
  }

  // Kiểm tra cả hai participants đã kết nối
  checkBothParticipantsConnected() {
    const doctorConnected = this.logData.participants.doctor.joined;
    const patientConnected = this.logData.participants.patient.joined;

    if (doctorConnected && patientConnected && !this.logData.callStatus.bothParticipantsConnected) {
      this.logData.callStatus.bothParticipantsConnected = true;
      this.bothConnectedTime = new Date().toISOString();
      this.logConnectionEvent('BOTH_CONNECTED', 'Both doctor and patient are now connected');
      console.log('🟢 Both participants connected - call officially started');
    }
  }

  // Kiểm tra cuộc gọi đã hoàn thành
  checkCallCompletion() {
    const doctorLeft = this.logData.participants.doctor.left;
    const patientLeft = this.logData.participants.patient.left;

    if (doctorLeft && patientLeft && !this.logData.callStatus.callCompletedProperly) {
      this.logData.callStatus.callCompletedProperly = true;
      this.logConnectionEvent('CALL_COMPLETED', 'Both participants have left - call completed');
      console.log('🔴 Call completed - both participants have left');
      
      // Tự động kết thúc logging sau 5 giây
      setTimeout(() => {
        this.endLogging();
        this.uploadLogToServer();
      }, 5000);
    }
  }

  // Tính thời lượng cho participant
  calculateParticipantDuration(userRole) {
    const participant = this.logData.participants[userRole];
    if (participant.joined && participant.left) {
      const joinTime = new Date(participant.joined);
      const leftTime = new Date(participant.left);
      participant.duration = Math.round((leftTime - joinTime) / 1000); // seconds
    }
  }

  // Tính tổng thời lượng cuộc gọi
  calculateTotalDuration() {
    if (this.bothConnectedTime && this.logData.callStatus.endTime) {
      const startTime = new Date(this.bothConnectedTime);
      const endTime = new Date(this.logData.callStatus.endTime);
      this.logData.callStatus.totalDuration = Math.round((endTime - startTime) / 1000); // seconds
    }
  }

  // Format duration thành readable string
  formatDuration(seconds) {
    if (seconds < 60) {
      return `${seconds} giây`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} phút ${remainingSeconds} giây`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours} giờ ${minutes} phút ${remainingSeconds} giây`;
    }
  }

  // Tạo summary cho log
  generateLogSummary() {
    return {
      appointmentId: this.appointmentId,
      sessionId: this.logData.sessionId,
      callSummary: {
        startTime: this.bothConnectedTime || this.logData.callStatus.startTime,
        endTime: this.logData.callStatus.endTime,
        totalDuration: this.formatDuration(this.logData.callStatus.totalDuration),
        bothParticipantsConnected: this.logData.callStatus.bothParticipantsConnected,
        callCompletedProperly: this.logData.callStatus.callCompletedProperly
      },
      participants: {
        doctor: {
          joinTime: this.logData.participants.doctor.joined,
          leaveTime: this.logData.participants.doctor.left,
          duration: this.formatDuration(this.logData.participants.doctor.duration)
        },
        patient: {
          joinTime: this.logData.participants.patient.joined,
          leaveTime: this.logData.participants.patient.left,
          duration: this.formatDuration(this.logData.participants.patient.duration)
        }
      },
      chatSummary: {
        totalMessages: this.logData.chatMessages.length,
        doctorMessages: this.logData.chatMessages.filter(m => m.sender === 'doctor').length,
        patientMessages: this.logData.chatMessages.filter(m => m.sender === 'patient').length
      },
      qualityMetrics: this.logData.qualityMetrics
    };
  }

  // Upload log lên server thông qua API
  async uploadLogToServer() {
    try {
      console.log('📤 VideoCallLogger.uploadLogToServer() called');
      console.log('🪟 Current window:', window.opener ? 'POPUP' : 'MAIN');
      console.log('📋 Appointment ID:', this.appointmentId);
      console.log('📊 Log data exists:', !!this.logData);
      console.log('📤 Uploading video call log to server...');
      
      // Tạo file JSON từ log data
      const logFileName = `appointment_${this.appointmentId}_video_call_log.json`;
      const logContent = {
        ...this.logData,
        summary: this.generateLogSummary(),
        generatedAt: new Date().toISOString(),
        version: '1.0'
      };

      // Tạo Blob file
      const logBlob = new Blob([JSON.stringify(logContent, null, 2)], {
        type: 'application/json'
      });

      // Tạo FormData để upload
      const formData = new FormData();
      formData.append('file', logBlob, logFileName);
      formData.append('filePath', 'videoCallLog');
      formData.append('bucketName', 'document');

      // Gọi API upload (endpoint đúng)
      const token = localStorage.getItem('token');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        headers: headers,
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Video call log uploaded successfully:', result);
        
        // Lưu URL vào localStorage để có thể truy cập sau
        const logMetadataKey = `video_call_log_metadata_${this.appointmentId}`;
        const metadata = {
          appointmentId: this.appointmentId,
          uploadedAt: new Date().toISOString(),
          logFileUrl: result.url || result.fileUrl,
          fileName: logFileName
        };
        localStorage.setItem(logMetadataKey, JSON.stringify(metadata));
        
        return result.url || result.fileUrl;
      } else {
        throw new Error(`Upload failed: ${response.status}`);
      }

    } catch (error) {
      console.error('❌ Failed to upload video call log:', error);
      // Fallback: lưu vào localStorage
      this.saveLogToLocalStorage();
      return null;
    }
  }

  // Fallback: lưu log vào localStorage
  saveLogToLocalStorage() {
    try {
      const logKey = `video_call_log_${this.appointmentId}`;
      const logContent = {
        ...this.logData,
        summary: this.generateLogSummary(),
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(logKey, JSON.stringify(logContent));
      console.log('💾 Video call log saved to localStorage as fallback');
    } catch (error) {
      console.error('❌ Failed to save log to localStorage:', error);
    }
  }

  // Lấy log từ localStorage
  static getLogFromLocalStorage(appointmentId) {
    try {
      const logKey = `video_call_log_${appointmentId}`;
      const logData = localStorage.getItem(logKey);
      return logData ? JSON.parse(logData) : null;
    } catch (error) {
      console.error('❌ Failed to retrieve log from localStorage:', error);
      return null;
    }
  }

  // Get current log data
  getLogData() {
    return {
      ...this.logData,
      summary: this.generateLogSummary()
    };
  }
}

export default VideoCallLogger;
