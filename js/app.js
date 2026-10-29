/**
 * ============================================================================
 * MINHA ROTINA - APLICAÇÃO WEB DE LISTA DE TAREFAS (TO-DO LIST)
 * 
 * Descrição: Arquivo JavaScript puro (Vanilla JS) responsável por gerenciar
 * o estado das tarefas, persistência no LocalStorage, manipulação segura da DOM,
 * filtros, contadores e microinterações de usuário.
 * ============================================================================
 */

// Chave utilizada para persistir os dados no LocalStorage
const STORAGE_KEY = 'minha_rotina_tarefas_v1';

// Estado global da aplicação
let todos = [];
let currentFilter = 'all'; // 'all' | 'pending' | 'completed'

// Variáveis para a ação de desfazer (Undo)
let lastDeletedTodo = null;
let toastTimeoutId = null;

// Referências dos Elementos da DOM
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const inputError = document.getElementById('input-error-msg');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const emptyTitle = document.getElementById('empty-title');
const emptyDesc = document.getElementById('empty-desc');
const filterButtons = document.querySelectorAll('.filter-btn');
const filteredCount = document.getElementById('filtered-count');

// Elementos de Resumo / Estatísticas
const statTotal = document.getElementById('stat-total');
const statPending = document.getElementById('stat-pending');
const statCompleted = document.getElementById('stat-completed');

// Data Atual
const currentDateText = document.getElementById('current-date-text');

// Elementos do Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastUndoBtn = document.getElementById('toast-undo-btn');

/**
 * Inicialização da Aplicação
 */
function init() {
  renderCurrentDate();
  loadTodos();
  setupEventListeners();
  renderApp();
}

/**
 * Exibe a data formatada no cabeçalho (ex: "Quinta-feira, 29 de out.")
 */
function renderCurrentDate() {
  try {
    const today = new Date();
    const options = { weekday: 'long', day: 'numeric', month: 'short' };
    let formatted = today.toLocaleDateString('pt-BR', options);
    // Capitalizar a primeira letra do dia da semana
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
    currentDateText.textContent = formatted;
  } catch (error) {
    console.error('Erro ao formatar data atual:', error);
    currentDateText.textContent = 'Hoje';
  }
}

/**
 * Carrega a lista de tarefas salva no LocalStorage com tratamento de exceções.
 */
function loadTodos() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      todos = JSON.parse(savedData);
      // Garantir que é um array válido
      if (!Array.isArray(todos)) {
        todos = [];
      }
    } else {
      todos = [];
    }
  } catch (error) {
    console.error('Erro ao ler do LocalStorage:', error);
    todos = [];
  }
}

/**
 * Salva a lista de tarefas no LocalStorage com tratamento de exceções.
 */
function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Erro ao salvar no LocalStorage:', error);
    showToast('Aviso: Não foi possível salvar as tarefas localmente.');
  }
}

/**
 * Configura os ouvintes de eventos da interface.
 */
function setupEventListeners() {
  // Formulário de adição de tarefa
  form.addEventListener('submit', handleAddTodo);

  // Limpa a mensagem de erro quando o usuário começa a digitar
  input.addEventListener('input', () => {
    if (inputError.hidden === false) {
      inputError.hidden = true;
    }
  });

  // Botões de filtro
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedFilter = btn.dataset.filter;
      setFilter(selectedFilter);
    });
  });

  // Botão de desfazer no Toast
  toastUndoBtn.addEventListener('click', handleUndoDelete);
}

/**
 * Trata o envio do formulário para adicionar nova tarefa.
 * @param {Event} event 
 */
function handleAddTodo(event) {
  event.preventDefault();
  
  const text = input.value.trim();

  // Validação: rejeitar tarefas vazias ou só com espaços
  if (!text) {
    inputError.hidden = false;
    input.focus();
    return;
  }

  inputError.hidden = true;

  // Criação do objeto da tarefa
  const newTodo = {
    id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    text: text,
    completed: false,
    createdAt: new Date().toISOString()
  };

  // Adiciona ao topo da lista
  todos.unshift(newTodo);
  saveTodos();
  renderApp();

  // Limpar campo e focar novamente
  input.value = '';
  input.focus();
}

/**
 * Alterna o status de concluído/pendente de uma tarefa.
 * @param {string} id 
 */
function toggleTodo(id) {
  const todo = todos.find(item => item.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderApp();
  }
}

/**
 * Exclui uma tarefa com suporte a recuperação (Undo).
 * @param {string} id 
 */
function deleteTodo(id) {
  const index = todos.findIndex(item => item.id === id);
  if (index !== -1) {
    // Armazena a tarefa removida e seu índice original para o "Desfazer"
    lastDeletedTodo = {
      todo: todos[index],
      index: index
    };

    // Remove do array
    todos.splice(index, 1);
    saveTodos();
    renderApp();

    // Notifica com Toast e opção de desfazer
    showToast(`Tarefa "${lastDeletedTodo.todo.text}" excluída.`, true);
  }
}

/**
 * Desfaz a última exclusão de tarefa.
 */
