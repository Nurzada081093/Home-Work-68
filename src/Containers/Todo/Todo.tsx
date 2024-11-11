import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store.ts';
import {
  changeStatusInAPI,
  changStatus, emptyTodoList,
  createTask, removeItem,
  deleteToDoTask,
  fetchToDoList,
  sentToDoList,
} from './todoSlice.ts';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { toast } from 'react-toastify';
import { TaskState } from '../../types';
import Loader from '../../Components/UI/Loader/Loader.tsx';
import SpinnerForButton from '../../Components/UI/SpinnerForButton/SpinnerForButton.tsx';

const Todo = () => {
  const [newToDoTask, setNewToDoTask] = useState<TaskState>({
    title: '',
    status: false,
  });

  const [deleteLoading, setDeleteLoading] = useState<{index: string | null; loading: boolean}>({
    index: null,
    loading: false,
  });

  const todoFromState = useSelector((state: RootState) => state.todo);
  const loader = useSelector((state: RootState) => state.todo.loading);
  const sentLoading = useSelector((state: RootState) => state.todo.sentLoading);
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
    setDeleteLoading(prevState => ({...prevState, loading: true, index: id}));
    await dispatch(deleteToDoTask(id));
    dispatch(removeItem(id));
    await dispatch(fetchToDoList());
    setDeleteLoading(prevState => ({...prevState, loading: false, index: null}));
    if (todoTasks.length === 0) {
      dispatch(emptyTodoList());
    }
  };

  const changeTaskStatus = async (id: string) => {
    dispatch(changStatus(id));
    await dispatch(changeStatusInAPI(id));
    await dispatch(fetchToDoList());
  };

  const tasks = todoTasks.map((task) => {
    const taskId = task.id || String(new Date());
    const color = task.status ? 'hsla(197,62%,42%,0.74)' : 'hsla(46,78%,34%,0.68)';
    return (
      <div className="card mb-3 w-100 me-5 ps-3 pe-3 text-white fs-5" key={taskId} style={{backgroundColor: color}}>
        <div style={{marginLeft: 'auto', fontSize: '10px', fontStyle: 'italic'}}>
          {task.status ? <span>выполнена</span> : <span>не выполнена</span>}
        </div>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <input type="checkbox" checked={task.status} style={{width: '25px', height: '25px'}} onChange={() => changeTaskStatus(taskId)}/>
          </div>
          <div style={{width: '75%', margin: '0 20px'}}>{task.title}</div>
          <div>
            <button type="button" className="btn" onClick={() => removeTask(taskId)} style={{display: 'flex', alignItems: 'center'}}
                    disabled={deleteLoading.loading && taskId === deleteLoading.index}>
              <img width="25" height="25" src="https://img.icons8.com/ios-filled/50/FFFFFF/delete-trash.png"
                   alt="delete-trash"/>
              {deleteLoading.loading && taskId === deleteLoading.index ? <SpinnerForButton/> : null}
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="container rounded-5 pt-5 pb-5 mt-5 mb-4" style={{backgroundColor: 'rgba(246,239,239,0.46)'}}>
        <form className="d-flex w-75" onSubmit={submitForm} style={{marginLeft: '13%'}}>
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Enter your task..."
            aria-label=".form-control-lg example"
            name="title"
            value={newToDoTask.title}
            onChange={onChange}/>
          {sentLoading ? (
            <button type="submit" className="btn btn-primary ms-5 d-flex justify-content-around align-items-center" style={{width: '200px'}}>Send<SpinnerForButton/></button>
            ) : (
            <button type="submit" className="btn btn-primary ms-5" style={{width: '200px'}}>Send</button>
          )}
        </form>
        <div className="w-75 mt-5" style={{marginLeft: '13%'}}>
          {loader ? <Loader/>
            :
            (todoTasks.length === 0 ? <div className="fs-3 text-white text-center">You don't have any tasks to complete at the moment. To execute you need to add them.</div> : tasks)}
        </div>
      </div>
    </>
  );
};

export default Todo;
