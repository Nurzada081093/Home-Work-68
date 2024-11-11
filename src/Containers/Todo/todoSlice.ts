import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosRequest from '../../axiosRequest.ts';
import { RootState } from '../../app/store.ts';
import { TaskFromAPI, TaskState, TodoState } from '../../types';

const initialState: TodoState = {
  todo: [],
  loading: false,
  error: false,
};

export const sentToDoList = createAsyncThunk<void, {title: string, status: boolean}, {state: RootState}>('todo/sentToDoList', async (_arg, thunkAPi) => {
  const dataFromState = thunkAPi.getState().todo.todo;

  let taskObject: TaskState | null = null;

  dataFromState.forEach((task) => {
    taskObject = {
      title: task.title,
      status: task.status,
    };
  });

  await axiosRequest.post('todo.json', taskObject);
});

export const fetchToDoList = createAsyncThunk('todo/fetchToDoList', async () => {
  const response: {data: TaskFromAPI} = await axiosRequest<TaskFromAPI>('todo.json');

  if (response.data) {
    return Object.keys(response.data).map((postInfo) => {
      return {
        ...response.data[postInfo],
        id: postInfo,
      };
    });
  }
});

export const deleteToDoTask = createAsyncThunk<void, string, {state: RootState}>('todo/deleteToDoTask', async (_arg, thunkAPI) => {
 if ( thunkAPI) {
   await axiosRequest.delete(`todo/${_arg}.json`);
 }
});

export const changeStatusInAPI = createAsyncThunk<void, string, {state: RootState}>('todo,changeStatusInAPI', async (_arg, thunkAPI) => {
  const dataFromState = thunkAPI.getState().todo.todo;
  const task = dataFromState.find((task) => task.id === _arg);

  await axiosRequest.put(`todo/${_arg}.json`, task);
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
        taskToCheck.status = true;
      }
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
        state.loading = true;
        state.error = false;
      })
      .addCase(sentToDoList.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sentToDoList.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      .addCase(deleteToDoTask.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(deleteToDoTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteToDoTask.rejected, (state) => {
        state.loading = false;
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
export const {createTask, changStatus} = todoSlice.actions;

