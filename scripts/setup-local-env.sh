#!/bin/bash

# 로컬 개발 환경 설정 스크립트

set -euo pipefail

echo "🚀 Setting up local development environment..."

# .env 파일 생성
if [[ ! -f backend/.env ]]; then
    echo "📝 Creating backend .env file..."
    cp backend./env.example backend/.env

    # 개발용 SECRET_KEY 생성
    cd backend
    DJANGO_SECRET_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
    sed -i "s/dev-secret-key-change-this-in-production/${DJANGO_SECRET_KEY}/" .env
    cd ..
    
    echo "✅ Backend .env file created"
else
    echo "ℹ️  Backend .env file already exists"
fi

# 프론트엔드 환경변수 파일 생성
if [[ ! -f frontend/.env.local ]]; then
    echo "📝 Creating frontend .env.local file..."
    cat > frontend/.env.local << EOF
REACT_APP_API_URL=http://localhost:8000
GENERATE_SOURCEMAP=false
EOF
    echo "✅ Frontend .env.local file created"
else
    echo "ℹ️  Frontend .env.local file already exists"
fi

# Git hooks 설정
echo "🔧 Setting up Git hooks..."
if [[ ! -f .git/hooks/pre-commit ]]; then
    cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Pre-commit hook for security and code quality

set -e

echo "🔍 Running pre-commit checks..."

# Gitleaks 시크릿 스캔
if command -v gitleaks &> /dev/null; then
    echo "🕵️  Scanning for secrets..."
    gitleaks detect --source . --verbose
else
    echo "⚠️  Gitleaks not installed. Please install: https://github.com/gitleaks/gitleaks"
fi

# Python 코드 포맷팅 (backend 변경사항이 있는 경우)
if git diff --cached --name-only | grep -q "^backend/"; then
    echo "🎨 Checking Python code formatting..."
    cd backend
    if command -v black &> /dev/null; then
        black --check .
    else
        echo "⚠️  Black not installed. Run: pip install black"
    fi
    cd ..
fi

# JavaScript 코드 포맷팅 (frontend 변경사항이 있는 경우)
if git diff --cached --name-only | grep -q "^frontend/"; then
    echo "🎨 Checking JavaScript code formatting..."
    cd frontend
    if npm list prettier &> /dev/null; then
        npm run format:check
    else
        echo "⚠️  Prettier not configured. Run: npm install"
    fi
    cd ..
fi

echo "✅ Pre-commit checks passed!"
EOF
    
    chmod +x .git/hooks/pre-commit
    echo "✅ Git pre-commit hook installed"
else
    echo "ℹ️  Git pre-commit hook already exists"
fi

echo ""
echo "🎉 Local development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Install backend dependencies: cd backend && pip install -r requirements.txt"
echo "2. Install frontend dependencies: cd frontend && npm install"
echo "3. Start MySQL: docker-compose up db"
echo "4. Run migrations: cd backend && python manage.py migrate"
echo "5. Start development servers:"
echo "   - Backend: cd backend && python manage.py runserver"
echo "   - Frontend: cd frontend && npm start"
echo ""
echo "📚 Documentation: docs/DEVELOPMENT.md"