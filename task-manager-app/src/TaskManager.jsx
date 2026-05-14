// src/TaskManager.jsx
import { useState } from "react";
import { Check, X, Pencil, Trash2, Plus } from "lucide-react";
import "./TaskManager.css";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [shouldShake, setShouldShake] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  function showError(message) {
    setErrorMessage(message);
    setShouldShake(true);

    setTimeout(() => {
      setShouldShake(false);
    }, 400);
  }

  function taskTitleExists(title, taskIdToIgnore = null) {
    return tasks.some(
      (task) =>
        task.id !== taskIdToIgnore &&
        task.title.toLowerCase() === title.toLowerCase()
    );
  }

  function addTask() {
    const trimmedTitle = taskTitle.trim();

    if (trimmedTitle === "") {
      showError("Please enter a task.");
      return;
    }

    if (taskTitleExists(trimmedTitle)) {
      showError("Task already exists.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: trimmedTitle,
      completed: false,
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTaskTitle("");
    setErrorMessage("");
  }

  function toggleTaskCompletion(taskId) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function deleteTask(taskId) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

    if (editingTaskId === taskId) {
      cancelEdit();
    }
  }

  function startEdit(task) {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setErrorMessage("");
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setEditingTitle("");
    setErrorMessage("");
  }

  function saveEdit(taskId) {
    const trimmedTitle = editingTitle.trim();

    if (trimmedTitle === "") {
      showError("Task title cannot be empty.");
      return;
    }

    if (taskTitleExists(trimmedTitle, taskId)) {
      showError("Task already exists.");
      return;
    }

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, title: trimmedTitle } : task
      )
    );

    setEditingTaskId(null);
    setEditingTitle("");
    setErrorMessage("");
  }

  function renderTaskList(taskList, emptyMessage) {
    if (taskList.length === 0) {
      return <p className="empty-message">{emptyMessage}</p>;
    }

    return taskList.map((task) => (
      <div
        key={task.id}
        className={`task-item ${
          task.completed ? "completed-task" : "incomplete-task"
        }`}
      >
        <div className="task-content">
          {editingTaskId === task.id ? (
            <input
              className="edit-input"
              type="text"
              value={editingTitle}
              onChange={(event) => setEditingTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  saveEdit(task.id);
                }

                if (event.key === "Escape") {
                  cancelEdit();
                }
              }}
            />
          ) : (
            <h3>{task.title}</h3>
          )}
        </div>

        <div className="task-actions">
          {editingTaskId === task.id ? (
            <>
              <button
                className="icon-button save-button"
                onClick={() => saveEdit(task.id)}
                title="Save Task"
              >
                <Check size={18} />
              </button>

              <button
                className="icon-button secondary-button"
                onClick={cancelEdit}
                title="Cancel Edit"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                className="icon-button complete-button"
                onClick={() => toggleTaskCompletion(task.id)}
                title={task.completed ? "Mark Incomplete" : "Mark Complete"}
              >
                {task.completed ? <X size={18} /> : <Check size={18} />}
              </button>

              {!task.completed && (
                <button
                  className="icon-button edit-button"
                  onClick={() => startEdit(task)}
                  title="Edit Task"
                >
                  <Pencil size={17} />
                </button>
              )}

              <button
                className="icon-button delete-button"
                onClick={() => deleteTask(task.id)}
                title="Delete Task"
              >
                <Trash2 size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    ));
  }

  return (
    <div className="task-container">
      <h1>Task Manager</h1>

      <div className="task-form">
        <input
          className={shouldShake ? "shake-input" : ""}
          type="text"
          placeholder="Enter a task"
          value={taskTitle}
          onChange={(event) => {
            setTaskTitle(event.target.value);
            setErrorMessage("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              addTask();
            }
          }}
        />

        <button className="add-button" onClick={addTask} title="Add Task">
          <Plus size={24} />
        </button>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <section className="task-section">
        <h2>Incomplete Tasks</h2>
        <div className="task-list">
          {renderTaskList(incompleteTasks, "No incomplete tasks.")}
        </div>
      </section>

      <section className="task-section">
        <h2>Completed Tasks</h2>
        <div className="task-list">
          {renderTaskList(completedTasks, "No completed tasks yet.")}
        </div>
      </section>
    </div>
  );
}