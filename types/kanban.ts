export interface User {
  id: string;
  name: string;
  role: string;
  online: boolean;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  tag: string;
  tagType: string;
  kanban_column: string;
  progress: string;
  assignees: string[];
  comments: number;
  attachments: number;
  subtasks: number;
}

export interface Column {
  id: string;
  title: string;
  count: number;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
}

export interface Attachment {
  id: string;
  taskId: string;
  name: string;
  url: string;
  type: string;
}

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id">) => void;
  columnId: string;
  task?: Task; 
}

export interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
}

export interface BoardColumnProps {
  column: Column & { tasks: Task[] };
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
  onAddComment: (taskId: string, comment: string) => void;
  onAssignUser: (taskId: string, userId: string) => void;
}