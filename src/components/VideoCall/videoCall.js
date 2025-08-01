// VideoCall.js
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, 
  faPhone, faExpand, faCompress, faCog, faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import AgoraRTC from 'agora-rtc-sdk-ng';

// Sử dụng App ID demo công khai của Agora để test
const APP_ID = 'aab8b8f5a8cd4469a63042fcfafe7063'; // Demo App ID công khai
// Test mode không cần token
const TOKEN = null;

const VideoCall = ({ 
  show, 
  onHide, 
  channelName, 
  userRole = 'patient', // 'doctor' hoặc 'patient'
  appointmentId,
  userName = 'Người dùng'
}) => {
  const client = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);
  const localContainer = useRef();
  const remoteContainer = useRef();
  const mediaStream = useRef(null); // For demo mode
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasRemoteUser, setHasRemoteUser] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [demoMode, setDemoMode] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Check browser compatibility and provide debug info
  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    return {
      browser,
      supportsWebRTC: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      supportsRTC: !!window.RTCPeerConnection,
      userAgent: userAgent.substring(0, 100) + '...'
    };
  };

  // Log connection debug info
  const logDebugInfo = () => {
    const browserInfo = getBrowserInfo();
    console.log('=== VIDEO CALL DEBUG INFO ===');
    console.log('Browser:', browserInfo.browser);
    console.log('WebRTC Support:', browserInfo.supportsWebRTC);
    console.log('RTC Support:', browserInfo.supportsRTC);
    console.log('Channel Name:', getChannelName());
    console.log('User Role:', userRole);
    console.log('Appointment ID:', appointmentId);
    console.log('Demo Mode:', demoMode);
    console.log('Connection Status:', connectionStatus);
    console.log('==============================');
  };

  // Generate unique channel name based on appointment
  const getChannelName = () => {
    if (appointmentId) {
      return `appointment_${appointmentId}`;
    }
    return 'test_room_cross_browser'; // Fixed test channel name for debugging
  };

  // Check camera/microphone permissions
  const checkPermissions = async () => {
    try {
      console.log('Checking camera/microphone permissions...');
      
      // Request permissions
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      console.log('Permissions granted');
      
      // Stop the test stream
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('Permission check failed:', error);
      setPermissionDenied(true);
      
      if (error.name === 'NotAllowedError') {
        setError('Vui lòng cho phép truy cập camera và microphone trong trình duyệt để sử dụng video call.');
      } else if (error.name === 'NotFoundError') {
        setError('Không tìm thấy camera hoặc microphone. Vui lòng kiểm tra thiết bị.');
      } else {
        setError(`Lỗi truy cập thiết bị: ${error.message}`);
      }
      
      return false;
    }
  };

  // Demo mode - chỉ hiển thị UI với WebRTC đơn giản
  const initializeDemoMode = async () => {
    try {
      console.log('Starting demo mode...');
      setIsConnecting(true);
      setDemoMode(true);
      setError(null);
      
      // Check permissions first
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        return;
      }
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get user media for demo
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 } 
        }, 
        audio: true 
      });
      
      mediaStream.current = stream;
      
      if (localContainer.current) {
        // Clear any existing content
        localContainer.current.innerHTML = '';
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true; // Mute local video to prevent feedback
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.borderRadius = '8px';
        localContainer.current.appendChild(video);
        
        console.log('Demo video playing');
      }
      
      setIsConnected(true);
      setConnectionStatus('connected');
      setError('Chế độ demo đang hoạt động - Chỉ hiển thị camera của bạn');
      
    } catch (error) {
      console.error('Demo mode failed:', error);
      setPermissionDenied(true);
      
      if (error.name === 'NotAllowedError') {
        setError('Vui lòng cho phép truy cập camera và microphone để sử dụng video call.');
      } else {
        setError(`Không thể khởi tạo demo mode: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const initializeAgoraClient = async () => {
    try {
      setIsConnecting(true);
      setConnectionStatus('connecting');
      setError(null);
      setDemoMode(false);

      console.log('Initializing Agora client...');
      console.log('App ID:', APP_ID);
      console.log('Channel:', getChannelName());

      // Check permissions first
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        return;
      }

      // Create Agora client with improved cross-browser compatibility
      if (client.current) {
        try {
          await client.current.leave();
        } catch (e) {
          console.log('Previous client cleanup:', e.message);
        }
      }

      client.current = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8',  // VP8 is better supported across browsers than VP9/H264
        enableLogUpload: false, // Disable for better performance
        logFilter: AgoraRTC.LOG_FILTER_ERROR // Reduce console noise
      });

      // Enable dual stream mode for better network adaptation
      await client.current.enableDualStream();

      if (!client.current) {
        throw new Error('Failed to create Agora client');
      }

      console.log('Agora client created successfully');

      // Set up event listeners
      client.current.on('user-published', handleUserPublished);
      client.current.on('user-unpublished', handleUserUnpublished);
      client.current.on('user-joined', handleUserJoined);
      client.current.on('user-left', handleUserLeft);
      client.current.on('connection-state-changed', handleConnectionStateChanged);

      // Join channel với retry logic
      let retries = 2;
      let uid = null;
      
      while (retries > 0 && !uid) {
        try {
          console.log(`Attempting to join channel... (${3 - retries}/2)`);
          uid = await client.current.join(APP_ID, getChannelName(), TOKEN, null);
          console.log('Joined channel successfully with UID:', uid);
          break;
        } catch (joinError) {
          console.error('Join attempt failed:', joinError);
          retries--;
          if (retries > 0) {
            console.log('Retrying in 1 second...');
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            throw joinError;
          }
        }
      }

      // Create and publish local tracks
      await createLocalTracks();
      await publishLocalTracks();

      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
    } catch (error) {
      console.error('Failed to initialize Agora client:', error);
      handleAgoraError(error);
      setConnectionStatus('disconnected');
      
      // Fallback to demo mode
      console.log('Falling back to demo mode...');
      setTimeout(() => {
        initializeDemoMode();
      }, 500);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAgoraError = (error) => {
    console.error('Agora error details:', error);
    logDebugInfo(); // Log debug info when error occurs
    
    if (error.code === 'CAN_NOT_GET_GATEWAY_SERVER') {
      setError('Không thể kết nối đến máy chủ Agora. Vui lòng kiểm tra kết nối internet và thử lại.');
    } else if (error.code === 'INVALID_PARAMS') {
      setError('Thông số kết nối không hợp lệ. Đang chuyển sang chế độ demo...');
    } else if (error.code === 'NOT_SUPPORTED') {
      setError('Trình duyệt của bạn không hỗ trợ video call. Vui lòng sử dụng Chrome, Firefox, Safari hoặc Edge phiên bản mới.');
    } else if (error.code === 'PERMISSION_DENIED' || error.name === 'NotAllowedError') {
      setError('Vui lòng cho phép truy cập camera và microphone để sử dụng video call.');
      setPermissionDenied(true);
    } else if (error.code === 'NETWORK_ERROR') {
      setError('Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.');
    } else {
      setError(`Lỗi kết nối: ${error.message || error.code || 'Unknown error'}. Đang chuyển sang chế độ demo...`);
    }
  };

  const handleConnectionStateChanged = (curState, revState, reason) => {
    console.log('Connection state changed:', curState, 'Previous:', revState, 'Reason:', reason);
    
    if (curState === 'DISCONNECTED') {
      setConnectionStatus('disconnected');
      setIsConnected(false);
    } else if (curState === 'CONNECTED') {
      setConnectionStatus('connected');
      setIsConnected(true);
    } else if (curState === 'CONNECTING') {
      setConnectionStatus('connecting');
    }
  };

  const createLocalTracks = async () => {
    try {
      console.log('Creating local tracks...');
      
      // Create audio track with cross-browser compatible settings
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: {
          sampleRate: 44100, // More universally supported
          stereo: false, // Mono for better compatibility
          bitrate: 64, // Lower bitrate for better stability
        },
        microphoneId: 'default' // Use default device
      });
      
      // Create video track with conservative settings for cross-browser compatibility
      localVideoTrack.current = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: {
          width: { min: 320, ideal: 480, max: 640 }, // Conservative resolution
          height: { min: 240, ideal: 360, max: 480 },
          frameRate: 15, // Lower frame rate for stability
          bitrateMin: 200,
          bitrateMax: 500, // Conservative bitrate
        },
        cameraId: 'default', // Use default camera
        facingMode: 'user' // Front-facing camera preference
      });

      console.log('Local tracks created successfully');
      
      // Play local video safely
      if (localContainer.current && localVideoTrack.current) {
        const container = localContainer.current;
        if (container.isConnected) {
          container.innerHTML = '';
          await localVideoTrack.current.play(container);
          console.log('Local video playing');
        }
      }
    } catch (error) {
      console.error('Failed to create local tracks:', error);
      throw error;
    }
  };

  const publishLocalTracks = async () => {
    try {
      const tracks = [];
      if (localAudioTrack.current) tracks.push(localAudioTrack.current);
      if (localVideoTrack.current) tracks.push(localVideoTrack.current);
      
      if (tracks.length > 0 && client.current) {
        await client.current.publish(tracks);
        console.log('Published local tracks successfully');
      }
    } catch (error) {
      console.error('Failed to publish local tracks:', error);
      throw error;
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    try {
      console.log('User published:', user.uid, 'mediaType:', mediaType);
      
      // Subscribe with retry logic for better cross-browser compatibility
      let subscribed = false;
      let retries = 3;
      
      while (!subscribed && retries > 0) {
        try {
          await client.current.subscribe(user, mediaType);
          subscribed = true;
          console.log('Subscribed to user:', user.uid, 'mediaType:', mediaType);
        } catch (subscribeError) {
          console.warn(`Subscribe attempt failed (${4-retries}/3):`, subscribeError);
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }
      
      if (!subscribed) {
        console.error('Failed to subscribe after all retries');
        return;
      }

      if (mediaType === 'video' && remoteContainer.current && user.videoTrack) {
        const container = remoteContainer.current;
        if (container.isConnected) {
          // Clear container safely before playing new video
          container.innerHTML = '';
          await user.videoTrack.play(container);
          setHasRemoteUser(true);
          console.log('Remote video playing');
        }
      }
      
      if (mediaType === 'audio' && user.audioTrack) {
        await user.audioTrack.play();
        console.log('Remote audio playing');
      }
    } catch (error) {
      console.error('Failed to handle user published:', error);
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    console.log('User unpublished:', user.uid, 'mediaType:', mediaType);
    if (mediaType === 'video') {
      // Không set hasRemoteUser = false vì user vẫn còn trong call, chỉ tắt camera
      setHasRemoteUser(false); // Tạm thời giữ nguyên logic cũ cho modal version
    }
  };

  const handleUserJoined = (user) => {
    console.log('User joined:', user.uid);
  };

  const handleUserLeft = (user) => {
    console.log('User left:', user.uid);
    setHasRemoteUser(false);
  };

  const toggleVideo = async () => {
    if (demoMode && mediaStream.current) {
      // Demo mode toggle
      const videoTrack = mediaStream.current.getVideoTracks()[0];
      if (videoTrack) {
        const newState = !videoEnabled;
        videoTrack.enabled = newState;
        setVideoEnabled(newState);
        
        // Ẩn hoàn toàn video element trong demo mode
        if (localContainer.current) {
          const videoElement = localContainer.current.querySelector('video');
          if (videoElement) {
            videoElement.style.display = newState ? 'block' : 'none';
          }
        }
      }
      return;
    }
    
    if (localVideoTrack.current) {
      try {
        const newVideoState = !videoEnabled;
        
        if (videoEnabled) {
          // Turning off video - disable the track
          await localVideoTrack.current.setEnabled(false);
        } else {
          // Turning on video - enable track with safer DOM handling
          await localVideoTrack.current.setEnabled(true);
          
          // Check if we need to restart video playback with safety checks
          if (localContainer.current) {
            try {
              const container = localContainer.current;
              
              // Ensure container is still valid and attached to DOM
              if (container && container.isConnected && container.parentNode) {
                const existingVideo = container.querySelector('video');
                
                if (!existingVideo) {
                  // Only create new video element if none exists
                  setTimeout(async () => {
                    try {
                      if (localVideoTrack.current && container.isConnected) {
                        await localVideoTrack.current.play(container);
                      }
                    } catch (e) {
                      console.warn('Delayed video play failed:', e);
                    }
                  }, 100);
                } else {
                  // Just ensure the existing video is visible
                  existingVideo.style.display = 'block';
                }
              }
            } catch (playError) {
              console.warn('Could not manage video playback:', playError);
            }
          }
        }
        
        setVideoEnabled(newVideoState);
      } catch (error) {
        console.error('Failed to toggle video:', error);
        // Simple fallback - just update state without DOM manipulation
        setVideoEnabled(!videoEnabled);
      }
    }
  };

  const toggleAudio = async () => {
    if (demoMode && mediaStream.current) {
      // Demo mode toggle
      const audioTrack = mediaStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
      return;
    }
    
    if (localAudioTrack.current) {
      try {
        if (audioEnabled) {
          await localAudioTrack.current.setEnabled(false);
        } else {
          await localAudioTrack.current.setEnabled(true);
        }
        setAudioEnabled(!audioEnabled);
      } catch (error) {
        console.error('Failed to toggle audio:', error);
      }
    }
  };

  const leaveCall = async () => {
    try {
      console.log('Leaving call...');
      
      if (demoMode && mediaStream.current) {
        // Clean up demo mode
        mediaStream.current.getTracks().forEach(track => track.stop());
        mediaStream.current = null;
        
        if (localContainer.current) {
          localContainer.current.innerHTML = '';
        }
      } else {
        // Close Agora tracks
        if (localAudioTrack.current) {
          localAudioTrack.current.close();
          localAudioTrack.current = null;
        }
        
        if (localVideoTrack.current) {
          localVideoTrack.current.close();
          localVideoTrack.current = null;
        }

        // Leave channel
        if (client.current) {
          try {
            await client.current.leave();
          } catch (e) {
            console.log('Leave error (ignored):', e.message);
          }
          client.current = null;
        }
      }

      setIsConnected(false);
      setHasRemoteUser(false);
      setConnectionStatus('disconnected');
      setError(null);
      setDemoMode(false);
      setPermissionDenied(false);
      onHide();
    } catch (error) {
      console.error('Failed to leave call:', error);
      onHide();
    }
  };

  const requestPermissions = async () => {
    setPermissionDenied(false);
    setError(null);
    
    const hasPermission = await checkPermissions();
    if (hasPermission) {
      initializeDemoMode();
    }
  };

  useEffect(() => {
    if (show) {
      console.log('VideoCall modal opened');
      logDebugInfo(); // Log debug information when modal opens
      
      // Start with demo mode for better reliability
      initializeDemoMode();
    }

    return () => {
      if (show) {
        leaveCall();
      }
    };
  }, [show]);

  const getStatusMessage = () => {
    if (permissionDenied) {
      return 'Cần quyền truy cập camera/microphone';
    }
    
    if (demoMode) {
      return 'Chế độ demo - Camera local';
    }
    
    switch (connectionStatus) {
      case 'connecting':
        return 'Đang kết nối...';
      case 'connected':
        return hasRemoteUser ? 'Đã kết nối' : 'Đang chờ người khác tham gia...';
      default:
        return 'Chưa kết nối';
    }
  };

  const retryConnection = () => {
    setError(null);
    setPermissionDenied(false);
    initializeAgoraClient();
  };

  const switchToDemoMode = () => {
    setError(null);
    setPermissionDenied(false);
    initializeDemoMode();
  };

  return (
    <Modal 
      show={show} 
      onHide={leaveCall} 
      size="xl" 
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>
          <FontAwesomeIcon icon={faVideo} className="me-2" />
          Video Call - {userRole === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân'}
          {demoMode && <span className="badge bg-warning ms-2">Demo</span>}
        </Modal.Title>
        <div className="ms-auto me-3">
          <small className="text-muted">
            {getStatusMessage()}
            {isConnecting && <Spinner size="sm" className="ms-2" />}
          </small>
        </div>
      </Modal.Header>
      
      <Modal.Body className="p-0" style={{ height: '600px' }}>
        {error && (
          <Alert variant={demoMode ? "warning" : permissionDenied ? "danger" : "info"} className="m-3">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>
                  {permissionDenied ? "Cần quyền truy cập:" : demoMode ? "Chế độ demo:" : "Thông báo:"}
                </strong>
                <div>{error}</div>
                {demoMode && (
                  <small className="text-muted">
                    Chế độ demo chỉ hiển thị camera của bạn. Để video call thật, cần cấu hình Agora SDK đúng cách.
                  </small>
                )}
              </div>
              <div>
                {permissionDenied ? (
                  <Button variant="outline-primary" size="sm" onClick={requestPermissions}>
                    Cho phép quyền
                  </Button>
                ) : !demoMode ? (
                  <>
                    <Button variant="outline-danger" size="sm" onClick={retryConnection} className="me-2">
                      Thử lại Agora
                    </Button>
                    <Button variant="outline-warning" size="sm" onClick={switchToDemoMode}>
                      Demo Mode
                    </Button>
                  </>
                ) : null}
              </div>
            </div>
          </Alert>
        )}
        
        <Container fluid className="h-100">
          <Row className="h-100">
            {/* Remote Video */}
            <Col md={hasRemoteUser ? 8 : 12} className="h-100 p-2">
              <div 
                className="w-100 h-100 bg-dark rounded position-relative d-flex align-items-center justify-content-center"
                style={{ minHeight: '400px' }}
              >
                <div 
                  ref={remoteContainer}
                  className="w-100 h-100 rounded"
                  style={{ display: hasRemoteUser ? 'block' : 'none' }}
                />
                {!hasRemoteUser && (
                  <div className="text-center text-white">
                    <FontAwesomeIcon icon={faVideo} size="3x" className="mb-3 opacity-50" />
                    <h5>
                      {demoMode 
                        ? 'Chế độ demo - Chỉ hiển thị camera của bạn'
                        : `Đang chờ ${userRole === 'doctor' ? 'bệnh nhân' : 'bác sĩ'} tham gia...`
                      }
                    </h5>
                    <p className="opacity-75">Room: {getChannelName()}</p>
                    {permissionDenied && (
                      <div className="mt-3">
                        <Button variant="outline-light" onClick={requestPermissions}>
                          <FontAwesomeIcon icon={faCog} className="me-2" />
                          Cho phép quyền truy cập
                        </Button>
                      </div>
                    )}
                    {error && !demoMode && !permissionDenied && (
                      <div className="mt-3">
                        <Button variant="outline-light" onClick={retryConnection} className="me-2">
                          <FontAwesomeIcon icon={faCog} className="me-2" />
                          Kết nối lại
                        </Button>
                        <Button variant="outline-warning" onClick={switchToDemoMode}>
                          <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                          Chế độ Demo
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Col>
            
            {/* Local Video */}
            <Col md={hasRemoteUser ? 4 : 12} className="h-100 p-2">
              <div className="w-100 h-100 bg-secondary rounded position-relative">
                <div 
                  ref={localContainer}
                  className="w-100 h-100 rounded"
                  style={{ 
                    display: videoEnabled ? 'block' : 'none',
                    minHeight: hasRemoteUser ? '200px' : '400px'
                  }}
                />
                {!videoEnabled && (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center text-white">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faVideoSlash} size="2x" className="mb-2" />
                      <p className="mb-0">Đã tắt camera</p>
                      {/* Hiển thị mic status khi tắt camera */}
                      {!audioEnabled && (
                        <div className="mt-2">
                          <FontAwesomeIcon icon={faMicrophoneSlash} size="1x" className="me-1" />
                          <small>Mic đã tắt</small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Local mic status - hiển thị khi có video nhưng tắt mic */}
                {videoEnabled && !audioEnabled && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(220, 53, 69, 0.9)',
                    color: 'white',
                    padding: '6px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    zIndex: 10
                  }}>
                    <FontAwesomeIcon icon={faMicrophoneSlash} style={{ fontSize: '14px' }} />
                  </div>
                )}
                
                {/* Local video label */}
                <div className="position-absolute bottom-0 start-0 m-2">
                  <small className="bg-dark text-white px-2 py-1 rounded">
                    {userName} (Bạn) {demoMode && "- Demo"}
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      
      <Modal.Footer className="justify-content-center">
        <div className="d-flex gap-3">
          <Button
            variant={audioEnabled ? "success" : "danger"}
            onClick={toggleAudio}
            className="rounded-circle"
            style={{ width: '50px', height: '50px' }}
            title={audioEnabled ? "Tắt microphone" : "Bật microphone"}
            disabled={!isConnected && !demoMode}
          >
            <FontAwesomeIcon icon={audioEnabled ? faMicrophone : faMicrophoneSlash} />
          </Button>
          
          <Button
            variant={videoEnabled ? "primary" : "secondary"}
            onClick={toggleVideo}
            className="rounded-circle"
            style={{ width: '50px', height: '50px' }}
            title={videoEnabled ? "Tắt camera" : "Bật camera"}
            disabled={!isConnected && !demoMode}
          >
            <FontAwesomeIcon icon={videoEnabled ? faVideo : faVideoSlash} />
          </Button>
          
          {demoMode && (
            <Button
              variant="outline-primary"
              onClick={() => {
                leaveCall();
                setTimeout(() => initializeAgoraClient(), 500);
              }}
              size="sm"
              title="Chuyển sang chế độ Agora thật để kết nối với người khác"
            >
              <FontAwesomeIcon icon={faCog} className="me-1" />
              Kết nối thật
            </Button>
          )}
          
          <Button
            variant="danger"
            onClick={leaveCall}
            className="rounded-circle"
            style={{ width: '50px', height: '50px' }}
            title="Kết thúc cuộc gọi"
          >
            <FontAwesomeIcon icon={faPhone} />
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default VideoCall;
