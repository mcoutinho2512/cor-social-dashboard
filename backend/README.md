# COR Social Dashboard - Backend

Backend Django REST API para o dashboard de métricas de redes sociais do Centro de Operações Rio.

## Requisitos

- Python 3.10+
- PostgreSQL 13+
- Redis (para Celery)

## Instalação

1. Criar ambiente virtual:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
```

2. Instalar dependências:
```bash
pip install -r ../backend-requirements.txt
```

3. Configurar variáveis de ambiente:
```bash
cp .env.example .env
# Editar .env com suas credenciais
```

4. Criar banco de dados PostgreSQL:
```bash
sudo -u postgres psql
CREATE DATABASE cor_social_dashboard;
CREATE USER cor_user WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE cor_social_dashboard TO cor_user;
\q
```

5. Aplicar migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

6. Criar superusuário:
```bash
python manage.py createsuperuser
```

7. Rodar servidor:
```bash
python manage.py runserver 0.0.0.0:8100
```

## Celery (Tarefas Agendadas)

Para rodar o worker do Celery:
```bash
celery -A cor_dashboard worker --loglevel=info
```

Para rodar o beat (agendador):
```bash
celery -A cor_dashboard beat --loglevel=info
```

Ou rodar ambos:
```bash
celery -A cor_dashboard worker --beat --loglevel=info
```

## Endpoints da API

### Autenticação
- `POST /api/token/` - Obter token JWT
- `POST /api/token/refresh/` - Renovar token

### Métricas de Redes Sociais
- `GET /api/social-metrics/` - Listar todas
- `GET /api/social-metrics/latest/` - Métricas mais recentes
- `GET /api/social-metrics/comparison/` - Comparação entre períodos
- `POST /api/social-metrics/` - Criar nova métrica
- `GET /api/social-metrics/{id}/` - Detalhes
- `PUT /api/social-metrics/{id}/` - Atualizar
- `DELETE /api/social-metrics/{id}/` - Deletar

### Downloads de Apps
- `GET /api/app-downloads/` - Listar todas
- `GET /api/app-downloads/total/` - Total de downloads
- `POST /api/app-downloads/` - Criar nova métrica

### Métricas do Website
- `GET /api/website-metrics/` - Listar todas
- `GET /api/website-metrics/summary/` - Resumo por período
- `POST /api/website-metrics/` - Criar nova métrica

### Entradas Manuais
- `GET /api/manual-entries/` - Listar todas
- `POST /api/manual-entries/` - Criar nova entrada
- `PUT /api/manual-entries/{id}/` - Atualizar
- `DELETE /api/manual-entries/{id}/` - Deletar

### Dashboard
- `GET /api/dashboard/summary/` - Resumo completo do dashboard

## Parâmetros de Filtro

Todos os endpoints aceitam os seguintes parâmetros:

- `period`: day, week, month, year
- `platform`: twitter, facebook, instagram, youtube, threads, android, ios
- `start_date`: Data inicial (ISO format)
- `end_date`: Data final (ISO format)

Exemplo:
```
GET /api/social-metrics/?platform=twitter&period=week
```

## Tarefas Agendadas

- `fetch_twitter_metrics`: A cada hora
- `fetch_youtube_metrics`: A cada hora (5min após Twitter)
- `fetch_app_store_metrics`: Diariamente às 2h
- `fetch_google_play_metrics`: Diariamente às 2:30h
- `fetch_analytics_metrics`: A cada 6 horas
- `cleanup_old_metrics`: Remove dados com mais de 2 anos

## Admin

Acesse `http://localhost:8100/admin/` para gerenciar os dados manualmente.

## Estrutura do Projeto

```
backend/
├── cor_dashboard/          # Configurações do projeto
│   ├── settings.py
│   ├── urls.py
│   ├── celery.py
│   └── wsgi.py
├── api/                    # App principal
│   ├── models.py          # Modelos de dados
│   ├── serializers.py     # Serializers REST
│   ├── views.py           # Views/APIs
│   ├── urls.py            # Rotas da API
│   ├── admin.py           # Admin Django
│   └── tasks.py           # Tarefas Celery
├── manage.py
└── .env                   # Variáveis de ambiente
```
