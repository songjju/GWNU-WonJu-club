# 가장 간단하고 강력한 Frontend Dockerfile
FROM node:16-alpine AS builder

WORKDIR /app

# package.json 복사
COPY package*.json ./

# 가장 기본적인 npm 설치 (옵션 최소화)
RUN npm install 

# 소스 코드 복사
COPY . .

# 빌드 환경변수 설정
ENV CI=true
ENV GENERATE_SOURCEMAP=false
ENV NODE_OPTIONS="--max-old-space-size=2048"
ENV TSC_COMPILE_ON_ERROR=true

# 빌드 실행 및 검증
RUN echo "=== 빌드 시작 전 검사 ===" && \
    ls -la src/ && \
    echo "=== package.json 스크립트 확인 ===" && \
    cat package.json | grep -A 5 '"scripts"' && \
    echo "=== 실제 빌드 실행 ===" && \
    npm run build && \
    echo "=== 빌드 결과 확인 ===" && \
    ls -la build/ && \
    echo "=== build/index.html 내용 미리보기 ===" && \
    head -20 build/index.html

# 프로덕션 이미지
FROM nginx:alpine

# 기존 nginx 기본 파일들 완전 제거
RUN rm -rf /usr/share/nginx/html/*

# 빌드 결과 복사 (더 명시적으로)
COPY --from=builder /app/build/* /usr/share/nginx/html/

# 복사 결과 확인
RUN echo "=== 복사 후 nginx html 디렉토리 확인 ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo "=== index.html 파일 확인 ===" && \
    head -10 /usr/share/nginx/html/index.html

# 커스텀 nginx 설정 파일 복사
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]