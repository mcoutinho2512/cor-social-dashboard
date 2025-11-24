# 🎯 COR Social Dashboard - Visão Geral

## 📊 O que é?

Dashboard completo para centralizar métricas de redes sociais, aplicativos e website do Centro de Operações Rio.

## ✨ Funcionalidades Principais

### 📱 Redes Sociais
- ✅ Twitter/X - Seguidores, tweets, engajamento
- ✅ YouTube - Inscritos, vídeos, visualizações
- 📝 Facebook - Entrada manual
- 📝 Instagram - Entrada manual
- 📝 Threads - Entrada manual

### 📲 Aplicativos
- ✅ Google Play - Downloads, avaliações
- ✅ App Store - Downloads, avaliações

### 🌐 Website
- ✅ Google Analytics - Page views, visitantes, sessões

## 🎨 Interface

```
┌─────────────────────────────────────────────────────┐
│  COR SOCIAL DASHBOARD                    [Sair]    │
│  Centro de Operações Rio                            │
├─────────────────────────────────────────────────────┤
│  [Dashboard]  [Entrada Manual]                      │
├─────────────────────────────────────────────────────┤
│                                                      │
│  📊 Dashboard                        [Último Mês ▼] │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 125.5K   │  │  45.2K   │  │  890K    │         │
│  │Seguidores│  │Downloads │  │Page Views│         │
│  └──────────┘  └──────────┘  └──────────┘         │
│                                                      │
│  ┌─── Twitter ────┐  ┌─── Facebook ───┐           │
│  │ 🐦 45.2K       │  │ 📘 38.1K       │           │
│  │ Seguidores     │  │ Seguidores     │           │
│  │ ↗ 2.5% eng.   │  │ 1.2K posts     │           │
│  └────────────────┘  └────────────────┘           │
│                                                      │
│  ┌──────────────── Evolução ─────────────────┐    │
│  │              📈 Gráfico                     │    │
│  │                                             │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

## 🏗️ Arquitetura Técnica

```
┌────────────────┐
│   Navegador    │
│  (React App)   │
└───────┬────────┘
        │ HTTP/REST
        ↓
┌────────────────┐       ┌──────────────┐
│  Django API    │◄─────►│  PostgreSQL  │
│  (Backend)     │       │  (Dados)     │
└───────┬────────┘       └──────────────┘
        │
        ├──► Twitter API
        ├──► YouTube API
        ├──► Google Play API
        ├──► App Store API
        └──► Google Analytics
        
        ↓ (Celery)
┌────────────────┐
│     Redis      │
│  (Tarefas)     │
└────────────────┘
```

## 📁 Estrutura de Arquivos

```
cor-social-dashboard/
│
├── 📄 README.md                    # Documentação principal
├── 📄 INSTALL.md                   # Guia de instalação
├── 📄 QUICKSTART.md                # Início rápido
├── 🚀 start.sh                     # Iniciar sistema
├── 🛑 stop.sh                      # Parar sistema
│
├── 🔧 backend/                     # Django REST API
│   ├── manage.py
│   ├── .env                        # ⚙️ Configurações
│   ├── requirements.txt
│   │
│   ├── cor_dashboard/              # Configuração Django
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── celery.py
│   │   └── wsgi.py
│   │
│   └── api/                        # App principal
│       ├── models.py               # 📊 Modelos de dados
│       ├── views.py                # 🔌 APIs REST
│       ├── serializers.py          # 🔄 Conversores JSON
│       ├── urls.py                 # 🛣️ Rotas
│       ├── admin.py                # 👨‍💼 Admin Django
│       └── tasks.py                # ⏰ Tarefas Celery
│
└── ⚛️ frontend/                    # React Application
    ├── package.json
    ├── .env                        # ⚙️ Configurações
    │
    └── src/
        ├── main.jsx                # 🚪 Entry point
        ├── App.jsx                 # 🏠 App principal
        │
        ├── components/             # 🧩 Componentes
        │   ├── Layout.jsx
        │   └── PrivateRoute.jsx
        │
        ├── pages/                  # 📄 Páginas
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   └── ManualEntry.jsx
        │
        ├── services/               # 🔌 Serviços API
        │   ├── api.js
        │   └── dashboardService.js
        │
        └── contexts/               # 🌐 Contexts
            └── AuthContext.jsx
