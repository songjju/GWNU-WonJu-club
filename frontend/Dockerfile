# 최적화된 Frontend Dockerfile (빌드 시간 단축)
FROM node:18-alpine AS builder

# 빌드 환경 최적화
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV GENERATE_SOURCEMAP=false
ENV DISABLE_ESLINT_PLUGIN=true
ENV TSC_COMPILE_ON_ERROR=true
ENV FAST_REFRESH=false

WORKDIR /app

# npm 설정 최적화
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set audit false && \
    npm config set fund false && \
    npm config set progress false && \
    npm config set loglevel error

# package.json만 먼저 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치 (최적화된 방법)
RUN npm ci --silent --no-audit --no-fund --prefer-offline

# 소스 코드 복사 (.dockerignore 활용 중요)
COPY . .

# 빌드 최적화 설정
RUN echo 'GENERATE_SOURCEMAP=false' > .env.production && \
    echo 'DISABLE_ESLINT_PLUGIN=true' >> .env.production && \
    echo 'TSC_COMPILE_ON_ERROR=true' >> .env.production

# 병렬 빌드 실행
RUN npm run build

# 프로덕션 이미지 (Alpine 기반)
FROM nginx:alpine

# 불필요한 파일 제거
RUN rm -rf /usr/share/nginx/html/* && \
    rm -f /etc/nginx/conf.d/default.conf

# 최적화된 nginx 설정
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 3000;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 압축 (성능 향상)
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        image/svg+xml;

    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # React Router 지원
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 헬스체크
    location /health {
        return 200 "healthy";
        add_header Content-Type text/plain;
        access_log off;
    }
}
EOF

# 빌드 결과물 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 권한 설정
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]