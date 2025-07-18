import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash, faExclamationTriangle,
  faPhone, faExpand, faCompress, faCog,
  faArrowLeft, faComment, faPaperPlane, faTimes, faUsers, faLock
} from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import AgoraRTC from 'agora-rtc-sdk-ng';
import AgoraRTM from 'agora-rtm-sdk';
import VideoCallLogger from './VideoCallLogger';
import './VideoCallPage.css';

// Sử dụng cùng App ID cho cả RTC và RTM để tránh conflict
const APP_ID = 'aab8b8f5a8cd4469a63042fcfafe7063'; // Test App ID không cần token
// const TOKEN = '007eJxTYLiSEjndlEE74EjJCdZvNWrKXD/D8n+sOvPp8mW7CTYBZ8UUGIxMTE3SElOMzMwM0kxSjAwsDRNT0ywtUo0tDdIMjVKSHZ7lZjQEMjL4HvBiYWSAQBCfmSExKZmBAQAZ+x7L'; // Token mới cho channel 'abc'
const TOKEN = null;
const VideoCallPage = () => {
  const { appointmentId, userRole } = useParams();
  const navigate = useNavigate();
  
  const client = useRef(null);
  const localAudioTrack = useRef(null);
  const localVideoTrack = useRef(null);
  const localContainer = useRef();
  const remoteContainer = useRef();

  // Chat related refs
  const rtmClient = useRef(null);
  const rtmChannel = useRef(null);
  
  // Video Call Logger
  const videoCallLogger = useRef(null);
  
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasRemoteUser, setHasRemoteUser] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [isToggling, setIsToggling] = useState(false);
  const [isCallLocked, setIsCallLocked] = useState(false);
  const [localVideoPosition, setLocalVideoPosition] = useState({ x: 0, y: 20 });
  const [localVideoSize, setLocalVideoSize] = useState({ width: 150, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragInfo = useRef({});

  // Chat states - sử dụng useRef để tránh dependency cycle
  const isChatOpenRef = useRef(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [chatConnected, setChatConnected] = useState(false);
  const [chatInitialized, setChatInitialized] = useState(false);
  const [isDemoMode] = useState(false); // Set to false for real RTM chat

  // Video Call Logger - REMOVED ALL LOGGING FEATURES
  // Will be reimplemented from scratch
  const [chatRetryCount, setChatRetryCount] = useState(0);

  // Logger initialization - REMOVED

  const getChannelName = useCallback(() => {
    return `appointment_${appointmentId}`;
  }, [appointmentId]);

  const getUserName = useCallback(() => {
    return userRole === 'doctor' ? 'Bác sĩ' : 'Bệnh nhân';
  }, [userRole]);

  // Debug function - REMOVED ALL LOGGING DEBUG

  // Auto-debug removed

  // Chat functions
  const initializeDemoMode = useCallback(() => {
    // Load existing messages from localStorage
    const storageKey = `chat_${appointmentId}`;
    const savedMessages = localStorage.getItem(storageKey);
    
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
        const defaultMessages = [
          {
            id: '1',
            text: 'Xin chào! Demo chat đã sẵn sàng.',
            sender: userRole === 'doctor' ? 'patient' : 'doctor',
            timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
            senderName: userRole === 'doctor' ? 'Bệnh nhân' : 'Bác sĩ'
          }
        ];
        setMessages(defaultMessages);
        localStorage.setItem(storageKey, JSON.stringify(defaultMessages));
      }
    } else {
      const initialMessages = [
        {
          id: '1',
          text: 'Demo chat đã sẵn sàng! Hãy thử gửi tin nhắn.',
          sender: 'system',
          timestamp: new Date().toISOString(),
          senderName: 'Hệ thống'
        }
      ];
      setMessages(initialMessages);
      localStorage.setItem(storageKey, JSON.stringify(initialMessages));
    }
    
    setChatConnected(false); // Demo mode - not real RTM
    
    // Enhanced cross-tab communication
    const handleStorageChange = (e) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const newMessages = JSON.parse(e.newValue);
          setMessages(prev => {
            // Merge và deduplicate messages
            const merged = [...prev];
            newMessages.forEach(newMsg => {
              if (!merged.find(m => m.id === newMsg.id)) {
                merged.push(newMsg);
              }
            });
            return merged.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
          });
        } catch (error) {
          console.error('Failed to parse storage update:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup function
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userRole, appointmentId]);

  const sendSystemMessage = useCallback((text) => {
    // Bỏ qua các thông báo liên quan đến RTM
    if (text.includes('RTM') || text.includes('chat')) {
      return;
    }
    
    const systemMessage = {
      id: Date.now().toString(),
      text,
      sender: 'system',
      timestamp: new Date().toISOString(),
      senderName: 'Hệ thống'
    };
    setMessages(prev => [...prev, systemMessage]);
  }, []);

  const initializeChatClient = useCallback(async () => {
    try {
      console.log('Starting RTM initialization...');
      
      // Cleanup RTM client nếu đã tồn tại
      if (rtmClient.current) {
        try {
          await rtmClient.current.logout();
        } catch (e) {
          console.log('Previous RTM client cleanup:', e.message);
        }
      }
      
      // RTM v1 initialization
      rtmClient.current = AgoraRTM.createInstance(APP_ID);
      
      // Tạo unique user ID
      const userId = `${userRole}_${appointmentId}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Login RTM v1 with token (nếu cần)
      try {
        await rtmClient.current.login({ uid: userId });
        console.log('RTM logged in successfully');
      } catch (error) {
        await rtmClient.current.login({ uid: userId, token: '' });
        console.log('RTM logged in with empty token');
      }
      
      // Create and join channel RTM v1
      const channelName = getChannelName();
      
      if (!channelName || typeof channelName !== 'string') {
        throw new Error('Invalid channel name: ' + channelName);
      }
      
      rtmChannel.current = rtmClient.current.createChannel(channelName);
      await rtmChannel.current.join();
      
      // Setup event listeners cho RTM v1
      rtmChannel.current.on('ChannelMessage', (message, memberId) => {
        // Không hiển thị tin nhắn của chính mình
        if (memberId === userId) return;
        
        const isFromDoctor = memberId.includes('doctor');
        const newMsg = {
          id: `${Date.now()}_${Math.random()}`,
          text: message.text,
          sender: isFromDoctor ? 'doctor' : 'patient',
          timestamp: new Date().toISOString(),
          senderName: isFromDoctor ? 'Bác sĩ' : 'Bệnh nhân'
        };
        
        setMessages(prev => [...prev, newMsg]);
        
        // Log chat message
        if (videoCallLogger.current) {
          videoCallLogger.current.logChatMessage(
            isFromDoctor ? 'doctor' : 'patient',
            message.text,
            isFromDoctor ? 'Bác sĩ' : 'Bệnh nhân'
          );
        }
        
        if (!isChatOpenRef.current) {
          setUnreadCount(prev => prev + 1);
        }
      });
      
      // Member events cho RTM v1
      rtmChannel.current.on('MemberJoined', (memberId) => {
        const isDoctor = memberId.includes('doctor');
        const userName = isDoctor ? 'Bác sĩ' : 'Bệnh nhân';
        sendSystemMessage(`${userName} đã tham gia cuộc trò chuyện`);
      });
      
      rtmChannel.current.on('MemberLeft', (memberId) => {
        const isDoctor = memberId.includes('doctor');
        const userName = isDoctor ? 'Bác sĩ' : 'Bệnh nhân';
        sendSystemMessage(`${userName} đã rời khỏi cuộc trò chuyện`);
      });
      
      setChatConnected(true);
      setChatRetryCount(0); // Reset retry count khi thành công
      console.log('RTM chat connection established!');
      sendSystemMessage('🟢 Chat RTM v1 đã kết nối thành công!');
      
    } catch (error) {
      console.error('❌ RTM v1 initialization failed:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      setChatConnected(false);
      
      // Thông báo lỗi kết nối chat thay vì demo mode
      setMessages([
        {
          id: `error_${Date.now()}`,
          text: `❌ Không thể kết nối chat. Đang thử kết nối lại...`,
          sender: 'system',
          timestamp: new Date().toISOString(),
          senderName: 'Hệ thống',
          isError: true
        }
      ]);
      
      // Retry kết nối sau 5 giây thay vì demo mode (tối đa 3 lần)
      if (chatRetryCount < 3) {
        setChatRetryCount(prev => prev + 1);
        setTimeout(() => {
          initializeChatClient();
        }, 5000);
      } else {
        console.log('Max chat retry attempts reached. Chat will be disabled.');
        setMessages([
          {
            id: `error_${Date.now()}`,
            text: `❌ Không thể kết nối chat sau nhiều lần thử. Vui lòng kiểm tra kết nối mạng.`,
            sender: 'system',
            timestamp: new Date().toISOString(),
            senderName: 'Hệ thống',
            isError: true
          }
        ]);
      }
    }
  }, [userRole, appointmentId, sendSystemMessage, initializeDemoMode, getChannelName, chatRetryCount]);

  const sendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      sender: userRole,
      timestamp: new Date().toISOString(),
      senderName: getUserName()
    };
    
    // Add to local messages immediately for better UX
    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Log own chat message
    if (videoCallLogger.current) {
      videoCallLogger.current.logChatMessage(userRole, messageText.trim(), getUserName());
    }

    // Chat message logging removed - will be reimplemented
    
    try {
      // Send via RTM v1
      if (chatConnected && rtmChannel.current) {
        const messageObj = { text: messageText.trim() };
        await rtmChannel.current.sendMessage(messageObj);
      } else {
        // Thay vì localStorage, thông báo lỗi như messenger
        throw new Error('Chat chưa kết nối');
      }
      
    } catch (error) {
      console.error('❌ Failed to send RTM v1 message:', error);
      
      // Remove message from local state vì không gửi được
      setMessages(prev => prev.filter(m => m.id !== message.id));
      
      // Thông báo lỗi như messenger
      const errorMessage = {
        id: `error_${Date.now()}`,
        text: '❌ Tin nhắn không được gửi. Kiểm tra kết nối mạng.',
        sender: 'system',
        timestamp: new Date().toISOString(),
        senderName: 'Hệ thống',
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      // Tự động xóa thông báo lỗi sau 3 giây
      setTimeout(() => {
        setMessages(prev => prev.filter(m => m.id !== errorMessage.id));
      }, 3000);
      
      // Thử reconnect chat nếu chưa connected và chưa quá số lần retry
      if (!chatConnected && chatRetryCount < 3) {
        setTimeout(() => {
          initializeChatClient();
        }, 2000);
      }
    }
  }, [userRole, getUserName, chatConnected, sendSystemMessage, appointmentId]);

  const toggleChat = () => {
    const newState = !isChatOpen;
    setIsChatOpen(newState);
    isChatOpenRef.current = newState; // Cập nhật ref
    
    if (newState) {
      setUnreadCount(0); // Reset unread count when opening chat
    }
  };

  const cleanupChat = async () => {
    try {
      if (rtmChannel.current) {
        await rtmChannel.current.leave();
        rtmChannel.current = null;
      }
      if (rtmClient.current) {
        await rtmClient.current.logout();
        rtmClient.current = null;
      }
      setChatConnected(false);
      setMessages([]);
      console.log('RTM chat cleanup completed');
    } catch (error) {
      console.error('Failed to cleanup RTM chat:', error);
    }
  };

  // Check camera/microphone permissions
  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
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



  // Initialize Agora client
  const initializeAgoraClient = useCallback(async () => {
    // Prevent multiple initialization
    if (isConnecting || isConnected) {
      console.log('Agora client already initializing or connected, skipping...');
      return;
    }

    try {
      setIsConnecting(true);
      setConnectionStatus('connecting');
      setError(null);

      console.log('Initializing Agora client for channel:', getChannelName());

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

      // Set up event listeners
      client.current.on('user-published', handleUserPublished);
      client.current.on('user-unpublished', handleUserUnpublished);
      client.current.on('user-joined', handleUserJoined);
      client.current.on('user-left', handleUserLeft);
      client.current.on('connection-state-changed', handleConnectionStateChanged);

      // Join channel with dynamic token
      let retries = 2;
      let uid = null;
      const channelName = getChannelName();

      
      while (retries > 0 && !uid) {
        try {
          uid = await client.current.join(APP_ID, channelName, TOKEN, null);
          console.log('Joined channel successfully with UID:', uid);
          
          // Log current user joined
          if (videoCallLogger.current) {
            videoCallLogger.current.logUserJoined(userRole, uid);
          }
          
          break;
        } catch (joinError) {
          console.error('Join attempt failed:', joinError);
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          } else {
            throw joinError;
          }
        }
      }

      await createLocalTracks();
      
      // Set connected state BEFORE publishing
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
      
      await publishLocalTracks();
      
      // Logger notification removed - will be reimplemented
      
      // QUAN TRỌNG: Bỏ dòng này đi - không gọi initializeChatClient ở đây
      // await initializeChatClient();
    } catch (error) {
      console.error('Failed to initialize Agora client:', error);
      handleAgoraError(error);
      setConnectionStatus('disconnected');
      
      // Log connection error
      if (videoCallLogger.current) {
        videoCallLogger.current.logConnectionIssue('INITIALIZATION_FAILED', error.message);
      }
      
      // No automatic retry - user can manually retry if needed
    } finally {
      setIsConnecting(false);
    }
  }, [getChannelName, isConnecting, isConnected]);

  // FIX: Tách chat initialization thành useEffect riêng
  useEffect(() => {
    if (isConnected && !chatInitialized) {
      initializeChatClient();
      setChatInitialized(true);
    }
  }, [isConnected, chatInitialized]); // Remove function dependency

  const handleAgoraError = (error) => {
    console.error('Agora error details:', error);
    
    if (error.code === 'CAN_NOT_GET_GATEWAY_SERVER') {
      setError('Đang kết nối đến máy chủ video call...');
    } else if (error.code === 'INVALID_PARAMS') {
      setError('Đang thiết lập kết nối...');
    } else if (error.code === 'NOT_SUPPORTED') {
      setError('Trình duyệt của bạn không hỗ trợ video call. Vui lòng sử dụng Chrome, Firefox hoặc Safari.');
    } else if (error.name === 'NotAllowedError') {
      setError('Vui lòng cho phép truy cập camera và microphone để sử dụng video call.');
      setPermissionDenied(true);
    } else {
      setError(`Đang kết nối...`);
    }
  };

  const handleConnectionStateChanged = (curState, revState, reason) => {
    console.log('Connection state changed:', curState, 'Previous:', revState, 'Reason:', reason);
    
    // Don't update state if already in correct state to avoid loops
    if (curState === 'DISCONNECTED' && connectionStatus !== 'disconnected') {
      setConnectionStatus('disconnected');
      setIsConnected(false);
    } else if (curState === 'CONNECTED' && connectionStatus !== 'connected') {
      setConnectionStatus('connected');
      setIsConnected(true);
    } else if (curState === 'CONNECTING' && connectionStatus !== 'connecting') {
      setConnectionStatus('connecting');
    }
  };

  const createLocalTracks = async () => {
    try {
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

      // Simple video initialization - no DOM manipulation
      if (localContainer.current && localVideoTrack.current) {
        await localVideoTrack.current.play(localContainer.current);
      }
    } catch (error) {
      console.error('Failed to create local tracks:', error);
      throw error;
    }
  };

  const publishLocalTracks = async () => {
    try {
      // Check if client is in valid state for publishing
      if (!client.current) {
        console.log('No client available for publishing, skipping...');
        return;
      }

      // Additional check for connection state
      const connectionState = client.current.connectionState;
      if (connectionState !== 'CONNECTED') {
        console.log(`Client connection state is ${connectionState}, skipping publish...`);
        return;
      }

      const tracks = [];
      if (localAudioTrack.current) tracks.push(localAudioTrack.current);
      if (localVideoTrack.current) tracks.push(localVideoTrack.current);
      
      if (tracks.length > 0) {
        await client.current.publish(tracks);
        console.log('Published local tracks successfully');
      }
    } catch (error) {
      console.error('Failed to publish local tracks:', error);
      // Don't throw error - just log it to prevent crash
    }
  };

  const handleUserPublished = async (user, mediaType) => {
    try {
      await client.current.subscribe(user, mediaType);

      if (mediaType === 'video' && remoteContainer.current && user.videoTrack) {
        await user.videoTrack.play(remoteContainer.current);
        setHasRemoteUser(true);
        
        // Update remote users list
        setRemoteUsers(prev => {
          const existing = prev.find(u => u.uid === user.uid);
          if (existing) {
            return prev.map(u => u.uid === user.uid ? { ...u, hasVideo: true } : u);
          } else {
            return [...prev, { uid: user.uid, hasVideo: true, hasAudio: false }];
          }
        });
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
      }
    } catch (error) {
      console.error('Failed to subscribe to user:', error);
    }
  };

  const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === 'video') {
      setRemoteUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, hasVideo: false } : u));
      // Set hasRemoteUser to false khi không còn video
      setHasRemoteUser(false);
    }
    if (mediaType === 'audio') {
      setRemoteUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, hasAudio: false } : u));
    }
  };

  const handleUserJoined = (user) => {
    setRemoteUsers(prev => {
      const existing = prev.find(u => u.uid === user.uid);
      if (!existing) {
        // Log user joined event
        if (videoCallLogger.current) {
          const otherUserRole = userRole === 'doctor' ? 'patient' : 'doctor';
          videoCallLogger.current.logUserJoined(otherUserRole, user.uid);
        }
        return [...prev, { uid: user.uid, hasVideo: false, hasAudio: false }];
      }
      return prev;
    });
  };

  const handleUserLeft = (user) => {
    setHasRemoteUser(false);
    setRemoteUsers(prev => {
      // Log user left event
      if (videoCallLogger.current) {
        const otherUserRole = userRole === 'doctor' ? 'patient' : 'doctor';
        videoCallLogger.current.logUserLeft(otherUserRole, user.uid);
      }
      return prev.filter(u => u.uid !== user.uid);
    });
  };

  const toggleVideo = useCallback(async () => {
    if (isToggling) return; // Prevent multiple simultaneous toggles
    
    setIsToggling(true);
    
    try {
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
  }, [videoEnabled, isToggling]);

  const toggleAudio = useCallback(async () => {
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
  }, [audioEnabled]);

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
    // Luôn gỡ bỏ khóa khi dọn dẹp
    const lockKey = `video_call_lock_${appointmentId}_${userRole}`;
    localStorage.removeItem(lockKey);

    try {
      console.log('Cleaning up resources...');
      
      // Log current user leaving và lưu vào localStorage
      if (videoCallLogger.current) {
        console.log('📤 Starting video call log cleanup and save to localStorage...');
        videoCallLogger.current.logUserLeft(userRole, 'self_leaving');
        // End logging session và lưu vào localStorage
        videoCallLogger.current.endLogging();
        
        // Lưu log vào localStorage thay vì upload ngay
        try {
          videoCallLogger.current.saveLogToLocalStorage();
          console.log('💾 Video call log saved to localStorage successfully');
        } catch (saveError) {
          console.error('❌ Failed to save video call log to localStorage:', saveError);
        }
      } else {
        console.warn('⚠️ VideoCallLogger not found during cleanup');
      }
      
      // Cleanup chat first
      await cleanupChat();
      
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
      
      // Reset states
      setIsConnected(false);
      setHasRemoteUser(false);
      setRemoteUsers([]);
      setConnectionStatus('disconnected');
      // Participant count removed
      
    } catch (error) {
      console.error('Failed to cleanup resources:', error);
    }
  }, [appointmentId, userRole]);

  const leaveCall = async () => {
    try {
      await cleanupResources();
      
      // Kiểm tra xem có phải popup window không
      if (window.opener) {
        // Đây là popup window, đóng nó
        window.close();
      } else {
        // Đây là tab thường, navigate về trang chủ
        navigate('/');
      }
    } catch (error) {
      console.error('Failed to leave call:', error);
      // Fallback: luôn thử đóng window
      window.close();
    }
  };

  const requestPermissions = async () => {
    setPermissionDenied(false);
    setError(null);
    
    const hasPermission = await checkPermissions();
    if (hasPermission) {
      initializeAgoraClient();
    }
  };

  const retryConnection = () => {
    setError(null);
    setPermissionDenied(false);
    initializeAgoraClient();
  };

  // --- Simple Drag and Resize Handlers ---

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) return;
    setIsDragging(true);
    dragInfo.current = {
      startX: e.clientX - localVideoPosition.x,
      startY: e.clientY - localVideoPosition.y
    };
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragInfo.current.startX;
    const newY = e.clientY - dragInfo.current.startY;
    
    const padding = 10;
    const maxX = window.innerWidth - localVideoSize.width - padding;
    const maxY = window.innerHeight - localVideoSize.height - padding;
    
    setLocalVideoPosition({
      x: Math.max(padding, Math.min(newX, maxX)),
      y: Math.max(padding, Math.min(newY, maxY))
    });
  }, [isDragging, localVideoSize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    dragInfo.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: localVideoSize.width,
        startHeight: localVideoSize.height
    };
    document.body.style.cursor = 'nwse-resize';
  };

  const handleResizeMouseMove = useCallback((e) => {
    if (!isResizing) return;
    
    const { startX, startWidth } = dragInfo.current;
    const deltaX = e.clientX - startX;
    let newWidth = startWidth + deltaX;

    const minWidth = 120;
    const maxWidth = Math.min(window.innerWidth - 40, 600);
    if (newWidth < minWidth) newWidth = minWidth;
    if (newWidth > maxWidth) newWidth = maxWidth;

    const aspectRatio = 4 / 3;
    const newHeight = newWidth * aspectRatio;

    setLocalVideoSize({ width: newWidth, height: newHeight });
  }, [isResizing]);

  const handleResizeMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  useEffect(() => {
    if (isResizing) {
        window.addEventListener('mousemove', handleResizeMouseMove);
        window.addEventListener('mouseup', handleResizeMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleResizeMouseMove);
            window.removeEventListener('mouseup', handleResizeMouseUp);
        };
    }
  }, [isResizing, handleResizeMouseMove, handleResizeMouseUp]);

  useEffect(() => {
    // --- Session Locking ---
    const lockKey = `video_call_lock_${appointmentId}_${userRole}`;
    if (localStorage.getItem(lockKey)) {
      setError(
        "Cuộc gọi cho lịch hẹn này đang được thực hiện ở một cửa sổ hoặc thiết bị khác. Vui lòng đóng cửa sổ này."
      );
      setIsCallLocked(true);
      return; // Dừng mọi hành động khác
    }
    // Đặt khóa nếu chưa tồn tại
    localStorage.setItem(lockKey, 'true');
    // --- End Session Locking ---

    // Initialize Video Call Logger
    console.log('🔥 Initializing VideoCallLogger...');
    console.log('📋 appointmentId:', appointmentId);
    console.log('👤 userRole:', userRole);
    
    try {
      videoCallLogger.current = new VideoCallLogger(appointmentId, userRole);
      console.log('✅ VideoCallLogger created:', videoCallLogger.current);
      
      videoCallLogger.current.startLogging();
      console.log('🎬 VideoCallLogger startLogging() called');
    } catch (error) {
      console.error('❌ Error creating VideoCallLogger:', error);
    }

    // Set initial position to top right corner
    const initialX = window.innerWidth - 150 - 20; // Use fixed width instead of state
    setLocalVideoPosition({ x: initialX, y: 20 });
    
    // Always start with Agora
    initializeAgoraClient();

    // Cleanup on page unload
    const handleBeforeUnload = () => {
      // Clean up without closing window
      cleanupResources();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      cleanupResources();
    };
  }, [appointmentId, userRole]); // ONLY depend on static values, remove function dependencies

  const getStatusMessage = () => {
    if (permissionDenied) {
      return 'Cần quyền truy cập camera/microphone';
    }
    
    switch (connectionStatus) {
      case 'connecting':
        return 'Đang kết nối video call...';
      case 'connected':
        if (remoteUsers.length > 0) {
          const remoteUser = remoteUsers[0];
          const statusParts = [];
          if (remoteUser.hasVideo) statusParts.push('camera');
          if (remoteUser.hasAudio) statusParts.push('mic');
          
          if (statusParts.length > 0) {
            return `Đã kết nối với ${userRole === 'doctor' ? 'bệnh nhân' : 'bác sĩ'}`;
          } else {
            return `${userRole === 'doctor' ? 'Bệnh nhân' : 'Bác sĩ'} đã tham gia cuộc gọi`;
          }
        }
        return 'Sẵn sàng - Đang chờ đối phương...';
      default:
        return 'Đang thiết lập kết nối...';
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
            onClick={() => {
              // Kiểm tra xem có phải popup window không
              if (window.opener) {
                // Đây là popup window, đóng nó
                window.close();
              } else {
                // Đây là tab thường, navigate về trang chủ
                navigate('/');
              }
            }}
            className="me-3 back-button"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            {window.opener ? 'Đóng' : 'Quay lại'}
          </Button>
          <h5 className="text-white mb-0">
            <FontAwesomeIcon icon={faVideo} className="me-2" />
            Video Call - {getUserName()}
          </h5>
          {/* All logging UI removed - will be reimplemented */}
        </div>
        
        <div className="video-call-status">
          <div className="connection-indicator"></div>
          <small>{getStatusMessage()}</small>
          {isConnecting && <Spinner size="sm" className="ms-2" />}
        </div>
      </div>

      {/* Main Video Area - Bị ẩn đi nếu cuộc gọi bị khóa */}
      {!isCallLocked && (
        <>
          <div className="video-main-container">
            {/* Remote Video (Main) */}
            <div className="remote-video-container">
              {/* Remote video stream */}
              <div 
                ref={remoteContainer}
                className={`remote-video ${hasRemoteUser ? 'has-user' : 'no-user'}`}
                style={{ display: hasRemoteUser ? 'block' : 'none' }}
              />
              
              {/* Waiting/Camera off message overlay */}
              {!hasRemoteUser && (
                <div className="waiting-message">
                  <FontAwesomeIcon 
                    icon={remoteUsers.length > 0 ? faVideoSlash : faVideo} 
                    size="4x" 
                    className="waiting-icon" 
                  />
                  <h3>
                    {remoteUsers.length > 0
                      ? `${userRole === 'doctor' ? 'Bệnh nhân' : 'Bác sĩ'} đã tắt camera`
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
              
              {/* Remote user mic status indicator - hiển thị khi có remote user nhưng tắt mic */}
              {remoteUsers.length > 0 && !remoteUsers[0]?.hasAudio && (
                <div className="remote-mic-status">
                  <FontAwesomeIcon icon={faMicrophoneSlash} className="mic-off-icon" />
                  <span className="mic-status-text">
                    {userRole === 'doctor' ? 'Bệnh nhân' : 'Bác sĩ'} đã tắt mic
                  </span>
                </div>
              )}
              

            </div>

            {/* Local Video (Side / Center) */}
            <div 
              className={`local-video-container ${isDragging ? 'dragging' : ''}`}
              style={{
                width: `${localVideoSize.width}px`,
                height: `${localVideoSize.height}px`,
                left: `${localVideoPosition.x}px`,
                top: `${localVideoPosition.y}px`,
              }}
              onMouseDown={handleMouseDown}
            >
              {/* Video rendering target */}
              <div 
                ref={localContainer}
                className={`local-video ${!videoEnabled ? 'camera-off' : ''}`}
                style={{ display: videoEnabled ? 'block' : 'none' }}
              />
              
              {/* Camera off message overlay */}
              {!videoEnabled && (
                <div className={`local-video camera-off`}>
                  <div className="camera-off-message">
                    <FontAwesomeIcon icon={faVideoSlash} size="2x" className="mb-2" />
                    <p className="mb-0">Đã tắt camera</p>
                  </div>
                </div>
              )}

              {/* User label - always visible */}
              <div className="user-label">
                {getUserName()} (Bạn)
              </div>
              
              {/* Local mic status - always visible when mic is off */}
              {!audioEnabled && (
                <div className="local-mic-status">
                  <FontAwesomeIcon icon={faMicrophoneSlash} className="local-mic-off-icon" />
                </div>
              )}

              {/* Resize Handle */}
              <div className="resize-handle" onMouseDown={handleResizeMouseDown}></div>
            </div>
          </div>
        </>
      )}

      {/* Controls */}
      <div className="video-controls">
        <button
          className={`control-button ${audioEnabled ? 'audio-on' : 'audio-off'}`}
          onClick={toggleAudio}
          title={audioEnabled ? "Tắt microphone" : "Bật microphone"}
          disabled={!isConnected || isToggling}
        >
          <FontAwesomeIcon icon={audioEnabled ? faMicrophone : faMicrophoneSlash} />
        </button>
        
        <button
          className={`control-button ${videoEnabled ? 'video-on' : 'video-off'}`}
          onClick={toggleVideo}
          title={videoEnabled ? "Tắt camera" : "Bật camera"}
          disabled={!isConnected || isToggling}
        >
          <FontAwesomeIcon icon={videoEnabled ? faVideo : faVideoSlash} />
        </button>
        
        <button
          className={`control-button chat-button ${isChatOpen ? 'chat-open' : 'chat-closed'}`}
          onClick={toggleChat}
          title={isChatOpen ? "Đóng chat" : "Mở chat"}
        >
          <FontAwesomeIcon icon={isChatOpen ? faTimes : faComment} />
          {unreadCount > 0 && !isChatOpen && (
            <span className="chat-notification-badge">{unreadCount}</span>
          )}
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

      {/* Chat Panel */}
      {isChatOpen && (
        <div className={`chat-panel ${isChatOpen ? 'open' : ''}`}>
          <div className="chat-header">
            <h6 className="chat-title">
              <FontAwesomeIcon icon={faComment} />
              Chat với {userRole === 'doctor' ? 'bệnh nhân' : 'bác sĩ'}
            </h6>
            <button className="chat-close-btn" onClick={toggleChat}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
          
          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="no-messages">
                <FontAwesomeIcon icon={faComment} className="no-messages-icon" />
                <p>Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${
                    message.sender === userRole
                      ? 'message-own'
                      : message.sender === 'system'
                      ? message.isError ? 'message-error' : 'message-system'
                      : 'message-other'
                  }`}
                >
                  <div className="message-content">
                    {message.text}
                  </div>
                  <div className="message-info">
                    <span className="message-sender">{message.senderName}</span>
                    <span className="message-time">
                      {new Date(message.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="chat-input">
            <div className="chat-input-container">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Nhắn tin với ${userRole === 'doctor' ? 'bệnh nhân' : 'bác sĩ'}...`}
                className="chat-input-field"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(newMessage);
                  }
                }}
                maxLength={500}
              />
              <button
                className="chat-send-btn"
                onClick={() => sendMessage(newMessage)}
                disabled={!newMessage.trim()}
                title="Gửi tin nhắn"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      )}
     </div>
  ); 
};

export default VideoCallPage; 