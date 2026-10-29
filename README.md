# Minha Rotina - Aplicação Web de Lista de Tarefas (To-Do List)

Uma aplicação web moderna, funcional e intuitiva para organização diária de tarefas, desenvolvida com tecnologias web fundamentais (HTML5, CSS3 e JavaScript puro), sem frameworks pesados ou dependências de backend.

---

## 🌟 Funcionalidades

- **Adicionar Tarefas:** Cadastro rápido com validação anti-espaços vazios e suporte ao pressionar a tecla `Enter`.
- **Concluir e Reabrir:** Alterne o status de qualquer tarefa clicando no checkbox personalizado.
- **Exclusão Segura com Desfazer (Undo):** Ao excluir uma tarefa, uma notificação inteligente (Toast) surge com a opção de desfazer a exclusão imediata.
- **Painel de Resumo em Tempo Real:** Indicadores automáticos de:
  - Total de tarefas cadastradas.
  - Tarefas pendentes.
  - Tarefas concluídas.
- **Filtros de Exibição:** Visualize **Todas**, apenas as **Pendentes** ou as **Concluídas** sem alterar a integridade dos dados.
- **Persistência com LocalStorage:** Suas tarefas permanecem salvas mesmo após fechar ou recarregar o navegador.
- **Estados Vazios Amigáveis:** Mensagens contextuais para cada situação (sem tarefas, sem pendências ou sem concluídas).
- **Design Moderno e Responsivo:** Layout adaptável para smartphones, tablets e computadores, com paleta neutra e destaque em roxo/violeta.
- **Acessibilidade:** Suporte a foco via teclado, atributos ARIA e contraste adequado.

---

## 🚀 Tecnologias Utilizadas

- **HTML5:** Estrutura semântica (`<header>`, `<main>`, `<section>`, `<nav>`, `<ul>`, `<footer>`).
- **CSS3:** Estilização moderna com variáveis CSS (design tokens), CSS Grid, Flexbox e animações sutis.
- **JavaScript (ES6+ Vanilla):** Lógica reativa, manipulação segura da árvore DOM (sem injeção de vulnerabilidades) e gerenciamento de estado.
- **LocalStorage API:** Persistência no armazenamento nativo do navegador do usuário.
- **Lucide Icons:** Biblioteca de ícones SVG limpos e consistentes.
- **Google Fonts (Inter):** Tipografia contemporânea de alta legibilidade.

---

## 📁 Estrutura de Arquivos

```text
minha-rotina/
├── index.html       # Estrutura HTML semântica e acessível
├── css/
│   └── style.css    # Estilização visual, responsividade e microinterações
├── js/
│   └── app.js       # Lógica da aplicação, eventos, filtros e LocalStorage
└── README.md        # Documentação e guia do projeto
```

### Responsabilidade de cada arquivo:

1. **`index.html`**: Define a hierarquia visual da aplicação: cabeçalho com data dinâmica, cards de indicadores, formulário de cadastro, área de filtros, lista de itens e o toast de notificação.
2. **`css/style.css`**: Define a identidade visual com tons neutros e roxo vibrante (`#7c3aed`), sombras suaves, cantos arredondados, estilos para tarefas concluídas (texto riscado) e regras de mídia (`@media`) para dispositivos móveis.
3. **`js/app.js`**:
   - `init()`: Inicializa a aplicação ao carregar o DOM.
   - `loadTodos()` / `saveTodos()`: Lê e salva o array de tarefas no `localStorage` com tratamento de erro (`try/catch`).
   - `handleAddTodo()`: Valida o texto digitado e insere a nova tarefa no topo da lista.
   - `toggleTodo()`: Alterna o estado `completed` da tarefa.
   - `deleteTodo()` & `handleUndoDelete()`: Exclui a tarefa mantendo histórico temporário para recuperação com a ação de desfazer.
   - `setFilter()` / `getFilteredTodos()`: Filtra dinamicamente as tarefas exibidas.
   - `updateStats()`: Recalcula os contadores de tarefas totais, pendentes e concluídas.
   - `createTodoElement()`: Constrói os elementos HTML de forma segura (`document.createElement` e `textContent`).
   - `renderApp()`: Orquestra a renderização completa da tela.

---

## 💻 Como Executar a Aplicação

Não é necessária nenhuma instalação complexa (Node.js, npm, bundlers, etc.).

### Opção 1: Abrir diretamente no Navegador
1. Localize o arquivo `index.html` na pasta do projeto.
2. Dê um duplo clique nele ou arraste-o para o navegador (Google Chrome, Microsoft Edge, Firefox, Safari).

### Opção 2: Com uma extensão de servidor local (ex: Live Server do VS Code)
1. Abra a pasta do projeto no seu editor de código.
2. Clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.
3. A aplicação abrirá automaticamente no endereço local (ex: `http://127.0.0.1:5500`).

---

## 💾 Como Funciona o Armazenamento Local (LocalStorage)

O navegador disponibiliza a API `window.localStorage`, que guarda pares de chave-valor em formato de texto (string).

1. **Salvando:** O array JavaScript de tarefas `[ { id, text, completed, createdAt }, ... ]` é transformado em texto através de `JSON.stringify(todos)` e armazenado sob a chave `'minha_rotina_tarefas_v1'`.
2. **Carregando:** Ao abrir a página, `localStorage.getItem('minha_rotina_tarefas_v1')` recupera a string salva, e `JSON.parse()` a reconverte no array original de objetos.
3. **Tratamento de Exceções:** Todas as chamadas são envolvidas em blocos `try/catch` para evitar falhas caso o usuário esteja em modo restrito ou com armazenamento cheio.

---

## 🔮 Sugestões de Próximos Passos (Para Continuar Aprendendo)

Se você quiser expandir o projeto como exercício de estudos, aqui estão algumas ótimas ideias:

1. **Edição de Tarefas:** Permitir dar duplo clique no texto de uma tarefa para editá-la diretamente.
2. **Categorias / Etiquetas (Tags):** Adicionar etiquetas com cores para diferenciar tarefas de "Trabalho", "Estudos" e "Pessoal".
3. **Data de Vencimento:** Incluir um seletor de data (`<input type="date">`) para destacar tarefas que estão atrasadas ou vencem hoje.
4. **Modo Noturno (Dark Mode):** Adicionar um botão de alternância de tema claro/escuro usando variáveis CSS.
5. **Arrastar e Soltar (Drag and Drop):** Permitir reordenar a prioridade das tarefas arrastando os cards.

