export interface Task {
  id: number;

  project_id: number;

  project_name?: string;

  title: string;

  description: string;

  status: string;

  priority: string;

  due_date: string | null;

  created_at: string;

  updated_at: string;
}
