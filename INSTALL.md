# 📦 Guia de Instalação - COR Social Dashboard

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- ✅ Python 3.10 ou superior
- ✅ Node.js 18 ou superior
- ✅ PostgreSQL 13 ou superior
- ✅ Redis (opcional, para tarefas agendadas)
- ✅ Git

## Passo 1: Clonar o Repositório

```bash
cd /caminho/onde/deseja/instalar
git clone <url-do-repositorio>
cd cor-social-dashboard
```

## Passo 2: Configurar Backend

### 2.1 Criar Ambiente Virtual Python

```bash
cd backend
python -m venv venv

# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2.2 Instalar Dependências Python

```bash
pip install -r ../backend-requirements.txt
```

### 2.3 Configurar Banco de Dados PostgreSQL

```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Dentro do psql, executar:
CREATE DATABASE cor_social_dashboard;
CREATE USER cor_user WITH PASSWORD 'sua_senha_aqui';
ALTER ROLE cor_user SET client_encoding TO 'utf8';
ALTER ROLE cor_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE cor_user SET timezone TO 'America/Sao_Paulo';
GRANT ALL PRIVILEGES ON DATABASE cor_social_dashboard TO cor_user;
\q
```

### 2.4 Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar .env com suas configurações
nano .env  # ou vim .env
```

**Configurações mínimas necessárias:**
```env
SECRET_KEY=sua-chave-secreta-aleatoria-aqui
DEBUG=True
DB_NAME=cor_social_dashboard
DB_USER=cor_user
DB_PASSWORD=sua_senha_aqui
DB_HOST=localhost
DB_PORT=5432
```

### 2.5 Aplicar Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 2.6 Criar Superusuário

```bash
python manage.py createsuperuser

# Preencha:
# Username: admin (ou o que preferir)
# Email: seu-email@cor.rio
# Password: ***
```

### 2.7 Testar Backend

```bash
python manage.py runserver 0.0.0.0:8100
```

Acesse: http://localhost:8100/admin

## Passo 3: Configurar Frontend

### 3.1 Instalar Dependências Node

```bash
cd ../frontend
npm install
```

### 3.2 Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar se necessário (já vem configurado)
nano .env
```

### 3.3 Testar Frontend

```bash
npm run dev
```

Acesse: http://localhost:3100

## Passo 4: Configurar APIs (Opcional)

### 4.1 Twitter/X API

1. Acesse: https://developer.twitter.com/en/portal/dashboard
2. Crie um novo App
3. Vá em "Keys and Tokens"
4. Copie o "Bearer Token"
5. Adicione no `.env` do backend:
```env
TWITTER_BEARER_TOKEN=seu-bearer-token-aqui
```

### 4.2 YouTube API

1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto
3. Ative "YouTube Data API v3"
4. Crie credenciais (API Key)
5. Obtenha o Channel ID do seu canal
6. Adicione no `.env`:
```env
YOUTUBE_API_KEY=sua-api-key-aqui
YOUTUBE_CHANNEL_ID=seu-channel-id
```

### 4.3 Google Play API

1. Acesse: https://play.google.com/console
2. Vá em "Setup" > "API access"
3. Crie Service Account
4. Baixe arquivo JSON
5. Salve em um local seguro
6. Adicione no `.env`:
```env
GOOGLE_PLAY_PACKAGE_NAME=com.seu.pacote
GOOGLE_PLAY_SERVICE_ACCOUNT=/caminho/completo/para/arquivo.json
```

### 4.4 App Store Connect API

1. Acesse: https://appstoreconnect.apple.com
2. Vá em "Users and Access" > "Keys"
3. Crie nova API Key
4. Baixe arquivo .p8
5. Anote Key ID e Issuer ID
6. Adicione no `.env`:
```env
APPLE_APP_ID=seu-app-id
APPLE_KEY_ID=sua-key-id
APPLE_ISSUER_ID=seu-issuer-id
APPLE_PRIVATE_KEY_PATH=/caminho/completo/para/arquivo.p8
```

### 4.5 Google Analytics

1. Acesse: https://console.cloud.google.com
2. Ative "Google Analytics Data API"
3. Crie Service Account
4. Baixe JSON
5. Adicione Service Account ao Google Analytics com permissão de leitura
6. Adicione no `.env`:
```env
GOOGLE_ANALYTICS_PROPERTY_ID=seu-property-id
GOOGLE_ANALYTICS_CREDENTIALS=/caminho/completo/para/arquivo.json
```

## Passo 5: Configurar Celery (Opcional)

### 5.1 Instalar Redis

```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# Mac
brew install redis

# Iniciar Redis
redis-server
```

### 5.2 Rodar Celery Worker

Em um novo terminal:

```bash
cd backend
source venv/bin/activate
celery -A cor_dashboard worker --loglevel=info
```

### 5.3 Rodar Celery Beat (Agendador)

Em outro terminal:

```bash
cd backend
source venv/bin/activate
celery -A cor_dashboard beat --loglevel=info
```

**Ou rodar ambos juntos:**
```bash
celery -A cor_dashboard worker --beat --loglevel=info
```

## Passo 6: Usar Scripts de Inicialização

Para facilitar, use os scripts fornecidos:

### Iniciar todos os serviços:
```bash
./start.sh
```

### Parar todos os serviços:
```bash
./stop.sh
```

## Verificação Final

✅ Backend rodando em: http://localhost:8100
✅ Admin Django em: http://localhost:8100/admin
✅ Frontend rodando em: http://localhost:3100
✅ Login funcional com usuário criado
✅ Dashboard exibindo dados

## Problemas Comuns

### Erro de conexão com PostgreSQL
- Verifique se o PostgreSQL está rodando: `sudo service postgresql status`
- Verifique credenciais no .env
- Verifique se o banco existe: `sudo -u postgres psql -l`

### Porta já em uso
- Backend (8100): `lsof -i :8100` e `kill <PID>`
- Frontend (3100): `lsof -i :3100` e `kill <PID>`

### Erro ao instalar dependências Python
- Atualize pip: `pip install --upgrade pip`
- Instale build tools: `sudo apt-get install python3-dev build-essential`

### Erro ao instalar dependências Node
- Limpe cache: `npm cache clean --force`
- Delete node_modules: `rm -rf node_modules package-lock.json`
- Reinstale: `npm install`

## Próximos Passos

1. Configure as APIs que deseja usar
2. Faça login no sistema
3. Adicione dados manualmente ou aguarde coleta automática
4. Explore o dashboard e suas funcionalidades

## Suporte

Para dúvidas ou problemas, contate a equipe de TI do COR.

---

**Instalação realizada com sucesso! 🎉**
