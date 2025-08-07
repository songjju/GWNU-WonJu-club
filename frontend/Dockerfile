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

# 빌드 실행
RUN npm run build

# 프로덕션 이미지
FROM nginx:alpine

# 빌드 결과 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 포트 변경
RUN sed -i 's/80/3000/g' /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]