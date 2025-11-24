#!/bin/bash

echo "🚀 Iniciando COR Social Dashboard..."
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Verificar se está no diretório correto
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto"
    exit 1
fi

# Função para verificar se um processo está rodando na porta
check_port() {
    lsof -i:$1 > /dev/null 2>&1
    return $?
}

echo "${BLUE}📦 Backend (Django)${NC}"
echo "-------------------"

# Verificar se backend já está rodando
if check_port 8100; then
    echo "⚠️  Backend já está rodando na porta 8100"
else
    cd backend
    
    # Ativar ambiente virtual se existir
    if [ -d "venv" ]; then
        source venv/bin/activate
    fi
    
    # Rodar migrations se necessário
    echo "🔄 Aplicando migrations..."
    python manage.py migrate --noinput > /dev/null 2>&1
    
    # Iniciar servidor em background
    echo "🚀 Iniciando servidor backend..."
    python manage.py runserver 0.0.0.0:8100 > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo "✅ Backend rodando (PID: $BACKEND_PID) - http://localhost:8100"
    
    cd ..
fi

echo ""
echo "${BLUE}⚛️  Frontend (React)${NC}"
echo "-------------------"

# Verificar se frontend já está rodando
if check_port 3100; then
    echo "⚠️  Frontend já está rodando na porta 3100"
else
    cd frontend
    
    # Verificar se node_modules existe
    if [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependências do frontend..."
        npm install
    fi
    
    # Iniciar frontend em background
    echo "🚀 Iniciando servidor frontend..."
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo "✅ Frontend rodando (PID: $FRONTEND_PID) - http://localhost:3100"
    
    cd ..
fi

echo ""
echo "${GREEN}✨ Sistema iniciado com sucesso!${NC}"
echo ""
echo "📍 URLs:"
echo "   Frontend:  http://localhost:3100"
echo "   Backend:   http://localhost:8100"
echo "   Admin:     http://localhost:8100/admin"
echo ""
echo "📋 Logs:"
echo "   Backend:   tail -f backend.log"
echo "   Frontend:  tail -f frontend.log"
echo ""
echo "🛑 Para parar os servidores:"
echo "   ./stop.sh"
echo ""