```

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Tokens com expiração
- ✅ Senhas criptografadas
- ✅ CORS configurado
- ✅ Variáveis em .env
- ✅ Rotas protegidas

## 📊 Fluxo de Dados

### Coleta Automática (Celery)
```
Agendador → Celery Task → API Externa → Django → PostgreSQL
    ↓
 A cada hora (redes sociais)
 Diariamente (apps)
 A cada 6h (analytics)
```

### Visualização (Dashboard)
```
React → API Request → Django → PostgreSQL → JSON Response → Recharts
```

### Entrada Manual
```
Usuário → Form → API → Django → PostgreSQL → Dashboard atualizado
```

## 🎯 Métricas Disponíveis

| Plataforma      | Métrica                    | Fonte      |
|-----------------|----------------------------|------------|
| Twitter/X       | Seguidores, tweets, eng.   | API        |
| Facebook        | Seguidores, posts          | Manual     |
| Instagram       | Seguidores, posts          | Manual     |
| YouTube         | Inscritos, vídeos, views   | API        |
| Threads         | Seguidores                 | Manual     |
| Google Play     | Downloads, avaliações      | API        |
| App Store       | Downloads, avaliações      | API        |
| Website         | Page views, visitantes     | API (GA)   |

## 🚀 Deploy

### Desenvolvimento
```bash
./start.sh  # Portas 3100 e 8100
```

### Produção
```bash
# Backend
gunicorn cor_dashboard.wsgi:application --bind 0.0.0.0:8100

# Frontend
npm run build
# Servir pasta dist/ com nginx
```

## 📈 Performance

- ⚡ Cache de API responses
- 🔄 Refresh automático de tokens
- 📊 Lazy loading de gráficos
- 🎨 CSS otimizado (Tailwind)
- 🗜️ Build minificado

## 🛠️ Tecnologias

### Backend
- Python 3.10+
- Django 4.2
- Django REST Framework
- PostgreSQL
- Celery + Redis
- JWT Authentication

### Frontend
- React 18
- Vite
- Tailwind CSS
- Recharts
- Axios
- React Router

### APIs Integradas
- Twitter API v2
- YouTube Data API v3
- Google Play Developer API
- App Store Connect API
- Google Analytics Data API

## 📞 Suporte

- 📧 Email: suporte@cor.rio
- 📱 Interno: Ramal 1234
- 🐛 Issues: GitHub (interno)

## 📝 Notas Importantes

⚠️ **Antes de usar em produção:**
- [ ] Alterar SECRET_KEY
- [ ] Configurar DEBUG=False
- [ ] Configurar ALLOWED_HOSTS
- [ ] Usar HTTPS
- [ ] Backup automático do banco
- [ ] Configurar CORS adequadamente
- [ ] Revisar permissões de API

## 🎓 Tutoriais Recomendados

1. ✅ Fazer login no sistema
2. ✅ Adicionar entrada manual
3. ✅ Configurar primeira API (YouTube é a mais fácil)
4. ✅ Configurar Celery para coletas automáticas
5. ✅ Customizar cores e layout
6. ✅ Exportar relatórios

## 📚 Documentação Adicional

- [README.md](README.md) - Documentação completa
- [INSTALL.md](INSTALL.md) - Guia de instalação detalhado
- [QUICKSTART.md](QUICKSTART.md) - Início rápido (5 min)
- [backend/README.md](backend/README.md) - Detalhes do backend
- [frontend/README.md](frontend/README.md) - Detalhes do frontend

---

**Desenvolvido com ❤️ para o Centro de Operações Rio**
