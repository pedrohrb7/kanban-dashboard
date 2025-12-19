# Desafio Técnico

### Objetivo

Criar um pequeno sistema que permita gerenciar tarefas em um quadro Kanban, com
alguns indicadores simples. O candidato pode entregar:

● Somente Front-end, com dados mockados (JSON local, MirageJS, json-server,
serviços fake, etc.)

## Especificações e Tecnologias

- Node v24.12.0 LTS
  - Recomenda-se o uso do gerenciador de versões nvm (Node Version Manager).
  - Gerenciador de versões utilizado: asdf

- Vite
- Framework/Lib base: React com Typescript
- Gerenciamento de estado: Zustand
- Design System/UI: Ant Design e Iconsax
- Roteamento: React Router
- DnD: Dnd Kit
- Requisições HTTP: Axios e React Query
- CodeStyle/Lint: ESLint + Prettier

## Como executar

1. Clone o repositório

```bash
git clone https://github.com/pedrohrb7/kanban-dash
```

2. Acesse a pasta do projeto e instale as dependências

```bash
cd kanban-dash
npm install // yarn install
```

3. Inicie o servidor de desenvolvimento

```bash
npm run dev // yarn dev
```

### Executando com Docker Compose

1. Certifique-se de ter o Docker instalado em sua máquina.

2. Após executar os passos 1 e 2 acima, construa a imagem Docker:

```bash
docker compose build --no-cache
```

3. Execute o contêiner:

```bash
docker compose up // (adicione -d para rodar em segundo plano)
```

## Funcionalidades Comuns

#### Tarefa

● id

● Entidade Tarefa

● título

● descrição

● status: A Fazer, Em Progresso, Atrasado, Concluído

● responsável (nome + email)

● data de criação

● data de conclusão

● data limite

● dias de Atraso

_Diferencial: permitir CRUD de responsáveis._

#### Regras de Negócio

● Mudar o status via drag-and-drop no Kanban.

● Ao mover para Concluído, preencher automaticamente a Data de Conclusão.

● Se a tarefa estiver com data Limite expirada, deve ir automaticamente para
Atrasado.

● Validar tarefas atrasadas a partir da data do dia.

● Status deve ser persistido (real ou mock).

● Filtros:

    ○ Status
    ○ Responsável

● Busca global:

    ○ Título/descrição
    ○ Ordenação por Data de Criação
    ○ Paginação

### Dashboard

Exibir ao menos 3 indicadores, por exemplo:

● Nº de tarefas por status.

● % concluídas no dia / semana.

● Tempo médio até conclusão (mockado ou calculado).
