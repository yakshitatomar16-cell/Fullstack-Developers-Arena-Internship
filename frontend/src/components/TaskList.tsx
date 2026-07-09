import { useEffect, useState } from "react";
import api from "../services/api";

interface Task {
  id: number;
  title: string;
  description: string;
}

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <h2>Task List</h2>

      {tasks.length === 0 ? (
        <p>No Tasks Available</p>
      ) : (
        tasks.map((task) => (
          <div className="task-card" key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default TaskList;