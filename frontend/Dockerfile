# 가져올 이미지를 정의
FROM node:22 AS builder
# 경로 설정하기
WORKDIR /App/frontend
# package.json 워킹 디렉토리에 복사 (.은 설정한 워킹 디렉토리를 뜻함)
COPY package.json .
# 명령어 실행 (의존성 설치)
RUN npm install
# 현재 디렉토리의 모든 파일을 도커 컨테이너의 워킹 디렉토리에 복사한다.
COPY . .

# 각각의 명령어들은 한줄 한줄씩 캐싱되어 실행된다.
# package.json의 내용은 자주 바뀌진 않을 거지만
# 소스 코드는 자주 바뀌는데
# npm install과 COPY . . 를 동시에 수행하면
# 소스 코드가 조금 달라질때도 항상 npm install을 수행해서 리소스가 낭비된다.
# 🔥 핵심: Production 빌드 생성
RUN npm run build

# Stage 2: Production 단계 (Nginx 사용)
FROM nginx:alpine

# 🔥 수정: React SPA용 Nginx 설정 추가 (올바른 경로)
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 파일을 nginx html 디렉토리로 복사
COPY --from=builder /App/frontend/build /usr/share/nginx/html

# 3000번 포트 노출
EXPOSE 3000

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]