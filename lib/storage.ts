import { Task } from "./types";

const KEY = "ai_planner_tasks";

export function getTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

export function addTasks(newTasks: Task[]): void {
  const existing = getTasks();
  saveTasks([...existing, ...newTasks]);
}

export function updateTask(id: string, updates: Partial<Task>): void {
  const tasks = getTasks();
  saveTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)));
}

export function deleteTask(id: string): void {
  saveTasks(getTasks().filter((t) => t.id !== id));
}
