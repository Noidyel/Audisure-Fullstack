import React, { useEffect, useState } from "react";
import "../styles/user_styles.css"; // Ensure this includes Audisure styles

export default function ViewTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/tasks/${userEmail}`);
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        setTasks(data || []);
      } catch (err) {
        console.error("Fetch tasks error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [userEmail]);

  const updateStatus = async (taskId, newStatus) => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId, status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update task");

      setTasks((prev) =>
        prev.map((task) =>
          task.task_id === taskId ? { ...task, status: newStatus } : task
        )
      );

      setSuccessMsg(`Task updated to "${newStatus}" successfully!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Update status error:", err);
      setError(err.message);
    }
  };

  const archiveTask = async (taskId) => {
    try {
      const res = await fetch("http://localhost:5000/api/tasks/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task_id: taskId }),
      });

      if (!res.ok) throw new Error("Failed to archive task");

      setTasks((prev) => prev.filter((task) => task.task_id !== taskId));
      setSuccessMsg("Task archived successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Archive task error:", err);
      setError(err.message);
    }
  };

  if (!userEmail) return <p>Loading user info...</p>;
  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (tasks.length === 0) return <p>No tasks assigned.</p>;

  return (
    <div className="feature-container" style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h2>Your Assigned Tasks</h2>
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      <table className="task-table">
        <thead>
          <tr>
            <th>Task Description</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.task_id}>
              <td>{task.task_description}</td>
              <td>
                <span
                  className={
                    task.status === "To-Do"
                      ? "status pending"
                      : task.status === "In Progress"
                      ? "status in-progress"
                      : "status completed"
                  }
                >
                  {task.status}
                </span>
              </td>
              <td>
                {task.status === "To-Do" && (
                  <button
                    className="btn btn-red"
                    onClick={() => updateStatus(task.task_id, "In Progress")}
                  >
                    In Progress
                  </button>
                )}
                {task.status === "In Progress" && (
                  <button
                    className="btn btn-red"
                    onClick={() => updateStatus(task.task_id, "Completed")}
                  >
                    Completed
                  </button>
                )}
                {task.status === "Completed" && (
                  <>
                    <span>✅ Done </span>
                    <button
                      className="btn btn-red"
                      onClick={() => archiveTask(task.task_id)}
                    >
                      Archive
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
