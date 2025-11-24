# COR Social Dashboard

Dashboard completo de métricas de redes sociais e aplicativos para o Centro de Operações Rio (COR).

![Dashboard Preview](https://via.placeholder.com/800x400?text=COR+Social+Dashboard)

## 📋 Sobre o Projeto

Sistema desenvolvido para centralizar e visualizar métricas de:
- **Redes Sociais**: Twitter/X, Facebook, Instagram, YouTube, Threads
- **Aplicativos**: Google Play e App Store
- **Website**: Google Analytics

Com recursos de:
- ✅ Coleta automática via APIs
- ✅ Entrada manual para plataformas sem API
- ✅ Gráficos e visualizações interativas
- ✅ Filtros por período (dia/semana/mês/ano)
- ✅ Sistema de autenticação JWT
- ✅ Atualização automática com Celery

## 🏗️ Arquitetura

```
cor-social-dashboard/
├── backend/                 # Django REST API
│   ├── cor_dashboard/      # Configurações
│   └── api/                # App principal
└── frontend/               # React + Vite
    └── src/
        ├── components/
        ├── pages/
        ├── services/
        └── contexts/
```

### Backend (Django)
- Django 4.2 + Django REST Framework
- PostgreSQL
- Celery + Redis (tarefas agendadas)
- JWT Authentication
- APIs: Twitter, YouTube, Google Play, App Store, Analytics

### Frontend (React)
- React 18 + Vite
- Tailwind CSS
- Recharts (gráficos)
- React Router DOM
- Axios

## 🚀 Instalação Rápida

### Pré-requisitos
- Python 3.10+
- Node.js 18+
- PostgreSQL 13+
- Redis

### 1. Clonar o Repositório
```bash
git clone <repo-url>
cd cor-social-dashboard
```

### 2. Backend

```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r ../backend-requirements.txt

# Configurar .env
cp .env.example .env
# Editar .env com suas credenciais

# Criar banco de dados
sudo -u postgres psql
CREATE DATABASE cor_social_dashboard;
CREATE USER cor_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE cor_social_dashboard TO cor_user;
\q

# Aplicar migrations
python manage.py makemigrations
python manage.py migrate

# Criar superusuário
python manage.py createsuperuser

# Rodar servidor
python manage.py runserver 0.0.0.0:8100
```

### 3. Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar .env
cp .env.example .env
# Editar VITE_API_URL se necessário

# Rodar em desenvolvimento
npm run dev
```

### 4. Celery (Opcional - para coleta automática)

```bash
cd backend

# Terminal 1 - Worker
celery -A cor_dashboard worker --loglevel=info

# Terminal 2 - Beat (agendador)
celery -A cor_dashboard beat --loglevel=info

# Ou rodar ambos juntos:
celery -A cor_dashboard worker --beat --loglevel=info
```

## 🔑 Configuração de APIs

### 1. Twitter/X
1. Criar conta Developer em: https://developer.twitter.com
2. Criar um App
3. Obter Bearer Token
4. Adicionar ao .env:
```
TWITTER_BEARER_TOKEN=seu-token-aqui
```

### 2. YouTube
1. Acessar: https://console.cloud.google.com
2. Criar projeto e ativar YouTube Data API v3
3. Criar credenciais (API Key)
4. Obter Channel ID do canal
5. Adicionar ao .env:
```
YOUTUBE_API_KEY=sua-key-aqui
YOUTUBE_CHANNEL_ID=seu-channel-id
```

### 3. Google Play
1. Acessar: https://play.google.com/console
2. Criar Service Account
3. Baixar arquivo JSON de credenciais
4. Adicionar ao .env:
```
GOOGLE_PLAY_PACKAGE_NAME=com.seu.app
GOOGLE_PLAY_SERVICE_ACCOUNT=/caminho/para/credentials.json
```

### 4. App Store
1. Acessar: https://appstoreconnect.apple.com
2. Criar API Key
3. Baixar arquivo .p8
4. Adicionar ao .env:
```
APPLE_APP_ID=seu-app-id
APPLE_KEY_ID=sua-key-id
APPLE_ISSUER_ID=seu-issuer-id
APPLE_PRIVATE_KEY_PATH=/caminho/para/key.p8
```

### 5. Google Analytics
1. Acessar: https://console.cloud.google.com
2. Ativar Google Analytics Data API
3. Criar Service Account e baixar JSON
4. Adicionar Service Account ao Google Analytics com permissão de leitura
5. Adicionar ao .env:
```
GOOGLE_ANALYTICS_PROPERTY_ID=seu-property-id
GOOGLE_ANALYTICS_CREDENTIALS=/caminho/para/credentials.json
```

## 📱 Uso

### Acessar o Sistema
1. Abra o navegador em: `http://localhost:3100`
2. Faça login com as credenciais criadas
3. Visualize o dashboard com todas as métricas

### Dashboard Principal
- **Cards de Resumo**: Total de seguidores, downloads e page views
- **Redes Sociais**: Métricas individuais de cada plataforma
- **Apps**: Downloads do Android e iOS
- **Gráficos**: Evolução temporal das métricas
- **Filtros**: Por dia, semana, mês ou ano

### Entrada Manual
- Para plataformas sem API (Facebook, Instagram, Threads)
- Adicionar, editar e excluir métricas manualmente
- Histórico de todas as entradas

## 🔒 Segurança

- Autenticação JWT com renovação automática
- Tokens expiran em 5 horas (configurável)
- Senhas hashadas com bcrypt
- CORS configurado
- Variáveis sensíveis em .env

## 📊 Métricas Coletadas

### Redes Sociais
- Número de seguidores
- Número de seguindo
- Total de publicações
- Taxa de engajamento
- Curtidas, comentários, compartilhamentos
- Visualizações

### Aplicativos
- Total de downloads
- Downloads diários/semanais/mensais
- Usuários ativos
- Avaliação média
- Número de avaliações

### Website
- Page views
- Visitantes únicos
- Sessões
- Taxa de rejeição
- Duração média da sessão
- Origens de tráfego

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto foi desenvolvido para uso interno do Centro de Operações Rio (COR).

## 👥 Autores

- **Magnun** - Desenvolvedor Principal - Centro de Operações Rio

## 🐛 Suporte

Para problemas ou dúvidas, entre em contato com a equipe de TI do COR.

## 📚 Documentação Adicional

- [Backend README](backend/README.md)
- [Frontend README](frontend/README.md)
- [API Documentation](backend/API.md) (em construção)

## ✨ Roadmap

- [ ] Integração com Threads (quando API estiver disponível)
- [ ] Integração completa com Facebook/Instagram via Meta
- [ ] Dashboard mobile
- [ ] Exportação de relatórios em PDF
- [ ] Alertas por email para métricas
- [ ] Comparação com períodos anteriores
- [ ] Machine Learning para previsões

---

**Centro de Operações Rio - COR** | 2024
