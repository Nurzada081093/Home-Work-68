import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../app/store.ts';
import { createTask, fetchToDoList, sentToDoList } from './todoSlice.ts';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { toast } from 'react-toastify';

interface Props {
  title: string;
  status: boolean;
}

const Todo = () => {
  const [newToDoTask, setNewToDoTask] = useState<Props>({
    title: '',
    status: false,
  });

  const todoTitle = useSelector((state: RootState) => state.todo);
  const dispatch: AppDispatch = useDispatch();

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


  console.log(todoTitle);

  return (
    <div className="container mt-5">
      <form className='d-flex' onSubmit={submitForm}>
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

    </div>
  );
};

export default Todo;
