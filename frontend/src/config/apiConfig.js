// frontend/src/config/apiConfig.js
// 현재 환경에 따라 API URL을 동적으로 설정

const getApiBaseUrl = () => {
  // 환경 변수가 설정되어 있으면 우선 사용
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // 현재 호스트 주소 추출
  const currentHost = window.location.hostname;
  
  // localhost나 127.0.0.1이면 실제 서버 IP로 변경
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    return 'http://192.168.0.14:8000';
  }
  
  // 그 외의 경우 현재 호스트의 8000 포트 사용
  return `http://${currentHost}:8000`;
};

export const API_BASE_URL = getApiBaseUrl();

console.log('🚀 API Base URL:', API_BASE_URL);

export default API_BASE_URL;