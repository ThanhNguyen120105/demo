class VideoCallLogger {
  constructor(appointmentId) {
    this.appointmentId = appointmentId;
    this.startTime = null;
    this.endTime = null;
    this.chatLog = [];
    this.participants = {
      doctor: { connected: false, connectionTime: null, disconnectionTime: null },
      customer: { connected: false, connectionTime: null, disconnectionTime: null }
    };
    this.isLogging = false;
    this.logContent = '';
  }

  // Bắt đầu log khi cả 2 user đều connect
  startLogging() {
    if (this.participants.doctor.connected && this.participants.customer.connected && !this.isLogging) {
      this.isLogging = true;
      this.startTime = new Date();
      this.logContent += `=== VIDEO CALL LOG ===\n`;
      this.logContent += `Appointment ID: ${this.appointmentId}\n`;
      this.logContent += `Call Started: ${this.startTime.toISOString()}\n`;
      this.logContent += `Doctor Connected: ${this.participants.doctor.connectionTime?.toISOString()}\n`;
      this.logContent += `Customer Connected: ${this.participants.customer.connectionTime?.toISOString()}\n`;
      this.logContent += `\n=== CHAT LOG ===\n`;
      
      console.log('📞 Video call logging started for appointment:', this.appointmentId);
    }
  }

  // Kết thúc log khi cả 2 user đều disconnect
  async finishLogging() {
    console.log('🔍 finishLogging called - checking conditions:', {
      isLogging: this.isLogging,
      doctorConnected: this.participants.doctor.connected,
      customerConnected: this.participants.customer.connected
    });
    
    if (this.isLogging && !this.participants.doctor.connected && !this.participants.customer.connected) {
      this.isLogging = false;
      this.endTime = new Date();
      
      const duration = this.endTime - this.startTime;
      const durationMinutes = Math.floor(duration / 60000);
      const durationSeconds = Math.floor((duration % 60000) / 1000);

      this.logContent += `\n=== CALL SUMMARY ===\n`;
      this.logContent += `Call Ended: ${this.endTime.toISOString()}\n`;
      this.logContent += `Doctor Disconnected: ${this.participants.doctor.disconnectionTime?.toISOString()}\n`;
      this.logContent += `Customer Disconnected: ${this.participants.customer.disconnectionTime?.toISOString()}\n`;
      this.logContent += `Total Call Duration: ${durationMinutes}m ${durationSeconds}s\n`;
      this.logContent += `Total Messages: ${this.chatLog.length}\n`;
      this.logContent += `\n=== END OF LOG ===\n`;

      console.log('📞 Video call logging finished for appointment:', this.appointmentId);
      console.log('📄 Final log content length:', this.logContent.length);
      
      // Tự động upload log và cập nhật appointment
      const uploadResult = await this.uploadLogAndUpdateAppointment();
      console.log('📁 Upload result:', uploadResult);
      
      return uploadResult;
    } else {
      console.log('⚠️ finishLogging conditions not met - not finishing log');
      return { success: false, message: 'Conditions not met for finishing log' };
    }
  }

  // Log participant connection
  onParticipantConnected(userType) {
    if (userType === 'doctor' || userType === 'customer') {
      this.participants[userType].connected = true;
      this.participants[userType].connectionTime = new Date();
      
      console.log(`📞 ${userType} connected to call ${this.appointmentId}`);
      
      // Check if both connected to start logging
      this.startLogging();
    }
  }

  // Log participant disconnection
  onParticipantDisconnected(userType) {
    if (userType === 'doctor' || userType === 'customer') {
      this.participants[userType].connected = false;
      this.participants[userType].disconnectionTime = new Date();
      
      console.log(`📞 ${userType} disconnected from call ${this.appointmentId}`);
      console.log('📊 Current participants status:', {
        doctor: this.participants.doctor.connected,
        customer: this.participants.customer.connected
      });
      
      // Check if both disconnected to finish logging
      if (!this.participants.doctor.connected && !this.participants.customer.connected) {
        console.log('🎯 Both participants disconnected - triggering finishLogging');
        this.finishLogging();
      } else {
        console.log('⏳ Waiting for other participant to disconnect...');
      }
    }
  }

  // Log chat message
  addChatMessage(sender, message, timestamp = new Date()) {
    if (this.isLogging) {
      const chatEntry = {
        timestamp,
        sender,
        message
      };
      
      this.chatLog.push(chatEntry);
      this.logContent += `[${timestamp.toISOString()}] ${sender}: ${message}\n`;
      
      console.log('💬 Chat message logged:', chatEntry);
    }
  }

  // Method alias để tương thích với VideoCallPage
  logMessage(messageObj) {
    if (this.isLogging && messageObj) {
      const timestamp = messageObj.timestamp ? new Date(messageObj.timestamp) : new Date();
      const sender = messageObj.senderName || messageObj.sender || 'Unknown';
      const message = messageObj.text || messageObj.message || '';
      
      this.addChatMessage(sender, message, timestamp);
    }
  }

  // Upload log file và cập nhật appointment
  async uploadLogAndUpdateAppointment() {
    try {
      console.log('📤 Starting log upload process...');
      console.log('📄 Log content length:', this.logContent.length);
      console.log('📄 Log content preview (first 200 chars):', this.logContent.substring(0, 200));
      
      // Tạo file content
      const fileName = `video_call_log_${this.appointmentId}_${Date.now()}.txt`;
      const logBlob = new Blob([this.logContent], { type: 'text/plain' });
      
      console.log('📁 Created file:', fileName, 'Size:', logBlob.size, 'bytes');
      
      // Upload file lên supabase
      const uploadResult = await this.uploadLogFile(fileName, logBlob);
      
      console.log('📤 Upload result:', uploadResult);
      
      if (uploadResult.success) {
        console.log('📁 Log file uploaded successfully:', uploadResult.url);
        
        // Thay vì localStorage, tự động cập nhật appointment với logURL
        const updateResult = await this.updateAppointmentWithLogUrl(uploadResult.url);
        console.log('� Appointment update result:', updateResult);
        
        if (updateResult.success) {
          console.log('✅ Appointment updated with log URL successfully');
          return {
            success: true,
            logUrl: uploadResult.url,
            message: 'Log uploaded and appointment updated successfully'
          };
        } else {
          console.warn('⚠️ Log uploaded but failed to update appointment:', updateResult.error);
          // Vẫn return success vì file đã upload thành công
          return {
            success: true,
            logUrl: uploadResult.url,
            message: 'Log uploaded successfully but appointment update failed',
            warning: updateResult.error
          };
        }
      } else {
        throw new Error(uploadResult.message || 'Upload failed');
      }
      
    } catch (error) {
      console.error('❌ Error uploading log file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Upload file lên supabase thông qua API
  async uploadLogFile(fileName, fileBlob) {
    try {
      // Tạo FormData
      const formData = new FormData();
      formData.append('filePath', 'logVideoCall'); // Theo yêu cầu
      formData.append('bucketName', 'document'); // Theo yêu cầu
      formData.append('file', fileBlob, fileName);

      // Gọi API upload
      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      console.log('📁 Upload API response:', result);
      console.log('📁 Response structure:', Object.keys(result || {}));
      
      // Thử nhiều format response khác nhau
      let uploadUrl = null;
      
      // Format 1: {status: {code: 200}, data: {url: "..."}}
      if (result.status?.code === 200 && result.data?.url) {
        uploadUrl = result.data.url;
        console.log('✅ Format 1 - Found URL:', uploadUrl);
      }
      // Format 2: {success: true, data: {url: "..."}}
      else if (result.success && result.data?.url) {
        uploadUrl = result.data.url;
        console.log('✅ Format 2 - Found URL:', uploadUrl);
      }
      // Format 3: {url: "..."}
      else if (result.url) {
        uploadUrl = result.url;
        console.log('✅ Format 3 - Found URL:', uploadUrl);
      }
      // Format 4: {data: "url_string"}
      else if (typeof result.data === 'string' && result.data.startsWith('http')) {
        uploadUrl = result.data;
        console.log('✅ Format 4 - Found URL:', uploadUrl);
      }
      
      if (uploadUrl) {
        return {
          success: true,
          url: uploadUrl,
          message: 'File uploaded successfully'
        };
      } else {
        console.error('❌ No URL found in response:', result);
        throw new Error(result.message || result.error || 'Upload API returned no URL');
      }

    } catch (error) {
      console.error('❌ Upload API error:', error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // Cập nhật appointment với log URL trực tiếp
  async updateAppointmentWithLogUrl(logUrl) {
    try {
      console.log('🔄 Updating appointment with log URL:', this.appointmentId, logUrl);
      
      // Gọi trực tiếp API endpoint để tránh circular dependency
      const response = await fetch(`http://localhost:8080/api/appointment/updateStatus/${this.appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: 'COMPLETED',
          logURL: logUrl
        })
      });

      if (!response.ok) {
        // Thử endpoint khác nếu cái đầu không work
        console.log('🔄 First endpoint failed, trying alternative...');
        const response2 = await fetch(`http://localhost:8080/api/appointment/${this.appointmentId}/complete`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            logURL: logUrl
          })
        });
        
        if (!response2.ok) {
          throw new Error(`Failed to update appointment: ${response2.status} ${response2.statusText}`);
        }
        
        const result2 = await response2.json();
        console.log('✅ Appointment updated successfully (endpoint 2):', result2);
        return { success: true, data: result2 };
      }

      const result = await response.json();
      console.log('✅ Appointment updated successfully (endpoint 1):', result);
      
      return {
        success: true,
        data: result
      };
      
    } catch (error) {
      console.error('❌ Error updating appointment with log URL:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get current log stats
  getLogStats() {
    return {
      isLogging: this.isLogging,
      startTime: this.startTime,
      participants: this.participants,
      messageCount: this.chatLog.length,
      currentDuration: this.startTime ? Date.now() - this.startTime : 0
    };
  }
}

export default VideoCallLogger;
