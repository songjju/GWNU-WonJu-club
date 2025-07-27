#!/usr/bin/env python3
"""
환경변수 검증 스크립트
CI/CD 파이프라인에서 민감한 정보가 올바르게 설정되었는지 확인
"""

import os
import sys
import re
import base64
import json
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

class Severity(Enum):
    ERROR = "ERROR"
    WARNING = "WARNING"
    INFO = "INFO"

@dataclass
class ValidationResult:
    name: str
    passed: bool
    message: str
    severity: Severity

class SecretValidator:
    """시크릿 검증 클래스"""
    
    # 필수 환경변수 정의
    REQUIRED_SECRETS = {
        'SECRET_KEY': {
            'min_length': 30,
            'pattern': r'^[a-zA-Z0-9@#$%^&*()_+\-=\[\]{}|;:,.<>?]+$',
            'description': 'Django secret key',
            'severity': Severity.ERROR
        },
        'EMAIL_HOST_PASSWORD': {
            'min_length': 8,
            'pattern': r'^[a-z]{16}$',  # Gmail 앱 비밀번호 형태
            'description': 'Gmail app password',
            'severity': Severity.ERROR
        },
        'DB_PASSWORD': {
            'min_length': 4,
            'pattern': r'^.*$',
            'description': 'Database password',
            'severity': Severity.ERROR
        },
        'MYSQL_ROOT_PASSWORD': {
            'min_length': 4,
            'pattern': r'^.*$',
            'description': 'MySQL root password',
            'severity': Severity.ERROR
        }
    }
    
    OPTIONAL_SECRETS = {
        'EMAIL_HOST_USER': {
            'pattern': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
            'description': 'Email host user (should be valid email)',
            'severity': Severity.WARNING
        },
        'DB_USER': {
            'min_length': 3,
            'pattern': r'^[a-zA-Z0-9_]+$',
            'description': 'Database user',
            'severity': Severity.WARNING
        }
    }

    def __init__(self, verbose: bool = False):
        self.verbose = verbose
        self.results: List[ValidationResult] = []

    def validate_env_var(self, name: str, value: str, requirements: Dict) -> ValidationResult:
        """개별 환경변수 검증"""
        if not value:
            return ValidationResult(
                name=name,
                passed=False,
                message=f"{name} is empty or not set",
                severity=requirements.get('severity', Severity.ERROR)
            )

        # 길이 검증
        min_length = requirements.get('min_length', 0)
        if len(value) < min_length:
            return ValidationResult(
                name=name,
                passed=False,
                message=f"{name} is too short (minimum {min_length} characters, got {len(value)})",
                severity=requirements.get('severity', Severity.ERROR)
            )

        # 패턴 검증
        pattern = requirements.get('pattern')
        if pattern and not re.match(pattern, value):
            return ValidationResult(
                name=name,
                passed=False,
                message=f"{name} does not match required pattern",
                severity=requirements.get('severity', Severity.ERROR)
            )
        
        return ValidationResult(
            name=name,
            passed=True,
            message=f"{name}: {requirements['description']} - OK",
            severity=Severity.INFO
        )

    def check_secret_exposure(self, value: str) -> bool:
        """시크릿이 노출 위험한 값인지 확인"""
        dangerous_patterns = [
            r'password',
            r'12345',
            r'admin',
            r'test',
            r'dev',
            r'demo',
            r'default'
        ]  

        value_lower = value.lower()
        for pattern in dangerous_patterns:
            if re.search(pattern, value_lower):
                return True
        return False
    
    def validate_base64_kubeconfig(self, name: str, value: str) -> ValidationResult:
        """Base64로 인코딩된 kubeconfig 검증"""
        try:
            decoded = base64.b64decode(value).decode('utf-8')
            config = json.loads(decoded) if decoded.startswith('{') else None
            
            if config is None:
                # YAML 형태일 수 있음
                if 'apiVersion' in decoded and 'clusters' in decoded:
                    return ValidationResult(
                        name=name,
                        passed=True,
                        message=f"{name}: Valid kubeconfig format",
                        severity=Severity.INFO
                    )
            else:
                if 'clusters' in config and 'users' in config:
                    return ValidationResult(
                        name=name,
                        passed=True,
                        message=f"{name}: Valid kubeconfig JSON format",
                        severity=Severity.INFO
                    )
            
            return ValidationResult(
                name=name,
                passed=False,
                message=f"{name}: Invalid kubeconfig format",
                severity=Severity.ERROR
            )
            
        except Exception as e:
            return ValidationResult(
                name=name,
                passed=False,
                message=f"{name}: Failed to decode base64 kubeconfig - {str(e)}",
                severity=Severity.ERROR
            )

    def validate_all_secrets(self) -> bool:
        """모든 시크릿 검증"""
        print("🔍 Validating environment variables...")
        
        # 필수 시크릿 검증
        for name, requirements in self.REQUIRED_SECRETS.items():
            value = os.getenv(name, '')
            result = self.validate_env_var(name, value, requirements)
            self.results.append(result)
            
            # 시크릿 노출 위험 검사
            if result.passed and self.check_secret_exposure(value):
                self.results.append(ValidationResult(
                    name=name,
                    passed=False,
                    message=f"{name}: Uses potentially dangerous/exposed value",
                    severity=Severity.WARNING
                ))
        
        # 선택적 시크릿 검증
        for name, requirements in self.OPTIONAL_SECRETS.items():
            value = os.getenv(name, '')
            if value:  # 값이 있는 경우에만 검증
                result = self.validate_env_var(name, value, requirements)
                self.results.append(result)
        
        # Kubeconfig 검증 (CI/CD 환경에서)
        for env_name in ['KUBECONFIG_STAGING', 'KUBECONFIG_PRODUCTION']:
            value = os.getenv(env_name, '')
            if value:
                result = self.validate_base64_kubeconfig(env_name, value)
                self.results.append(result)
        
        return self._print_results() 

    def _print_results(self) -> bool:
        """검증 결과 출력"""
        errors = []
        warnings = []
        
        for result in self.results:
            if result.severity == Severity.ERROR and not result.passed:
                errors.append(result)
                print(f"❌ {result.message}")
            elif result.severity == Severity.WARNING and not result.passed:
                warnings.append(result)
                print(f"⚠️  {result.message}")
            elif result.passed and self.verbose:
                print(f"✅ {result.message}")
        
        print(f"\n📊 Validation Summary:")
        print(f"   Total checks: {len(self.results)}")
        print(f"   Errors: {len(errors)}")
        print(f"   Warnings: {len(warnings)}")
        print(f"   Passed: {len([r for r in self.results if r.passed])}")
        
        if errors:
            print(f"\n🚨 Validation failed with {len(errors)} errors!")
            return False
        elif warnings:
            print(f"\n⚠️  Validation passed with {len(warnings)} warnings")
            return True
        else:
            print(f"\n✅ All validations passed!")
            return True

def main():
    """메인 함수"""
    import argparse

    parser = argparse.ArgumentParser(description='환경변수 검증 도구')
    parser.add_argument('-v', '--verbose', action='store_true', help='상세 출력')
    parser.add_argument('--check-file', type=str, help='특정 .env 파일 검사')
    parser.add_argument('--json-output', action='store_true', help='JSON 형태로 결과 출력')
    
    args = parser.parse_args()

    # .env 파일에서 환경변수 로드 (지정된 경우)
    if args.check_file:
        if not os.path.exists(args.check_file):
            print(f"❌ 파일을 찾을 수 없습니다: {args.check_file}")
            sys.exit(1)

        with open(args.check_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip().strip('"\'')
    
    validator = SecretValidator(verbose=args.verbose)
    success = validator.validate_all_secrets()

    # JSON 출력 (CI/CD에서 파싱하기 위함)
    if args.json_output:
        results_json = {
            'success': success,
            'results': [
                {
                    'name': r.name,
                    'passed': r.passed,
                    'message': r.message,
                    'severity': r.severity.value
                }
                for r in validator_results
            ]
        }
        print(json.dumps(results_json, indent=2))

    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()