import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ChatBot.css";
import logo from "../Assets/chatbot.png";
import { API_BASE_URL } from "../config/apiConfig"; // 기존 apiConfig에서 API_BASE_URL만 import

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatBoxRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('연결 중...');
  const messageIndex = useRef(0); // 메시지 인덱스를 저장하는 ref

  // API_BASE_URL을 기반으로 WebSocket URL 생성
  const getWebSocketUrl = () => {
    // HTTP/HTTPS를 WS/WSS로 변환
    const wsUrl = API_BASE_URL.replace('http://', 'ws://').replace('https://', 'wss://') + '/ws/chat/';
    return wsUrl;
  };

  const handleUserInput = useCallback((e) => {
    setUserInput(e.target.value);
  }, []);

  const handleKeyPress = async (e) => {
    if (e.key === "Enter" && userInput.trim()) {
      const newMessage = {
        type: "user",
        text: userInput,
        index: messageIndex.current++ // 메시지 인덱스를 추가하고 증가
      };

      setMessages((prevMessages) => [newMessage, ...prevMessages]);

      // 웹소켓 서버로 메시지 전송
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ 'Query': newMessage.text }));
        console.log('전송된 메시지:', JSON.stringify({ 'Query': newMessage.text }));
        setUserInput("");
      } else {
        console.log('WebSocket 연결이 존재하지 않거나 연결되지 않았습니다.');
        setMessages((prevMessages) => [
          {
            type: "bot",
            text: "죄송합니다. 서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.",
            index: messageIndex.current++
          },
          ...prevMessages
        ]);
      }
    }
  };

  useEffect(() => {
    // 스크롤
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }

    // 기존 apiConfig의 API_BASE_URL을 기반으로 WebSocket URL 생성
    const wsUrl = getWebSocketUrl();
    console.log('🚀 API Base URL:', API_BASE_URL);
    console.log('🔌 WebSocket 연결 시도:', wsUrl);
    
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = (event) => {
      console.log('✅ WebSocket 연결이 열렸습니다.');
      console.log('🌐 연결된 주소:', wsUrl);
      setConnectionStatus('연결됨');
      
      // 연결 성공 메시지 추가
      setMessages((prevMessages) => [
        {
          type: "bot",
          text: "안녕하세요! 강릉원주대 동아리에 대해 궁금한 것이 있으시면 언제든 물어보세요! 😊",
          index: messageIndex.current++
        },
        ...prevMessages
      ]);
    };

    newSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('📨 서버로부터 메시지:', data.Answer);
      
      if (data.Answer != null) {
        setMessages((prevMessages) => [
          {
            type: "bot",
            text: data.Answer,
            index: messageIndex.current++ // 메시지 인덱스를 추가하고 증가
          },
          ...prevMessages
        ]);
      } else {
        setMessages((prevMessages) => [
          {
            type: "bot",
            text: "현재 답변 할 수 없는 질문입니다. 다른 질문을 해보시겠어요?",
            index: messageIndex.current++ // 메시지 인덱스를 추가하고 증가
          },
          ...prevMessages
        ]);
      }
    };

    newSocket.onclose = (event) => {
      console.log('❌ WebSocket 연결이 닫혔습니다.');
      console.log('종료 코드:', event.code, '이유:', event.reason);
      setConnectionStatus('연결 끊김');
    };

    newSocket.onerror = (error) => {
      console.log('🚫 WebSocket 에러:', error);
      console.log('❌ 연결 시도한 주소:', wsUrl);
      console.log('💡 확인사항:');
      console.log('  - Django 서버가 실행 중인가요?');
      console.log('  - WebSocket 엔드포인트가 활성화되어 있나요?');
      console.log('  - 방화벽이 8000번 포트를 차단하고 있지 않나요?');
      setConnectionStatus('연결 실패');
      
      // 연결 실패 메시지 추가
      setMessages((prevMessages) => [
        {
          type: "bot",
          text: "서버 연결에 실패했습니다. 서버 상태를 확인해주세요.",
          index: messageIndex.current++
        },
        ...prevMessages
      ]);
    };

    setSocket(newSocket);

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, []);

  return (
    <div className="chat-container" ref={chatBoxRef}>
      <div className="chat-header">
        <img src={logo} alt="Logo" />
        <strong>강원동</strong>
        <span className="connection-status" style={{
          marginLeft: '10px',
          fontSize: '12px',
          color: connectionStatus === '연결됨' ? '#4CAF50' : '#f44336'
        }}>
          {connectionStatus}
        </span>
      </div>
      <div className="chat-box">
        {messages.map((message) => (
          <Message key={message.index} message={message} />
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInput}
          onKeyPress={handleKeyPress}
          placeholder={
            connectionStatus === '연결됨' 
              ? "질문을 입력하세요..." 
              : "서버 연결을 확인 중..."
          }
          disabled={connectionStatus !== '연결됨'}
        />
      </div>
    </div>
  );
};

const Message = React.memo(({ message }) => (
  <div className={`chat-message ${message.type}-message`}>
    {message.type === "bot" && (
      <div className="bot-info">
        <img src={logo} alt="원동이" />
        <span>원동이</span>
      </div>
    )}
    {message.text}
  </div>
));

export default ChatBot;