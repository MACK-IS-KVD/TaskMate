import { useState, useEffect } from 'react'
import './App.css'

// Key used to store and retrieve tasks from localStorage
const STORAGE_KEY = 'taskmate_tasks'

function App() {
  // Load saved tasks from localStorage when the app starts
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY)
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch {
      return []
    }
  })

  // Store the current text typed inside the input box
  const [taskInput, setTaskInput] = useState('')

  // Save tasks to localStorage whenever the tasks list changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  // Add a new task when the form is submitted
  function handleAddTask(event) {
    event.preventDefault()

    const trimmedText = taskInput.trim()
    if (!trimmedText) {
      return
    }

    const newTask = {
      id: Date.now(),
      text: trimmedText,
      completed: false,
    }

    setTasks([newTask, ...tasks])
    setTaskInput('')
  }

  // Toggle completed status using the checkbox
  function handleToggleTask(taskId) {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed }
      }
      return task
    })

    setTasks(updatedTasks)
  }

  // Remove a task from the list
  function handleDeleteTask(taskId) {
    const remainingTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(remainingTasks)
  }

  // Calculate task counts for the dashboard cards
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks
  const completionPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="app-container">
      {/* Header Banner */}
      <header className="dashboard-header">
        <div className="brand-group">
          <div className="brand-icon" aria-hidden="true">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div>
            <h1>TaskMate</h1>
            <p className="subtitle">Student Productivity &amp; To-Do Dashboard</p>
          </div>
        </div>
        <span className="header-badge">Study Planner</span>
      </header>

      {/* Summary Statistics Cards */}
      <section className="stats-grid" aria-label="Task summary">
        <div className="stat-card stat-total">
          <p className="stat-label">Total Tasks</p>
          <p className="stat-value">{totalTasks}</p>
        </div>

        <div className="stat-card stat-completed">
          <p className="stat-label">Completed</p>
          <p className="stat-value">{completedTasks}</p>
        </div>

        <div className="stat-card stat-pending">
          <p className="stat-label">Pending</p>
          <p className="stat-value">{pendingTasks}</p>
        </div>
      </section>

      {/* Add Task Input Card */}
      <section className="card">
        <form className="task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            className="task-input"
            placeholder="Enter a task (e.g., Revise React hooks, Submit assignment)..."
            value={taskInput}
            onChange={(event) => setTaskInput(event.target.value)}
            aria-label="New task"
          />
          <button type="submit" className="add-btn">
            Add Task
          </button>
        </form>
      </section>

      {/* Task List Card */}
      <main className="card">
        <div className="list-header">
          <h2>My Tasks</h2>
          <span className="progress-text">{completionPercent}% Done</span>
        </div>

        {totalTasks > 0 && (
          <div className="progress-bar-track" aria-hidden="true">
            <div
              className="progress-bar-fill"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        )}

        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon" aria-hidden="true">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="12" y2="17" />
              </svg>
            </div>
            <h3>Your task list is empty</h3>
            <p>
              Add your study goals, homework, or daily reminders above to start
              tracking your progress.
            </p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={
                  task.completed ? 'task-item is-completed' : 'task-item'
                }
              >
                <label className="task-label">
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                  />
                  <span
                    className={
                      task.completed ? 'task-text completed' : 'task-text'
                    }
                  >
                    {task.text}
                  </span>
                </label>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDeleteTask(task.id)}
                  aria-label={`Delete ${task.text}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

export default App
