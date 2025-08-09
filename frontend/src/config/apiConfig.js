// frontend/src/config/apiConfig.js 수정

// 환경에 따른 API URL 설정
const getApiBaseUrl = () => {
  // 환경변수가 있으면 사용
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // 환경에 따른 기본값
  if (process.env.NODE_ENV === 'production') {
    return 'https://api.yourdomain.com';  // 프로덕션 API URL
  } else if (process.env.REACT_APP_ENV === 'staging') {
    return 'http://staging-backend-service:8000';  // 스테이징 API URL
  } else {
    return 'http://localhost:8000';  // 개발 환경 API URL
  }
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 API Base URL:', API_BASE_URL);

export default API_BASE_URL;