#!/bin/bash

# Kubernetes 시크릿 업데이트 스크립트
# 로컬 개발이나 운영 중 시크릿 업데이트 시 사용

set -euo pipefail

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 도움말 함수
show_help() {
    echo "사용법: $0 <environment> [options]"
    echo ""
    echo "환경:"
    echo "  staging     스테이징 환경"
    echo "  production  프로덕션 환경"
    echo ""
    echo "옵션:"
    echo "  -h, --help     이 도움말 표시"
    echo "  -v, --verify   시크릿 검증만 수행"
    echo "  -f, --file     .env 파일에서 읽기"
    echo ""
    echo "예시:"
    echo "  $0 staging"
    echo "  $0 production --verify"
    echo "  $0 staging --file .env.staging"
}

# 환경변수 검증 함수
validate_env_vars() {
    local missing_vars=()
    
    for var in SECRET_KEY EMAIL_HOST_USER EMAIL_HOST_PASSWORD DB_PASSWORD MYSQL_ROOT_PASSWORD; do
        if [[ -z "${!var:-}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        echo -e "${RED}❌ 다음 환경변수가 누락되었습니다:${NC}"
        printf '  - %s\n' "${missing_vars[@]}"
        echo ""
        echo -e "${YELLOW}💡 다음 방법으로 설정할 수 있습니다:${NC}"
        echo "  export SECRET_KEY='your-secret-key'"
        echo "  또는"
        echo "  $0 staging --file .env.staging"
        exit 1
    fi
    
    echo -e "${GREEN}✅ 모든 필수 환경변수가 설정되었습니다${NC}"
}

# 시크릿 검증 함수
verify_secrets() {
    local environment=$1
    local namespace="club-platform-${environment}"

    echo -e "${BLUE}🔍 ${environment} 환경의 시크릿을 검증 중...${NC}"

    # 네임스페이스 존재 확인
    if ! kubectl get namespace "${namespace}" &>/dev/null; then
        echo -e "${RED}❌ 네임스페이스 ${namespace}이 존재하지 않습니다${NC}"
        return 1
    fi

    # 시크릿 존재 확인
    for secret in backend-secrets mysql-secrets; do
        if kubectl get secret "${secret}" -n "${namespace}" &>/dev/null; then
            echo -e "${GREEN}✅ ${secret} 존재함${NC}"
            
            # 시크릿 키 확인
            local keys
            keys=$(kubectl get secret "${secret}" -n "${namespace}" -o jsonpath='{.data}' | jq -r 'keys[]')
            echo -e "${BLUE}   키: ${keys//$'\n'/, }${NC}"
        else
            echo -e "${RED}❌ ${secret} 누락됨${NC}"
            return 1
        fi
    done

    echo -e "${GREEN}✅ 모든 시크릿이 올바르게 설정되었습니다${NC}"
}

# .env 파일 로드 함수
load_env_file() {
    local env_file=$1
    
    if [[ ! -f "$env_file" ]]; then
        echo -e "${RED}❌ 환경변수 파일 ${env_file}을 찾을 수 없습니다${NC}"
        exit 1
    fi
    
    echo -e "${BLUE}📁 ${env_file}에서 환경변수를 로드 중...${NC}"
    
    # .env 파일 읽기 (주석과 빈 줄 제외)
    while IFS= read -r line; do
        # 주석과 빈 줄 건너뛰기
        [[ "$line" =~ ^[[:space:]]*# ]] && continue
        [[ -z "$line" ]] && continue
        
        # 환경변수 설정
        if [[ "$line" =~ ^[[:space:]]*([^=]+)=(.*)$ ]]; then
            export "${BASH_REMATCH[1]}"="${BASH_REMATCH[2]}"
        fi
    done < "$env_file"
    
    echo -e "${GREEN}✅ 환경변수 로드 완료${NC}"
}

# 메인 함수
main() {
    local environment=""
    local verify_only=false
    local env_file=""
    
    # 인자 파싱
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -v|--verify)
                verify_only=true
                shift
                ;;
            -f|--file)
                env_file="$2"
                shift 2
                ;;
            staging|production)
                environment="$1"
                shift
                ;;
            *)
                echo -e "${RED}❌ 알 수 없는 옵션: $1${NC}"
                show_help
                exit 1
                ;;
        esac
    done
    
    # 환경 검증
    if [[ -z "$environment" ]]; then
        echo -e "${RED}❌ 환경을 지정해주세요 (staging 또는 production)${NC}"
        show_help
        exit 1
    fi
    
    echo -e "${BLUE}🚀 ${environment} 환경 시크릿 관리 시작${NC}"
    
    # .env 파일 로드 (지정된 경우)
    if [[ -n "$env_file" ]]; then
        load_env_file "$env_file"
    fi
    
    # 검증만 수행하는 경우
    if [[ "$verify_only" == true ]]; then
        verify_secrets "$environment"
        exit 0
    fi
    
    # 환경변수 검증
    validate_env_vars
    
    # 네임스페이스 및 시크릿 업데이트
    local namespace="club-platform-${environment}"
    
    echo -e "${BLUE}📦 네임스페이스 생성/업데이트: ${namespace}${NC}"
    kubectl create namespace "${namespace}" --dry-run=client -o yaml | kubectl apply -f -
    kubectl label namespace "${namespace}" environment="${environment}" --overwrite
    
    echo -e "${BLUE}🔐 Backend secrets 업데이트...${NC}"
    kubectl create secret generic backend-secrets \
      --from-literal=secret-key="${SECRET_KEY}" \
      --from-literal=email-host-user="${EMAIL_HOST_USER}" \
      --from-literal=email-host-password="${EMAIL_HOST_PASSWORD}" \
      --from-literal=db-password="${DB_PASSWORD}" \
      --namespace="${namespace}" \
      --dry-run=client -o yaml | kubectl apply -f -
    
    echo -e "${BLUE}🔐 MySQL secrets 업데이트...${NC}"
    kubectl create secret generic mysql-secrets \
      --from-literal=root-password="${MYSQL_ROOT_PASSWORD}" \
      --from-literal=user-password="${DB_PASSWORD}" \
      --namespace="${namespace}" \
      --dry-run=client -o yaml | kubectl apply -f -
    
    # 업데이트 후 검증
    verify_secrets "$environment"
    
    echo -e "${GREEN}🎉 ${environment} 환경 시크릿 업데이트 완료!${NC}"
}

# 스크립트 실행
main "$@"