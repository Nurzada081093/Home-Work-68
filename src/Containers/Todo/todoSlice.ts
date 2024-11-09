import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TodoState {
  title: string;
  status: boolean;
}

const initialState: TodoState = {
  title: '',
  status: false,
};

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    createTask: (state, action: PayloadAction<string>) => {
      state.title += action.payload;
    },
    
  },

});

export const todoReducer = todoSlice.reducer;
export const {createTask} = todoSlice.actions;

