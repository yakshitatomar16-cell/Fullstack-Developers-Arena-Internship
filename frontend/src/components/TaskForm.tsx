import { useState } from "react";
import api from "../services/api";

function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    if (title.trim() === "") {
      alert("Please enter task title");
      return;
    }

    try {
      await api.post("/tasks", {
        title: title,
        description: description,
        status: "TODO",
        priority: "MEDIUM",
        dueDate: "2026-12-31",
      });

      alert("Task Added Successfully!");

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error(error);
      alert("Failed to add task.");
    }
  };

  return (
    <div>
      <h2>Add New Task</h2>

      <input
        type="text"
        placeholder="Enter Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Enter Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="button" onClick={handleSubmit}>
        Add Task
      </button>
    </div>
  );
}

export default TaskForm;