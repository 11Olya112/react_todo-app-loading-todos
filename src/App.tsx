import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import classnames from 'classnames';
import { createTodos, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [value, setValue] = useState('');
  const [islinkAll, setislinkAll] = useState(true);
  const [islinkActive, setislinkActive] = useState(false);
  const [islinkCompleted, setislinkCompleted] = useState(false);
  const [savedId, setsavedId] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [isError, setisError] = useState(true);
  const [completedTodo, setCompletedTodo] = useState<Todo>({
    id: 0,
    userId: 0,
    title: '',
    completed: false,
  });

  useEffect(() => {
    getTodos(user?.id).then(setTodos);
    setisError(false);
    createTodos(value).then(setTodos);
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const filterList = (): Todo[] | undefined => todos.filter((todo) => {
    if (currentFilter === 'Active') {
      setislinkAll(false);
      setislinkActive(true);
      setislinkCompleted(false);

      return !todo.completed;
    }

    if (currentFilter === 'Completed') {
      setislinkAll(false);
      setislinkActive(false);
      setislinkCompleted(true);

      return todo.completed;
    }

    setislinkAll(true);
    setislinkActive(false);
    setislinkCompleted(false);

    return todo;
  });

  const filteredList = useMemo(() => filterList(), [currentFilter, todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            aria-label="button"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              value={value}
              ref={newTodoField}
              onChange={(event) => {
                setValue(event.target.value);
              }}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
        {todos.length !== 0
        && (
          <>
            <ul>
              {filteredList
              && filteredList.map((todo) => (
                <section className="todoapp__main" data-cy="TodoList">
                  <li key={todo.id}>
                    <div
                      data-cy="Todo"
                      className={todo.completed ? 'todo completed' : 'todo'}
                    >
                      <label className="todo__status-label">
                        <input
                          data-cy="TodoStatus"
                          type="checkbox"
                          className="todo__status"
                          defaultChecked
                          onClick={() => {
                            setCompletedTodo((prevState) => ({
                              ...prevState,
                              completed: !prevState.completed,
                            }));
                            /* eslint no-param-reassign: ["error", { "props": false }] */
                            if (todo.id === savedId && completedTodo) {
                              todo.completed = false;
                            } else {
                              todo.completed = true;
                            }

                            // setCompletedTodo(todo);
                            setsavedId(todo.id);
                          }}
                        />
                      </label>

                      <span data-cy="TodoTitle" className="todo__title">
                        {todo.title}
                      </span>
                      <button
                        type="button"
                        className="todo__remove"
                        data-cy="TodoDeleteButton"
                      >
                        ×
                      </button>

                      <div data-cy="TodoLoader" className="modal overlay">
                        <div className="
                          modal-background
                          has-background-white-ter"
                        />
                        <div className="loader" />
                      </div>
                    </div>
                  </li>
                  {' '}
                </section>
              ))}
            </ul>
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="todosCounter">
                {` ${filteredList?.filter((todo) => !todo.completed)?.length} items left`}
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  onClick={() => setCurrentFilter('All')}
                  className={classnames('filter__link', {
                    selected: islinkAll,
                  })}
                >
                  All
                </a>

                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  onClick={() => setCurrentFilter('Active')}
                  className={classnames('filter__link', {
                    selected: islinkActive,
                  })}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  onClick={() => setCurrentFilter('Completed')}
                  className={classnames('filter__link', {
                    selected: islinkCompleted,
                  })}
                >
                  Completed
                </a>
              </nav>

              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={() => setValue('')}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}

        {isError && (
          <div
            data-cy="ErrorNotification"
            className="notification is-danger is-light has-text-weight-normal"
          >
            <button
              aria-label="button"
              data-cy="HideErrorButton"
              type="button"
              className="delete"
            />
            Unable to add a todo
            <br />
            Unable to delete a todo
            <br />
            Unable to update a todo
          </div>
        )}
      </div>
    </div>
  );
};
