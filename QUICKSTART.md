# ⚡ Quick Start - COR Social Dashboard

## Instalação Rápida (5 minutos)

### 1️⃣ Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate

# Instalar dependências
pip install -r ../backend-requirements.txt

# Configurar banco (PostgreSQL deve estar instalado)
sudo -u postgres psql -c "CREATE DATABASE cor_social_dashboard;"
sudo -u postgres psql -c "CREATE USER cor_user WITH PASSWORD 'postgres';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE cor_social_dashboard TO cor_user;"

# Copiar .env
cp .env.example .env

# Aplicar migrations
python manage.py migrate

# Criar admin
python manage.py createsuperuser
# Username: admin
# Email: admin@cor.rio
# Password: (sua escolha)

# Rodar servidor
python manage.py runserver 0.0.0.0:8100
```

### 2️⃣ Frontend (Novo Terminal)

```bash
cd frontend

# Instalar dependências
npm install

# Copiar .env
cp .env.example .env

# Rodar servidor
npm run dev
```

### 3️⃣ Acessar Sistema

1. Abra o navegador em: **http://localhost:3100**
2. Faça login com o usuário criado
3. Explore o dashboard!

## Uso dos Scripts Prontos

```bash
# Iniciar tudo de uma vez
./start.sh

# Parar tudo
./stop.sh
```

## Primeiros Passos Após Login

### Opção 1: Adicionar Dados Manualmente
1. Clique em "Entrada Manual"
2. Preencha o formulário com dados de teste
3. Volte ao Dashboard para ver os dados

### Opção 2: Configurar APIs
1. Edite `backend/.env` com suas API keys
2. Reinicie o backend
3. Rode Celery para coleta automática:
```bash
cd backend
celery -A cor_dashboard worker --beat --loglevel=info
```

## Comandos Úteis

### Backend
```bash
# Ver logs
tail -f backend.log

# Acessar shell Django
python manage.py shell

# Criar dados de teste
python manage.py loaddata fixtures/sample_data.json

# Resetar banco
python manage.py flush
```

### Frontend
```bash
# Ver logs
tail -f frontend.log

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Estrutura de Pastas

```
cor-social-dashboard/
├── backend/                    # Django API
│   ├── manage.py
│   ├── .env                   # ⚠️ Configurar aqui
│   ├── cor_dashboard/
│   └── api/
├── frontend/                  # React App
│   ├── src/
│   ├── .env                   # ⚠️ Configurar aqui
│   └── package.json
├── start.sh                   # 🚀 Iniciar tudo
├── stop.sh                    # 🛑 Parar tudo
├── README.md                  # 📚 Documentação completa
└── INSTALL.md                 # 📦 Guia de instalação
```

## Portas Usadas

- **3100**: Frontend React
- **8100**: Backend Django
- **5432**: PostgreSQL
- **6379**: Redis (se usar Celery)

## Troubleshooting Rápido

### Backend não inicia
```bash
# Verificar se porta está livre
lsof -i :8100

# Verificar PostgreSQL
sudo service postgresql status

# Verificar logs
tail -f backend.log
```

### Frontend não inicia
```bash
# Verificar se porta está livre
lsof -i :3100

# Limpar cache
cd frontend
rm -rf node_modules package-lock.json
npm install

# Verificar logs
tail -f frontend.log
```

### Erro de permissão
```bash
# Dar permissão aos scripts
chmod +x start.sh stop.sh
```

## Próximos Passos

1. ✅ Login no sistema
2. ✅ Adicionar dados de teste
3. ✅ Explorar dashboard
4. ⏭️ Configurar APIs reais
5. ⏭️ Customizar cores/logos
6. ⏭️ Deploy em produção

## Recursos

- **Admin Django**: http://localhost:8100/admin
- **API Docs**: http://localhost:8100/api/
- **Frontend**: http://localhost:3100

## Dúvidas?

Leia a documentação completa em:
- [README.md](README.md) - Visão geral
- [INSTALL.md](INSTALL.md) - Instalação detalhada
- [backend/README.md](backend/README.md) - Detalhes do backend
- [frontend/README.md](frontend/README.md) - Detalhes do frontend

---

**Pronto para usar! 🚀**
