// components/BoardColumn.tsx
import { useState } from "react";
import { Column, Task } from "@/types/kanban";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { useDroppable } from "@dnd-kit/core";

interface BoardColumnProps {
  column: Column & { tasks: Task[] };
  tasks: Task[];
  onAddTask: (task: Omit<Task, "id">) => void;
}

export default function BoardColumn({
  column,
  tasks,
  onAddTask,
}: BoardColumnProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set up droppable
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  // Define column header icon colors
  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "bg-red-300/50 text-red-500";
      case "progress":
        return "bg-blue-300/50 text-blue-500";
      case "review":
        return "bg-yellow-300/50 text-yellow-500";
      case "done":
        return "bg-green-300/50 text-green-500";
      default:
        return "bg-red-500/50 text-gray-500";
    }
  };

  return (
    <div className="w-full flex-shrink-0 flex flex-col h-full">
      {/* Column Header */}
      <div
        className={`flex items-center justify-between mb-3 p-2 rounded-lg ${getColumnColor(
          column.id
        )}`}
      >
        <div className="flex items-center space-x-2 overflow-hidden">
          <span
            className={`font-bold px-2 bg-white/50 rounded-full ${getColumnColor(
              column.id
            )}`}
          >
            {column.count}
          </span>
          <h3 className="font-medium truncate">{column.title}</h3>
        </div>
        <button className="text-gray-500 hover:text-gray-700 flex-shrink-0">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Add Task Button */}
      <Button
        variant="ghost"
        className="mb-3 justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-gray-300 bg-white text-sm"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        <span className="truncate">Add New Task</span>
      </Button>

      {/* Tasks - Droppable area */}
      <div
        ref={setNodeRef}
        className={`space-y-3 overflow-y-auto flex-1 p-1 rounded-lg ${
          isOver ? "bg-blue-50" : ""
        }`}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}

        {/* Empty state for when there are no tasks */}
        {tasks.length === 0 && (
          <div className="text-center p-3 text-gray-400 text-sm border border-dashed rounded-lg">
            No tasks in this column
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddTask}
        columnId={column.id}
      />
    </div>
  );
}
