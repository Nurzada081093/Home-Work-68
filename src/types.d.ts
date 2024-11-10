export interface TaskState {
  title: string;
  status: boolean;
  id?: string;
}

export interface TodoState {
  todo: TaskState[];
  loading: boolean;
  error: boolean;
}

export interface TaskFromAPI {
  [id: string]: TaskState;
}