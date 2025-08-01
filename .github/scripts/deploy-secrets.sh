#!/bin/bash

# GitHub Actions에서 실행되는 시크릿 배포 스크립트
# 사용법: ./deploy-secrets.sh <environment> <kubeconfig_data>

set -euo pipefail

ENVIRONMENT=$1
KUBECONFIG_DATA=$2

echo "🔐 Deploying secrets to ${ENVIRONMENT} environment..."

# kubeconfig 설정
echo "${KUBECONFIG_DATA}" | base64 -d > /tmp/kubeconfig
export KUBECONFIG=/tmp/kubeconfig
chmod 600 /tmp/kubeconfig

# 네임스페이스 생성 (존재하지 않는 경우)
NAMESPACE="club-platform-${ENVIRONMENT}"
echo "📦 Creating namespace: ${NAMESPACE}"
kubectl create namespace "${NAMESPACE}" --dry-run=client -o yaml | kubectl apply -f -

# 네임스페이스에 라벨 추가
kubectl label namespace "${NAMESPACE}" environment="${ENVIRONMENT}" --overwrite

# Backend secrets 생성/업데이트
echo "🔐 Creating backend secrets for ${ENVIRONMENT}..."
kubectl create secret generic backend-secrets \
  --from-literal=secret-key="${SECRET_KEY}" \
  --from-literal=email-host-user="${EMAIL_HOST_USER}" \
  --from-literal=email-host-password="${EMAIL_HOST_PASSWORD}" \
  --from-literal=db-password="${DB_PASSWORD}" \
  --namespace="${NAMESPACE}" \
  --dry-run=client -o yaml | kubectl apply -f - 

# MySQL secrets 생성/업데이트
echo "🔐 Creating MySQL secrets for ${ENVIRONMENT}..."
kubectl create secret generic mysql-secrets \
  --from-literal=root-password="${MYSQL_ROOT_PASSWORD}" \
  --from-literal=user-password="${DB_PASSWORD}" \
  --namespace="${NAMESPACE}" \
  --dry-run=client -o yaml | kubectl apply -f -

# Secret 검증
echo "🔍 Verifying secrets..."
kubectl get secrets -n "${NAMESPACE}"

# Secret이 올바르게 생성되었는지 확인
for secret in backend-secrets mysql-secrets; do
  if kubectl get secret "${secret}" -n "${NAMESPACE}" &>/dev/null; then
    echo "✅ Secret ${secret} created successfully"
  else
    echo "❌ Failed to create secret ${secret}"
    exit 1
  fi
done

# cleanup
rm -f /tmp/kubeconfig

echo "✅ All secrets deployed successfully to ${ENVIRONMENT}"

# 배포 로그 저장 (옵션)
echo "📝 Deployment log: $(date) - Secrets deployed to ${ENVIRONMENT}" >> /tmp/deployment.log