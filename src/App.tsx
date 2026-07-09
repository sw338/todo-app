import { useState, useEffect } from "react";

interface Todo {
  id: string;
  text: string;
  done: boolean;
}

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem("todos");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.done;
    if (filter === "done") return t.done;
    return true;
  });

  const remaining = todos.filter((t) => !t.done).length;

  function addTodo() {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      ...prev,
      { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), text, done: false },
    ]);
    setInput("");
  }

  function toggleTodo(id: string) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function startEdit(todo: Todo) {
    setEditId(todo.id);
    setEditText(todo.text);
  }

  function saveEdit(id: string) {
    const text = editText.trim();
    if (!text) return;
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
    setEditId(null);
    setEditText("");
  }

  function clearDone() {
    setTodos((prev) => prev.filter((t) => !t.done));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-4 pt-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          📝 Todo App
        </h1>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="添加新的待办事项..."
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
          />
          <button
            onClick={addTodo}
            className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors shadow-sm"
          >
            添加
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {(["all", "active", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === f
                  ? "bg-indigo-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              {f === "all" ? "全部" : f === "active" ? "未完成" : "已完成"}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400 flex items-center">
            {remaining} 项剩余
          </span>
        </div>

        {/* Todo list */}
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              {filter === "all" ? "还没有待办事项" : filter === "active" ? "所有事项已完成 🎉" : "没有已完成的事项"}
            </p>
          )}
          {filtered.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border transition-all ${
                todo.done ? "border-green-200 opacity-70" : "border-gray-100"
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                  todo.done
                    ? "bg-green-400 border-green-400 text-white"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
              >
                {todo.done && (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              {editId === todo.id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                  onBlur={() => saveEdit(todo.id)}
                  autoFocus
                  className="flex-1 px-2 py-1 border border-indigo-300 rounded outline-none text-gray-700"
                />
              ) : (
                <span
                  className={`flex-1 text-gray-700 ${todo.done ? "line-through text-gray-400" : ""}`}
                  onDoubleClick={() => startEdit(todo)}
                >
                  {todo.text}
                </span>
              )}

              <button
                onClick={() => startEdit(todo)}
                className="text-gray-300 hover:text-indigo-500 transition-colors shrink-0"
                title="编辑"
              >
                ✏️
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                title="删除"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {/* Clear done */}
        {todos.some((t) => t.done) && (
          <div className="text-center mt-6">
            <button
              onClick={clearDone}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              清除已完成
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
