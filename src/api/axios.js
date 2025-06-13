// src/api/axios.js
import axios from 'axios';

// ✅ axios 인스턴스 생성
const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080', // ✅ 백엔드 서버 URL 설정 (매우 중요!) (added)
    withCredentials: true, // ✅ 쿠키 자동 포함 (매우 중요!)
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// ✅ 요청 인터셉터
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('🚀 [axios] 요청:', config.method?.toUpperCase(), config.url);
        console.log('🔧 [axios] 요청 설정:', {
            withCredentials: config.withCredentials,
            headers: config.headers
        });

        // ✅ Authorization 헤더가 있으면 제거 (added)
        if (config.headers['Authorization']) {
            console.warn('⚠️ [axios] Authorization 헤더 감지 - 쿠키 기반 인증을 사용하므로 제거합니다');
            delete config.headers['Authorization'];
        }

        return config;
    },
    (error) => {
        console.error('❌ [axios] 요청 에러:', error);
        return Promise.reject(error);
    }
);

// ✅ 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('✅ [axios] 응답:', response.status, response.config.url);

        // ✅ 응답 헤더 전체 확인 (added)
        console.log('📋 [axios] 응답 헤더:', response.headers);

        // ✅ Set-Cookie 헤더 확인
        const setCookieHeaders = response.headers['set-cookie'];
        if (setCookieHeaders) {
            console.log('🍪 [axios] 서버에서 쿠키 설정 시도:', setCookieHeaders);
        }

        // ✅ 브라우저 개발자 도구에서 Application > Cookies 확인 권장 (added)
        console.log('💡 [axios] 쿠키 확인: 브라우저 개발자 도구 > Application > Cookies > http://localhost:3000');

        return response;
    },
    (error) => {
        console.error('❌ [axios] 응답 에러:', error.response?.status, error.config?.url);
        console.error('❌ [axios] 에러 상세:', error.response?.data); // ✅ 에러 상세 추가 (added)
        return Promise.reject(error);
    }
);

export { axiosInstance };
export default axiosInstance;