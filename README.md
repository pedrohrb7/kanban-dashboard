# Kanban Dashboard

![Kanban Screen](https://github.com/pedrohrb7/kanban-dashboard/blob/main/kanban.png?raw=true)
![Dashboard Screen](https://github.com/pedrohrb7/kanban-dashboard/blob/main/dashboard.png?raw=true)

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

```
Projeto desenvolvimento em ambiente linux.
Distro: Arch Linux
Docker Compose version 2.40.3
Docker version 29.1.1
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

#### Dashboard

Exibir ao menos 3 indicadores, por exemplo:

● Nº de tarefas por status.

● % concluídas no dia / semana.

● Tempo médio até conclusão (mockado ou calculado).

### Limitações

- Autenticação de usuários.
- Integração com back-end real.
- Toggle de movimentação de colunas ainda precisa de atenção.
- Não possui internacionalização (i18n) ou multi temas.
- Não é possível realizar a criação novas colunas, boards, status ou campos.
- Evolução do design system.
- Melhorias de UX/UI e componentização.
- Testes automatizados.
- Hospedagem
- Deploy automaizado.

### Considerações Finais

Foi um apresendizado muito interessante e desafiador. Algumas funcionalidades foram
implementadas de forma simplificada devido ao tempo disponível, mas acredito que o
essencial do sistema e demonstração dos conhecimentos foram contemplados. Mesmo após
o prazo, pretendo continuar evoluindo o projeto, adicionando melhorias e funcionalidades.
Pretendo desenvolver um back-end real para persistência dos dados e aprimorar a experiência do
usuário e tornar deixar a aplicação disponível online para acesso público.

O ponto que mais me desafiou bastante foi a implementação do drag-and-drop com Dnd Kit, que
exigiu um bom tempo de estudo da biblioteca e adaptação para o contexto do Kanban. No
entanto, foi uma experiência valiosa que me permitiu aprender mais sobre manipulação de
estado e interatividade no React, e principalmente, poder visualizar pontos que posso estudar mais.
