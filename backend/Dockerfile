# Python 3.12.0을 base image로 설정
FROM python:3.12.0

# META DATA
LABEL version="1.0"
LABEL description="This is a sample gwnu_backend image"
LABEL maintainer="hwstar1204@gmail.com"

# 파이썬 출력 버퍼링 없앰
ENV PYTHONUNBUFFERED=1

# 시스템 패키지 업데이트 및 필요한 의존성 설치 (Java 포함)
RUN apt-get update && apt-get install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    netcat-traditional \
    libmariadb-dev \
    gcc \
    default-jdk \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Java 환경변수 설정 (KoNLPy용)
ENV JAVA_HOME=/usr/lib/jvm/default-java
ENV PATH=$PATH:$JAVA_HOME/bin

# LD_LIBRARY_PATH를 기본값부터 설정 (수정된 부분)
ENV LD_LIBRARY_PATH=/usr/local/lib:/usr/lib/x86_64-linux-gnu:$JAVA_HOME/lib/server

# Java 설치 확인
RUN java -version && echo "Java installation verified"

# pip 업그레이드
RUN pip install --upgrade pip

# 도커 파일에서 작업 디렉토리를 프로젝트 디렉토리로 설정
WORKDIR /App/backend

# requirements.txt를 먼저 복사하고 mysqlclient 설치
COPY ./requirements.txt /requirements.txt

# mysqlclient를 먼저 개별적으로 설치
RUN pip install mysqlclient==2.2.4

# 나머지 requirements 설치
RUN pip install -r /requirements.txt

# KoNLPy 설치 확인 (선택사항)
RUN python -c "import jpype; print('JPype JVM Path:', jpype.getDefaultJVMPath())" || echo "JPype not yet installed"

# 현재 디렉토리에 있는 모든 파일을 작업 디렉토리로 복사
COPY . .

# django 서버의 포트를 8000로 지정하였므로 Docker의 컨테이너 또한 8000 포트를 열어줍니다.
EXPOSE 8000