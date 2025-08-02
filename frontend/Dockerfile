# 최적화된 Frontend Dockerfile
FROM node:22-alpine AS builder

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 관리자 최적화
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set audit false && \
    npm config set fund false

# package.json과 package-lock.json 복사 (캐시 최적화)
COPY package*.json ./

# 의존성 설치 (캐시 활용 최대화)
RUN npm ci --only=production --silent --no-audit --no-fund

# 소스 코드 복사
COPY . .

# 빌드 실행 (메모리 최적화)
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build

# 프로덕션 이미지
FROM nginx:alpine

# Nginx 설정
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]