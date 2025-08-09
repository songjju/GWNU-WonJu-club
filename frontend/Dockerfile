# 디버깅용 Dockerfile
FROM node:22 AS builder
WORKDIR /App/frontend

# package.json 복사
COPY package*.json ./

# 환경변수 설정
ENV DISABLE_ESLINT_PLUGIN=true
ENV CI=false
ENV GENERATE_SOURCEMAP=false

# 의존성 설치
RUN npm install --include=dev

# 소스코드 복사
COPY . .

# 🔥 디버깅: 빌드 전 상태 확인
RUN echo "=== 빌드 전 파일 확인 ===" && \
    ls -la && \
    echo "=== package.json 스크립트 확인 ===" && \
    cat package.json | grep -A 10 '"scripts"' && \
    echo "=== 빌드 시작 ===" && \
    npm run build && \
    echo "=== 빌드 완료 후 확인 ===" && \
    ls -la && \
    echo "=== build 폴더 확인 ===" && \
    ls -la build/ 2>/dev/null || echo "❌ build 폴더가 없습니다!" && \
    echo "=== build 폴더 내용 ===" && \
    find build -type f 2>/dev/null || echo "❌ build 폴더에 파일이 없습니다!"

# Stage 2: Production
FROM nginx:alpine

# 기본 파일 제거
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/*

# nginx 설정
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 🔥 디버깅: 복사 전후 확인
RUN echo "=== 복사 전 nginx 디렉토리 ===" && \
    ls -la /usr/share/nginx/html/

COPY --from=builder /App/frontend/build /usr/share/nginx/html

RUN echo "=== 복사 후 nginx 디렉토리 ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo "=== 파일 개수 ===" && \
    find /usr/share/nginx/html -type f | wc -l

RUN chmod -R 755 /usr/share/nginx/html

# 3000번 포트 노출
EXPOSE 3000

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]