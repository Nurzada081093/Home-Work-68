import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store.ts';
import {
  changeStatusInAPI,
  changStatus,
  createTask,
  deleteToDoTask,
  fetchToDoList,
  sentToDoList
} from './todoSlice.ts';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { toast } from 'react-toastify';
import { TaskState } from '../../types';

const Todo = () => {
  const [newToDoTask, setNewToDoTask] = useState<TaskState>({
    title: '',
    status: false,
  });

  const todoFromState = useSelector((state: RootState) => state.todo);
  const dispatch: AppDispatch = useDispatch();
  const todoTasks = todoFromState.todo;

  useEffect(() => {
    dispatch(fetchToDoList());
  }, [dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setNewToDoTask(prevState => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newToDoTask.title.trim().length > 0) {
      dispatch(createTask(newToDoTask));
      await dispatch(sentToDoList(newToDoTask));
      await dispatch(fetchToDoList());
    } else {
      toast.warning('Enter your task!');
    }

    setNewToDoTask({
      title: '',
      status: false,
    });
  };

  const removeTask = async (id: string) => {
    await dispatch(deleteToDoTask(id));
    await dispatch(fetchToDoList());
  };

  const changeTaskStatus = async (id: string) => {
    dispatch(changStatus(id));
    await dispatch(changeStatusInAPI(id));
    await dispatch(fetchToDoList());
  };

  const tasks = todoTasks.map((task) => {
    const taskId = task.id || String(new Date());
    return (
      <div className="card mb-3" key={taskId}>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <input type="checkbox" checked={task.status} style={{width: '20px', height: '20px'}} onChange={() => changeTaskStatus(taskId)}/>
          </div>
          <div>{task.title}</div>
          <div>
            <button type="button" className="border-0 bg-transparent" onClick={() => removeTask(taskId)}>
              <img src="https://img.icons8.com/carbon-copy/50/filled-trash.png"
                   alt="filled-trash"/>

            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="container mt-5">
      <form className="d-flex" onSubmit={submitForm}>
        <input
          className="form-control form-control-lg"
          type="text"
          placeholder="Enter your task..."
          aria-label=".form-control-lg example"
          name="title"
          value={newToDoTask.title}
          onChange={onChange}/>
        <button type="submit" className="btn btn-primary ms-5">Send</button>
      </form>
      <hr/>
      {todoTasks.length === 0 ?
          <div>Нет задач для выполнения еще</div>
         :
          tasks
        }
    </div>
  );
};

export default Todo;
