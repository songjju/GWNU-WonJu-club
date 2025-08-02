# 수정된 Frontend Dockerfile
FROM node:22-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 관리자 최적화
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set audit false && \
    npm config set fund false

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (수정된 버전)
RUN npm ci --omit=dev --silent --no-audit --no-fund

# 소스 코드 복사
COPY . .

# 빌드 실행
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# 프로덕션 이미지
FROM nginx:alpine

# 기존 기본 설정 파일 제거
RUN rm -f /etc/nginx/conf.d/default.conf

# 새로운 설정 파일 생성
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 3000;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html index.htm;

    # 보안 헤더
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip 압축 설정
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json
        application/xml
        image/svg+xml;

    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # React Router를 위한 설정 (SPA 지원)
    location / {
        try_files $uri $uri/ /index.html;
        
        # HTML 파일은 캐시하지 않음
        location ~* \.html$ {
            add_header Cache-Control "no-store, no-cache, must-revalidate";
        }
    }

    # API 프록시 설정 (백엔드 연결)
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket 지원 (챗봇용)
    location /ws/ {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 헬스체크 엔드포인트
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }

    # 에러 페이지 설정
    error_page 404 /index.html;
}
EOF

# 빌드된 React 앱 복사
COPY --from=builder /app/build /usr/share/nginx/html

# nginx 설정 테스트
RUN nginx -t

# 포트 노출
EXPOSE 3000

# 헬스체크 추가
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]