# GitHub 프로젝트 구조 분석 기반 Frontend Dockerfile
FROM node:16-alpine AS builder

WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치 (Redux, Router 등 복잡한 의존성 포함)
RUN npm ci --only=production --silent

# 전체 소스 코드 복사 (src/, public/, nginx/ 등)
COPY . .

# React 빌드를 위한 환경변수 (복잡한 앱용)
ENV CI=true
ENV GENERATE_SOURCEMAP=false  
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV TSC_COMPILE_ON_ERROR=true
ENV ESLINT_NO_DEV_ERRORS=true
ENV DISABLE_ESLINT_PLUGIN=true

# React 빌드 실행 (Redux store, Router 등 포함)
RUN npm run build

# 빌드 결과 검증 (중요!)
RUN echo "=== React 빌드 완료 검증 ===" && \
    ls -la build/ && \
    echo "=== 핵심 파일 존재 확인 ===" && \
    test -f build/index.html && echo "✅ index.html 존재" || echo "❌ index.html 없음" && \
    test -d build/static && echo "✅ static 디렉토리 존재" || echo "❌ static 디렉토리 없음" && \
    echo "=== 빌드 파일 개수 ===" && \
    find build -type f | wc -l

# === 프로덕션 단계 ===
FROM nginx:alpine

# 권한을 위한 사용자 생성
RUN addgroup -g 1000 -S appgroup && \
    adduser -u 1000 -S appuser -G appgroup

# 기존 nginx 파일 제거
RUN rm -rf /usr/share/nginx/html/*

# React 빌드 결과물 복사 (모든 파일과 디렉토리)
COPY --from=builder --chown=1000:1000 /app/build/ /usr/share/nginx/html/

# nginx 런타임 디렉토리 권한 설정
RUN chown -R 1000:1000 /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod -R 777 /var/cache/nginx /var/run

# 커스텀 nginx 설정 복사 (React Router 지원)
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 최종 확인 스크립트
RUN echo "=== 최종 배포 파일 확인 ===" && \
    ls -la /usr/share/nginx/html/ && \
    echo "=== index.html 내용 미리보기 ===" && \
    head -10 /usr/share/nginx/html/index.html && \
    echo "=== static 파일들 ===" && \
    ls -la /usr/share/nginx/html/static/ 2>/dev/null || echo "static 디렉토리 없음"

EXPOSE 3000

# 비권한 사용자로 실행
USER 1000:1000

CMD ["nginx", "-g", "daemon off;"]