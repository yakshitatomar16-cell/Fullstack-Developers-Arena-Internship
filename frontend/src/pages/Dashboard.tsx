import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function Dashboard() {
  return (
    <div className="container">
      <h1>Task Management System</h1>

      <TaskForm />

      <hr />

      <TaskList />
    </div>
  );
}

export default Dashboard;