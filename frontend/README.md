# COR Social Dashboard - Frontend

Frontend React com Vite para o dashboard de métricas de redes sociais.

## Tecnologias

- React 18
- Vite
- React Router DOM
- Axios
- Recharts (gráficos)
- Tailwind CSS
- Lucide React (ícones)
- React Toastify (notificações)

## Instalação

1. Instalar dependências:
```bash
npm install
```

2. Criar arquivo .env:
```bash
cp .env.example .env
```

3. Configurar variáveis de ambiente no .env:
```
VITE_API_URL=http://localhost:8100
```

4. Rodar em desenvolvimento:
```bash
npm run dev
```

O frontend estará disponível em: `http://localhost:3100`

## Build para Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Layout.jsx
│   │   └── PrivateRoute.jsx
│   ├── contexts/          # Contexts React
│   │   └── AuthContext.jsx
│   ├── pages/             # Páginas
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   └── ManualEntry.jsx
│   ├── services/          # Serviços de API
│   │   ├── api.js
│   │   └── dashboardService.js
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Entry point
│   └── index.css         # Estilos globais
├── public/               # Arquivos estáticos
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Funcionalidades

### Dashboard
- Visualização de métricas de todas as redes sociais
- Cards com resumo de seguidores, downloads e page views
- Gráficos de evolução temporal
- Filtro por período (dia/semana/mês/ano)
- Atualização em tempo real

### Entrada Manual
- Formulário para adicionar métricas manualmente
- Edição de entradas existentes
- Exclusão de entradas
- Listagem de todas as entradas registradas

### Autenticação
- Login com JWT
- Renovação automática de token
- Proteção de rotas privadas
- Logout seguro

## Variáveis de Ambiente

- `VITE_API_URL`: URL base da API backend (padrão: http://localhost:8100)

## Scripts Disponíveis

- `npm run dev`: Inicia servidor de desenvolvimento
- `npm run build`: Cria build de produção
- `npm run preview`: Preview do build de produção
- `npm run lint`: Executa linter

## Cores do Tema

As cores do COR foram configuradas no Tailwind:

- `cor-blue`: #003DA5 (azul principal)
- `cor-light-blue`: #0066CC (azul claro)
- `cor-dark`: #001F3F (azul escuro)

Use nas classes Tailwind: `bg-cor-blue`, `text-cor-light-blue`, etc.
