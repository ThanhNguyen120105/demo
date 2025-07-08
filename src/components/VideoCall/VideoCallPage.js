import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, 
  faPhone, faExpand, faCompress, faCog, faExclamationTriangle,
  faArrowLeft, faUsers
} from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import './VideoCallPage.css';

// Sử dụng App ID demo công khai của Agora để test
const APP_ID = 'aab8b8f5a8cd4469a63042fcfafe7063'; // Demo App ID công khai
const TOKEN = null; // Test mode không cần token

const VideoCallPage = () => {
  const { appointmentId, userRole } = useParams();
  const navigate = useNavigate();
  
  const client = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);
  const localContainer = useRef();
  const remoteContainer = useRef();
  const mediaStream = useRef(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasRemoteUser, setHasRemoteUser] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [demoMode, setDemoMode] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isToggling, setIsToggling] = useState(false);

  const getChannelName = () => {
    return 'abc'; // Fixed channel name to match the token generated in Agora console
  };

  const getUserName = () => {
    return userRole === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân';
  };

  // Check camera/microphone permissions
  const checkPermissions = async () => {
    try {
      console.log('Checking camera/microphone permissions...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      console.log('Permissions granted');
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

  // Demo mode với WebRTC thuần
  const initializeDemoMode = async () => {
    try {
      console.log('Starting demo mode...');
      setIsConnecting(true);
      setDemoMode(true);
      setError(null);
      
      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        return;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        }, 
        audio: true 
      });
      
      mediaStream.current = stream;
      
      if (localContainer.current) {
        localContainer.current.innerHTML = '';
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.borderRadius = '12px';
        localContainer.current.appendChild(video);
        
        console.log('Demo video playing');
      }
      
      setIsConnected(true);
      setConnectionStatus('connected');
      setError('Chế độ demo đang hoạt động - Video call sẽ hoạt động khi có người khác tham gia');
      
    } catch (error) {
      console.error('Demo mode failed:', error);
      setPermissionDenied(true);
      
      if (error.name === 'NotAllowedError') {
        setError('Vui lòng cho phép truy cập camera và microphone để sử dụng video call.');
      } else {
        setError(`Không thể khởi tạo video call: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Initialize Agora client
  const initializeAgoraClient = async () => {
    try {
      setIsConnecting(true);
      setConnectionStatus('connecting');
      setError(null);
      setDemoMode(false);

      console.log('Initializing Agora client...');
      console.log('App ID:', APP_ID);
      console.log('Channel:', getChannelName());

      const hasPermission = await checkPermissions();
      if (!hasPermission) {
        return;
      }

      if (client.current) {
        try {
          await client.current.leave();
        } catch (e) {
          console.log('Previous client cleanup:', e.message);
        }
      }

      client.current = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8'
      });

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

      // Join channel
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

      await createLocalTracks();
      await publishLocalTracks();

      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
    } catch (error) {
      console.error('Failed to initialize Agora client:', error);
      handleAgoraError(error);
      setConnectionStatus('disconnected');
      
      // Tạm thời comment để debug lỗi rõ hơn
      // console.log('Falling back to demo mode...');
      // setTimeout(() => {
      //   initializeDemoMode();
      // }, 500);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAgoraError = (error) => {
    console.error('Agora error details:', error);
    
    if (error.code === 'CAN_NOT_GET_GATEWAY_SERVER') {
      setError('Không thể kết nối đến máy chủ Agora. Đang chuyển sang chế độ demo...');
    } else if (error.code === 'INVALID_PARAMS') {
      setError('Thông số kết nối không hợp lệ. Đang chuyển sang chế độ demo...');
    } else if (error.code === 'NOT_SUPPORTED') {
      setError('Trình duyệt của bạn không hỗ trợ video call. Vui lòng sử dụng Chrome, Firefox hoặc Safari.');
    } else if (error.name === 'NotAllowedError') {
      setError('Vui lòng cho phép truy cập camera và microphone để sử dụng video call.');
      setPermissionDenied(true);
    } else {
      setError(`Lỗi kết nối Agora. Đang chuyển sang chế độ demo...`);
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
      
      localAudioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
        encoderConfig: {
          sampleRate: 48000,
          stereo: true,
          bitrate: 128,
        },
      });
      
      localVideoTrack.current = await AgoraRTC.createCameraVideoTrack({
        encoderConfig: {
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          frameRate: 24,
          bitrateMin: 1000,
          bitrateMax: 3000,
        }
      });

      // Play local video with React-safe approach
      if (localContainer.current && localVideoTrack.current) {
        const container = localContainer.current;
        // Use requestAnimationFrame to avoid DOM conflicts with React
        requestAnimationFrame(async () => {
          try {
            if (container && localVideoTrack.current) {
              // Don't clear innerHTML, let Agora manage the video element
              await localVideoTrack.current.play(container);
              console.log('Local video playing');
            }
          } catch (error) {
            console.warn('Failed to play local video:', error);
          }
        });
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
      await client.current.subscribe(user, mediaType);
      console.log('Subscribed to user:', user.uid, 'mediaType:', mediaType);

      if (mediaType === 'video' && remoteContainer.current && user.videoTrack) {
        const container = remoteContainer.current;
        // Use requestAnimationFrame to avoid DOM conflicts
        requestAnimationFrame(async () => {
          try {
            if (container && user.videoTrack) {
              // Don't clear innerHTML, let Agora manage it
              await user.videoTrack.play(container);
              setHasRemoteUser(true);
              console.log('Remote video playing');
            }
          } catch (error) {
            console.warn('Failed to play remote video:', error);
          }
        });
        
        // Update remote users list
        setRemoteUsers(prev => {
          const existing = prev.find(u => u.uid === user.uid);
          if (existing) {
            return prev.map(u => u.uid === user.uid ? { ...u, hasVideo: true } : u);
          } else {
            return [...prev, { uid: user.uid, hasVideo: true, hasAudio: false }];
          }
        });
        
        console.log('Remote video playing');
      }
      
      if (mediaType === 'audio') {
        user.audioTrack.play();
        
        // Update remote users list
        setRemoteUsers(prev => {
          const existing = prev.find(u => u.uid === user.uid);
          if (existing) {
            return prev.map(u => u.uid === user.uid ? { ...u, hasAudio: true } : u);
          } else {
            return [...prev, { uid: user.uid, hasVideo: false, hasAudio: true }];
          }
        });
        
        console.log('Remote audio playing');
      }
    } catch (error) {
      console.error('Failed to subscribe to user:', error);
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    console.log('User unpublished:', user.uid, 'mediaType:', mediaType);
    if (mediaType === 'video') {
      setHasRemoteUser(false);
      setRemoteUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, hasVideo: false } : u));
    }
    if (mediaType === 'audio') {
      setRemoteUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, hasAudio: false } : u));
    }
  };

  const handleUserJoined = (user) => {
    console.log('User joined:', user.uid);
    setRemoteUsers(prev => {
      const existing = prev.find(u => u.uid === user.uid);
      if (!existing) {
        return [...prev, { uid: user.uid, hasVideo: false, hasAudio: false }];
      }
      return prev;
    });
  };

  const handleUserLeft = (user) => {
    console.log('User left:', user.uid);
    setHasRemoteUser(false);
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  };

  const toggleVideo = useCallback(async () => {
    if (isToggling) return; // Prevent multiple simultaneous toggles
    
    setIsToggling(true);
    
    try {
      if (demoMode && mediaStream.current) {
        const videoTrack = mediaStream.current.getVideoTracks()[0];
        if (videoTrack) {
          const newState = !videoEnabled;
          videoTrack.enabled = newState;
          setVideoEnabled(newState);
        }
        return;
      }
      
      if (localVideoTrack.current) {
        const newVideoState = !videoEnabled;
        
        // Update track state
        await localVideoTrack.current.setEnabled(newVideoState);
        
        // Update React state
        setVideoEnabled(newVideoState);
      }
    } catch (error) {
      console.error('Failed to toggle video:', error);
    } finally {
      setIsToggling(false);
    }
  }, [videoEnabled, demoMode, isToggling]);

  const toggleAudio = useCallback(async () => {
    if (demoMode && mediaStream.current) {
      const audioTrack = mediaStream.current.getAudioTracks()[0];
      if (audioTrack) {
        const newState = !audioEnabled;
        audioTrack.enabled = newState;
        setAudioEnabled(newState);
      }
      return;
    }
    
    if (localAudioTrack.current) {
      try {
        const newAudioState = !audioEnabled;
        await localAudioTrack.current.setEnabled(newAudioState);
        setAudioEnabled(newAudioState);
      } catch (error) {
        console.error('Failed to toggle audio:', error);
        setAudioEnabled(audioEnabled);
      }
    }
  }, [audioEnabled, demoMode]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Clean up resources without closing window
  const cleanupResources = useCallback(async () => {
    try {
      console.log('Cleaning up resources...');
      
      if (demoMode && mediaStream.current) {
        mediaStream.current.getTracks().forEach(track => track.stop());
        mediaStream.current = null;
        
        // Safely clear container
        requestAnimationFrame(() => {
          if (localContainer.current) {
            localContainer.current.innerHTML = '';
          }
        });
      } else {
        if (localAudioTrack.current) {
          localAudioTrack.current.close();
          localAudioTrack.current = null;
        }
        
        if (localVideoTrack.current) {
          localVideoTrack.current.close();
          localVideoTrack.current = null;
        }

        if (client.current) {
          try {
            await client.current.leave();
          } catch (e) {
            console.log('Leave error (ignored):', e.message);
          }
          client.current = null;
        }
      }
      
      // Reset states
      setIsConnected(false);
      setHasRemoteUser(false);
      setRemoteUsers([]);
      setConnectionStatus('disconnected');
      
    } catch (error) {
      console.error('Failed to cleanup resources:', error);
    }
  }, [demoMode]);

  const leaveCall = async () => {
    try {
      console.log('Leaving call...');
      await cleanupResources();

      // Close the tab/window
      window.close();
      
      // Fallback if window.close() doesn't work
      navigate('/');
    } catch (error) {
      console.error('Failed to leave call:', error);
      window.close();
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

  useEffect(() => {
    console.log('VideoCall page opened');
    console.log('Appointment ID:', appointmentId);
    console.log('User Role:', userRole);
    
    // Start with Agora first, fallback to demo
    initializeAgoraClient();

    // Cleanup on page unload
    const handleBeforeUnload = () => {
      // Clean up without closing window
      cleanupResources();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Clean up resources but don't close window on component unmount
      cleanupResources();
    };
  }, [appointmentId, userRole]);

  const getStatusMessage = () => {
    if (permissionDenied) {
      return 'Cần quyền truy cập camera/microphone';
    }
    
    if (demoMode) {
      return 'Chế độ demo - Video call đang hoạt động';
    }
    
    switch (connectionStatus) {
      case 'connecting':
        return 'Đang kết nối...';
      case 'connected':
        return hasRemoteUser ? `Đã kết nối với ${remoteUsers.length} người` : 'Đang chờ người khác tham gia...';
      default:
        return 'Chưa kết nối';
    }
  };

  return (
    <div className="video-call-page">
      {/* Header */}
      <div className="video-call-header">
        <div className="d-flex align-items-center">
          <Button 
            variant="outline-light" 
            size="sm" 
            onClick={() => navigate('/')}
            className="me-3 back-button"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Quay lại
          </Button>
          <h5 className="text-white mb-0">
            <FontAwesomeIcon icon={faVideo} className="me-2" />
            Video Call - {getUserName()}
            {demoMode && <span className="badge demo-badge ms-2">Demo</span>}
          </h5>
        </div>
        
        <div className="video-call-status">
          <FontAwesomeIcon icon={faUsers} className="me-2" />
          <small>{getStatusMessage()}</small>
          {isConnecting && <Spinner size="sm" className="ms-2" />}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="error-alert">
          <Alert variant={demoMode ? "warning" : permissionDenied ? "danger" : "info"}>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>
                  {permissionDenied ? "Cần quyền truy cập:" : demoMode ? "Chế độ demo:" : "Thông báo:"}
                </strong>
                <div>{error}</div>
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
        </div>
      )}

      {/* Main Video Area */}
      <div className="video-main-container">
        {/* Remote Video (Main) */}
        <div className="remote-video-container">
          <div 
            ref={remoteContainer}
            className={`remote-video ${hasRemoteUser ? 'has-user' : 'no-user'}`}
          >
            {!hasRemoteUser && (
              <div className="waiting-message">
                <FontAwesomeIcon icon={faVideo} size="4x" className="waiting-icon" />
                <h3>
                  {demoMode 
                    ? 'Chế độ demo - Chia sẻ link này với người khác để video call'
                    : `Đang chờ ${userRole === 'doctor' ? 'bệnh nhân' : 'bác sĩ'} tham gia...`
                  }
                </h3>
                <p className="room-info">Room: {getChannelName()}</p>
                
                {permissionDenied && (
                  <Button variant="outline-light" onClick={requestPermissions}>
                    <FontAwesomeIcon icon={faCog} className="me-2" />
                    Cho phép quyền truy cập
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Local Video (Side) */}
        <div className={`local-video-container ${!hasRemoteUser ? 'expanded' : ''}`}>
          <div 
            ref={localContainer}
            className={`local-video ${!hasRemoteUser ? 'expanded' : ''} ${!videoEnabled ? 'camera-off' : ''}`}
          >
            {!videoEnabled && (
              <div className="camera-off-message">
                <FontAwesomeIcon icon={faVideoSlash} size="2x" className="mb-2" />
                <p className="mb-0">Camera đã tắt</p>
              </div>
            )}
            
            <div className="user-label">
              {getUserName()} (Bạn) {demoMode && "- Demo"}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="video-controls">
        <button
          className={`control-button ${audioEnabled ? 'audio-on' : 'audio-off'}`}
          onClick={toggleAudio}
          title={audioEnabled ? "Tắt microphone" : "Bật microphone"}
          disabled={(!isConnected && !demoMode) || isToggling}
        >
          <FontAwesomeIcon icon={audioEnabled ? faMicrophone : faMicrophoneSlash} />
        </button>
        
        <button
          className={`control-button ${videoEnabled ? 'video-on' : 'video-off'}`}
          onClick={toggleVideo}
          title={videoEnabled ? "Tắt camera" : "Bật camera"}
          disabled={(!isConnected && !demoMode) || isToggling}
        >
          <FontAwesomeIcon icon={videoEnabled ? faVideo : faVideoSlash} />
        </button>
        
        <button
          className="control-button utility"
          onClick={toggleFullscreen}
          title="Fullscreen"
        >
          <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
        </button>
        
        <button
          className="control-button end-call"
          onClick={leaveCall}
          title="Kết thúc cuộc gọi"
        >
          <FontAwesomeIcon icon={faPhone} />
        </button>
      </div>
    </div>
  );
};

export default VideoCallPage; 