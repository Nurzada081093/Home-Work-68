export interface TaskState {
  title: string;
  status: boolean;
}

export interface TodoState {
  todo: TaskState[];
  loading: boolean;
  error: boolean;
}

export interface TaskFromAPI {
  [id: string]: TaskState;
}