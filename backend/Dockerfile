# 최적화된 백엔드 Dockerfile
FROM python:3.12.0-slim AS base

# 빌드 인수
ARG DEBIAN_FRONTEND=noninteractive
ARG PIP_NO_CACHE_DIR=1
ARG PIP_DISABLE_PIP_VERSION_CHECK=1

# META DATA
LABEL version="1.0"
LABEL description="Optimized GWNU backend image"
LABEL maintainer="hwstar1204@gmail.com"

# 환경변수 설정
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# 시스템 패키지 설치 (최적화된 버전)
RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    netcat-openbsd \
    libmariadb-dev \
    gcc \
    default-jdk-headless \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Java 환경변수 설정
ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PATH=$PATH:$JAVA_HOME/bin
ENV LD_LIBRARY_PATH=/usr/local/lib:/usr/lib/x86_64-linux-gnu:$JAVA_HOME/lib/server

# pip 업그레이드
RUN pip install --upgrade pip

# 작업 디렉토리 설정
WORKDIR /App/backend

# requirements.txt 복사 및 의존성 설치 (최적화)
COPY requirements.txt /tmp/requirements.txt

# 중요한 패키지들을 순서대로 설치 (캐시 최적화)
RUN pip install --no-cache-dir mysqlclient==2.2.4 && \
    pip install --no-cache-dir -r /tmp/requirements.txt && \
    rm /tmp/requirements.txt

# 소스 코드 복사
COPY . .

# 불필요한 파일 정리
RUN find . -type f -name "*.pyc" -delete && \
    find . -type d -name "__pycache__" -delete

# 포트 노출
EXPOSE 8000

# 헬스체크 추가 (선택사항)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health/ || exit 1