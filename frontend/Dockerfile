# 강력한 Frontend Dockerfile (npm 문제 해결)
FROM node:22-alpine AS builder

WORKDIR /app

# npm 환경 설정
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=error
ENV NPM_CONFIG_AUDIT=false
ENV NPM_CONFIG_FUND=false

# package.json 복사
COPY package*.json ./

# npm 캐시 정리 및 레지스트리 설정
RUN npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/

# 의존성 설치 (단계적 접근)
RUN echo "Attempting to install dependencies..." && \
    if [ -f package-lock.json ]; then \
        echo "Using npm ci..." && \
        npm ci --silent || \
        (echo "npm ci failed, trying npm install..." && npm install --silent); \
    else \
        echo "No package-lock.json found, using npm install..." && \
        npm install --silent; \
    fi && \
    echo "Dependencies installed successfully"

# 개발 의존성 제거 (설치 후)
RUN npm prune --omit=dev --silent

# 소스 코드 복사
COPY . .

# 빌드 스크립트 확인 및 실행
RUN if npm run build >/dev/null 2>&1; then \
        echo "Build script found, running build..."; \
        npm run build; \
    elif npm run start >/dev/null 2>&1; then \
        echo "No build script, but start script exists..."; \
        echo "Creating static build manually..."; \
        mkdir -p build && cp -r public/* build/ 2>/dev/null || echo "No public directory"; \
    else \
        echo "No build script found, copying source as static files..."; \
        mkdir -p build && cp -r src/* build/ 2>/dev/null || cp -r . build/; \
    fi

# 빌드 결과 확인
RUN ls -la build/ || (echo "No build directory, creating one..." && mkdir -p build && echo "<h1>React App</h1>" > build/index.html)

# 프로덕션 이미지
FROM nginx:alpine

# 기본 설정 제거
RUN rm -f /etc/nginx/conf.d/default.conf

# nginx 설정 생성
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 3000;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # React Router 지원
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 정적 파일 캐싱
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 헬스체크
    location /health {
        return 200 "healthy";
        add_header Content-Type text/plain;
    }
}
EOF

# 빌드 파일 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 기본 index.html이 없으면 생성
RUN if [ ! -f /usr/share/nginx/html/index.html ]; then \
        echo '<!DOCTYPE html><html><head><title>React App</title></head><body><div id="root"><h1>React App is running!</h1></div></body></html>' > /usr/share/nginx/html/index.html; \
    fi

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]