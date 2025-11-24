#!/bin/bash

echo "🛑 Parando COR Social Dashboard..."
echo ""

# Parar backend (porta 8100)
BACKEND_PID=$(lsof -t -i:8100)
if [ ! -z "$BACKEND_PID" ]; then
    echo "🔴 Parando backend (PID: $BACKEND_PID)..."
    kill $BACKEND_PID
    echo "✅ Backend parado"
else
    echo "ℹ️  Backend não está rodando"
fi

# Parar frontend (porta 3100)
FRONTEND_PID=$(lsof -t -i:3100)
if [ ! -z "$FRONTEND_PID" ]; then
    echo "🔴 Parando frontend (PID: $FRONTEND_PID)..."
    kill $FRONTEND_PID
    echo "✅ Frontend parado"
else
    echo "ℹ️  Frontend não está rodando"
fi

# Parar Celery se estiver rodando
CELERY_PIDS=$(ps aux | grep 'celery' | grep -v grep | awk '{print $2}')
if [ ! -z "$CELERY_PIDS" ]; then
    echo "🔴 Parando Celery workers..."
    echo $CELERY_PIDS | xargs kill
    echo "✅ Celery parado"
fi

echo ""
echo "✨ Todos os serviços foram parados"
