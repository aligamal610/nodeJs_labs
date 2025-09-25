const express = require('express');

const app = express();
app.use(express.json());

// Todos
let todos = [
  { id: 1, title: 'handball training', completed: false },
  { id: 2, title: 'asseigenment 1', completed: true },
  { id: 3, title: 'project 1', completed: false },
];

// Async function getAllTods
async function getAllTodos() {
  return Promise.resolve(todos);
}
// Async function getTodoById
async function getTodoById(id) {
  const found = todos.find(t => String(t.id) === String(id));
  return Promise.resolve(found || null);
}
// Async function deleteTodoById
async function deleteTodoById(id) {
  const idx = todos.findIndex(t => String(t.id) === String(id));
  if (idx === -1) return Promise.resolve(false);
  todos.splice(idx, 1);
  return Promise.resolve(true);
}
//-----------------------------------------------------------------
// Routes

// GET /api/todos -> { items: Todo[], total: number }
app.get('/api/todos', async (req, res, next) => {
  try {
    const items = await getAllTodos();
    res.status(200).json({ items, total: items.length });
  } catch (err) {
    next(err);
  }
});

// GET /api/todos/:id -> todo or 404
app.get('/api/todos/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const todo = await getTodoById(id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/todos/:id -> 204 or 404
app.delete('/api/todos/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const ok = await deleteTodoById(id);
    if (!ok) return res.status(404).json({ error: 'Todo not found' });
    // 204 No Content 
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Todo API listening on http://localhost:${PORT}`);
});
