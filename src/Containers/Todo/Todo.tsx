import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store.ts';
import { createTask } from './todoSlice.ts';

const Todo = () => {
  const todoTitle = useSelector((state: RootState) => state.todo.title);
  const dispatch = useDispatch();

  return (
    <div>
      <div>{todoTitle}</div>
      <button type="button" onClick={() => dispatch(createTask('To walk with my daughter.'))}>click</button>
    </div>
  );
};

export default Todo;