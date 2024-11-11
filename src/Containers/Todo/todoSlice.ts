import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosRequest from '../../axiosRequest.ts';
import { RootState } from '../../app/store.ts';
import { TaskFromAPI, TaskState, TodoState } from '../../types';
import { toast } from 'react-toastify';

const initialState: TodoState = {
  todo: [],
  loading: false,
  error: false,
  sentLoading: false,
  deleteLoading: false,
};

export const sentToDoList = createAsyncThunk<void, {title: string, status: boolean}, {state: RootState}>('todo/sentToDoList', async (_arg, thunkAPi) => {
  try {
    const dataFromState = thunkAPi.getState().todo.todo;

    let taskObject: TaskState | null = null;

    dataFromState.forEach((task) => {
      taskObject = {
        title: task.title,
        status: task.status,
      };
    });

    await axiosRequest.post('todo.json', taskObject);
  } catch (e) {
    toast.error(`${e}`);
  }
});

export const fetchToDoList = createAsyncThunk('todo/fetchToDoList', async () => {
  try {
    const response: {data: TaskFromAPI} = await axiosRequest<TaskFromAPI>('todo.json');

    if (response.data) {
      return Object.keys(response.data).map((postInfo) => {
        return {
          ...response.data[postInfo],
          id: postInfo,
        };
      });
    }
  } catch (e) {
    toast.error(`${e}`);
  }
});

export const deleteToDoTask = createAsyncThunk<void, string, {state: RootState}>('todo/deleteToDoTask', async (_arg, thunkAPI) => {
  try {
    if ( thunkAPI) {
      await axiosRequest.delete(`todo/${_arg}.json`);
    }
  } catch (e) {
    toast.error(`${e}`);
  }
});

export const changeStatusInAPI = createAsyncThunk<void, string, {state: RootState}>('todo,changeStatusInAPI', async (_arg, thunkAPI) => {
  try {
    const dataFromState = thunkAPI.getState().todo.todo;
    const task = dataFromState.find((task) => task.id === _arg);
    await axiosRequest.put(`todo/${_arg}.json`, task);
  } catch (e) {
    toast.error(`${e}`);
  }
});


export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    createTask: (state, action: PayloadAction<{ title: string; status: boolean }>) => {
      state.todo.push({
        title: action.payload.title,
        status: action.payload.status,
      });
    },

    changStatus: (state, action: PayloadAction<string>) => {
      const taskToCheck = state.todo.find((task) => task.id === action.payload);

      if (taskToCheck) {
        taskToCheck.status = !taskToCheck.status;
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.todo = state.todo.filter(task => task.id !== action.payload);
    },

    emptyTodoList: (state) => {
      state.todo = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToDoList.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchToDoList.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload !== undefined) {
          state.todo = action.payload;
        }
      })
      .addCase(fetchToDoList.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(sentToDoList.pending, (state) => {
        state.sentLoading = true;
        state.error = false;
      })
      .addCase(sentToDoList.fulfilled, (state) => {
        state.sentLoading = false;
      })
      .addCase(sentToDoList.rejected, (state) => {
        state.sentLoading = false;
        state.error = true;
      })
      .addCase(deleteToDoTask.pending, (state) => {
        state.deleteLoading = true;
        state.error = false;
      })
      .addCase(deleteToDoTask.fulfilled, (state) => {
        state.deleteLoading = false;
      })
      .addCase(deleteToDoTask.rejected, (state) => {
        state.deleteLoading = false;
        state.error = true;
      })
      .addCase(changeStatusInAPI.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(changeStatusInAPI.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changeStatusInAPI.rejected, (state) => {
        state.loading = false;
        state.error = true;
      });
  }
});

export const todoReducer = todoSlice.reducer;
export const {createTask, changStatus, removeItem, emptyTodoList} = todoSlice.actions;