function handleUndoDelete() {
  if (lastDeletedTodo) {
    // Insere de volta na posição original ou no início se fora de alcance
    const insertIndex = Math.min(lastDeletedTodo.index, todos.length);
    todos.splice(insertIndex, 0, lastDeletedTodo.todo);
    
    saveTodos();
    renderApp();

    hideToast();
    lastDeletedTodo = null;
  }
}

/**
 * Atualiza o filtro ativo e renderiza novamente a tela.
 * @param {string} filter 
 */
function setFilter(filter) {
  currentFilter = filter;
  
  // Atualiza classes ativas nos botões
  filterButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });

  renderApp();
}

/**
 * Retorna a lista de tarefas filtrada com base no filtro atual.
 * @returns {Array}
 */
function getFilteredTodos() {
  switch (currentFilter) {
    case 'pending':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    case 'all':
    default:
      return todos;
  }
}

/**
 * Atualiza os contadores numéricos de resumo.
 */
function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.completed).length;
  const pending = total - completed;

  statTotal.textContent = total;
  statPending.textContent = pending;
  statCompleted.textContent = completed;
}

/**
 * Cria de forma segura um elemento DOM de item de tarefa (sem innerHTML vulnerável).
 * @param {Object} todo 
 * @returns {HTMLLIElement}
 */
function createTodoElement(todo) {
  const li = document.createElement('li');
  li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
  li.dataset.id = todo.id;

  // Container principal (checkbox + texto)
  const mainDiv = document.createElement('div');
  mainDiv.className = 'todo-main';

  // Botão Checkbox
  const checkBtn = document.createElement('button');
  checkBtn.type = 'button';
  checkBtn.className = 'checkbox-btn';
  checkBtn.setAttribute('aria-label', todo.completed ? 'Marcar como pendente' : 'Marcar como concluída');
  checkBtn.setAttribute('title', todo.completed ? 'Reabrir tarefa' : 'Concluir tarefa');
  
  // Ícone de check dentro do checkbox
  const checkIcon = document.createElement('i');
  checkIcon.setAttribute('data-lucide', 'check');
  checkBtn.appendChild(checkIcon);

  checkBtn.addEventListener('click', () => toggleTodo(todo.id));

  // Texto da tarefa
  const spanText = document.createElement('span');
  spanText.className = 'todo-text';
  spanText.textContent = todo.text; // Manipulação segura do texto

  mainDiv.appendChild(checkBtn);
  mainDiv.appendChild(spanText);

  // Botão Excluir
  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'delete-btn';
  deleteBtn.setAttribute('aria-label', `Excluir tarefa: ${todo.text}`);
  deleteBtn.setAttribute('title', 'Excluir tarefa');

  const trashIcon = document.createElement('i');
  trashIcon.setAttribute('data-lucide', 'trash-2');
  deleteBtn.appendChild(trashIcon);

  deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

  // Montagem do item completo
  li.appendChild(mainDiv);
  li.appendChild(deleteBtn);

  return li;
}

/**
 * Renderiza todos os componentes da interface.
 */
function renderApp() {
  updateStats();

  const filtered = getFilteredTodos();
  
  // Atualiza contador de itens do filtro
  const countLabel = filtered.length === 1 ? '1 item' : `${filtered.length} itens`;
  filteredCount.textContent = countLabel;

  // Limpa a lista atual
  todoList.innerHTML = '';

  if (filtered.length === 0) {
    todoList.hidden = true;
    emptyState.hidden = false;

    // Mensagens dinâmicas para o estado vazio
    if (todos.length === 0) {
      emptyTitle.textContent = 'Tudo organizado por aqui!';
      emptyDesc.textContent = 'Adicione sua primeira tarefa para começar a planejar seu dia.';
    } else if (currentFilter === 'pending') {
      emptyTitle.textContent = 'Nenhuma tarefa pendente!';
      emptyDesc.textContent = 'Parabéns, você concluiu todas as suas pendências.';
    } else if (currentFilter === 'completed') {
      emptyTitle.textContent = 'Nenhuma tarefa concluída ainda.';
      emptyDesc.textContent = 'Conclua suas tarefas pendentes para vê-las listadas aqui.';
    }
  } else {
    todoList.hidden = false;
    emptyState.hidden = true;

    // Anexa cada item criado
    filtered.forEach(todo => {
      const element = createTodoElement(todo);
      todoList.appendChild(element);
    });
  }

  // Inicializa ou atualiza os ícones do Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

/**
 * Exibe uma mensagem flutuante (Toast) com temporizador para auto-ocultação.
 * @param {string} message 
 * @param {boolean} showUndo 
 */
function showToast(message, showUndo = false) {
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }

  toastMessage.textContent = message;
  toastUndoBtn.style.display = showUndo ? 'inline-block' : 'none';
  toast.hidden = false;

  // Recarrega ícone do toast
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Oculta automaticamente após 5 segundos
  toastTimeoutId = setTimeout(() => {
    hideToast();
  }, 5000);
}

/**
 * Oculta a notificação Toast.
 */
function hideToast() {
  toast.hidden = true;
  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
    toastTimeoutId = null;
  }
}

// Inicia a aplicação assim que o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);

