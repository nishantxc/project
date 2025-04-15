// Define types
export interface Task {
  id?: string;
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

export interface TaskResponse {
  task: Task;
}

export interface TasksResponse {
  tasks: Task[];
}

export interface Member {
  id: string;
  name: string;
  online?: boolean;
  avatar?: string;
  user_id: string;
  created_at: string;
}

export interface MemberResponse {
  member: Member;
}

export interface MembersResponse {
  members: Member[];
}
