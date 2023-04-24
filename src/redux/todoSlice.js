import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseUrl = "http://localhost:7000";

export const getTodosAsync = createAsyncThunk(
  "todos/getTodosAsync",
  async () => {
    const response = await fetch(`${baseUrl}/todos`);
    if (response.ok) {
      const todos = await response.json();
      return { todos };
    }
  }
);

export const addTodoAsync = createAsyncThunk(
  "todos/addTodoAsync",
  async (payload) => {
    console.log("addTodo");
    const response = await fetch(`${baseUrl}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: payload.title }),
    });

    if (response.ok) {
      const todo = await response.json();
      return { todo };
    }
  }
);

export const toggleCompleteAsync = createAsyncThunk(
  "todos/toggleCompleteAsync",
  async (payload) => {
    const response = await fetch(`${baseUrl}/todos/${payload.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: payload.completed }),
    });

    if (response.ok) {
      const todo = await response.json();
      return todo;
    }
  }
);

export const deleteTodoAsync = createAsyncThunk(
  "todos/deleteTodoAsync",
  async (payload) => {
    const response = await fetch(`${baseUrl}/todos/${payload.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return { id: payload.id };
    }
  }
);

export const todoSlice = createSlice({
  name: "todo",
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        title: action.payload.title,
        completed: false,
      };
      state.push(newTodo);
    },
    toggleComplete: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
    deleteTodo: (state, action) =>
      state.filter((todo) => todo.id !== action.payload.id),
  },
  extraReducers: {
    [getTodosAsync.pending]: () => console.log("pending"),
    [getTodosAsync.fulfilled]: (_state, action) => {
      return action.payload.todos;
    },
    [addTodoAsync.fulfilled]: (state, action) => {
      state.push(action.payload.todo);
    },
    [toggleCompleteAsync.fulfilled]: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
    [deleteTodoAsync.fulfilled]: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload.id);
    },
  },
});

export const { addTodo, toggleComplete, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
