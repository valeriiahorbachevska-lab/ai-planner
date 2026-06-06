export type Priority = "must" | "nice";
export type Deadline = "today" | "flexible" | string;
export type TaskStatus = "inbox" | "today" | "done";

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  duration: number;
  deadline: Deadline;
  status: TaskStatus;
  createdAt: string;
}
