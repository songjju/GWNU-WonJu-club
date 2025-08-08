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

# 빌드 전 상태 확인 (단계별 분리)
RUN echo "=== 빌드 전 검사 ===" && ls -la src/

# 실제 빌드 실행 (오류 발생 시 중단)
RUN npm run build

# 빌드 후 검증 (빌드 성공 시에만 실행)
RUN echo "=== 빌드 완료 후 확인 ===" && \
    ls -la build/ && \
    echo "첫 번째 파일들:" && \
    ls build/ | head -5

# 프로덕션 이미지
FROM nginx:alpine

# 기존 nginx 기본 파일들 완전 제거
RUN rm -rf /usr/share/nginx/html/*

# 빌드 결과 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 커스텀 nginx 설정 파일 복사
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]