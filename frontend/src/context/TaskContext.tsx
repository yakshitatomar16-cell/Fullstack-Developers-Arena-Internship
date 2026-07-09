import { createContext, useState, type ReactNode } from "react";
import type { Task } from "../types/task";

interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  setTasks: () => {},
});

interface Props {
  children: ReactNode;
}

export function TaskProvider({ children }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
}