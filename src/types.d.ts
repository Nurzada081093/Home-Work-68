export interface TaskState {
  title: string;
  status: boolean;
  id?: string;
}

export interface TodoState {
  todo: TaskState[];
  loading: boolean;
  error: boolean;
  sentLoading: boolean;
  deleteLoading: boolean;
}

export interface TaskFromAPI {
  [id: string]: TaskState;
}