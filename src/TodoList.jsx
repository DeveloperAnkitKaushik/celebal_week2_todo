import { useState, useEffect } from 'react';
import './style.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('none');

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    try {
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error parsing localStorage tasks:', error);
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTask.trim() === '') return;
    setTasks([...tasks, { text: newTask, completed: false }]);
    setNewTask('');
  };

  const handleRemoveTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleToggleTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'completed':
        return tasks.filter(task => task.completed);
      case 'active':
        return tasks.filter(task => !task.completed);
      default:
        return tasks;
    }
  };

  const getSortedTasks = (filteredTasks) => {
    switch (sort) {
      case 'asc':
        return [...filteredTasks].sort((a, b) => a.text.localeCompare(b.text));
      case 'desc':
        return [...filteredTasks].sort((a, b) => b.text.localeCompare(a.text));
      default:
        return filteredTasks;
    }
  };

  const displayedTasks = getSortedTasks(getFilteredTasks());

  return (
    <div className="todo-container">
      <h1>Today main focus</h1>
      <input
        className="task-input"
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="What is your next task?"
      />
      <button onClick={handleAddTask}>Add Task</button>
      <div>
        <label>Filter:</label>
        <select value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <label>Sort:</label>
        <select value={sort} onChange={handleSortChange}>
          <option value="none">None</option>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <ul className="task-list">
        {displayedTasks.map((task, index) => (
          <li key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <span className="task-text">
              {task.text}
            </span>
            <button 
              className={`completed-task ${task.completed ? 'completed' : ''}`} 
              onClick={() => handleToggleTask(index)}
            >
              {task.completed ? 'Undo' : 'Complete'}
            </button>
            <button className="remove-task" onClick={() => handleRemoveTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
