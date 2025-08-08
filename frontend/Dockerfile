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

# 빌드 실행
RUN npm run build

# 빌드 결과 확인
RUN echo "=== 빌드 결과 확인 ===" && \
    ls -la build/ && \
    echo "build 디렉토리 파일 수:" && \
    find build -type f | wc -l

# 프로덕션 이미지
FROM nginx:alpine

# nginx 사용자로 실행하기 위한 설정
RUN addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

# 기존 nginx 기본 파일들 제거
RUN rm -rf /usr/share/nginx/html/*

# 빌드 결과 복사 및 권한 설정
COPY --from=builder --chown=1000:1000 /app/build /usr/share/nginx/html

# nginx 디렉토리 권한 설정
RUN chown -R 1000:1000 /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod -R 777 /var/cache/nginx /var/run

# 커스텀 nginx 설정 파일 복사
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 복사 후 최종 확인
RUN echo "=== 최종 파일 확인 ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo "index.html 존재 여부:" && \
    test -f /usr/share/nginx/html/index.html && echo "✅ index.html 존재" || echo "❌ index.html 없음"

EXPOSE 3000

# 사용자 변경
USER 1000:1000

CMD ["nginx", "-g", "daemon off;"]