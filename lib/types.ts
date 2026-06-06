export type Priority = "must" | "nice";
export type Deadline = "today" | "flexible" | string;
export type TaskStatus = "inbox" | "today" | "done";
export type Category = "Work" | "Personal" | "Learning" | "Films/Books" | "Other";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  duration: number;
  deadline: Deadline;
  status: TaskStatus;
  category: Category;
  createdAt: string;
}
