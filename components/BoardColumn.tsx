import { useState } from "react";
import { BoardColumnProps, Column, Task, User } from "@/types/kanban";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical } from "lucide-react";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import { DragOverlay, useDroppable } from "@dnd-kit/core";

export default function BoardColumn({
  column,
  tasks,
  onAddTask,
  users,
  onAddComment,
  onAssignUser,
}: BoardColumnProps & { users: User[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case "todo":
        return "bg-red-300/50 text-red-800";
      case "progress":
        return "bg-blue-300/50 text-blue-800";
      case "review":
        return "bg-yellow-300/50 text-yellow-800";
      case "done":
        return "bg-green-300/50 text-green-800";
      default:
        return "bg-red-500/50 text-gray-800";
    }
  };

  return (
    <div className="w-full flex-shrink-0 flex flex-col h-full">
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
        {/* <button className="text-gray-500 hover:text-gray-700 flex-shrink-0">
          <MoreVertical className="w-4 h-4" />
        </button> */}
      </div>

      <Button
        variant="ghost"
        className="mb-3 justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-dashed border-gray-300 bg-white text-sm"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="w-4 h-4 mr-2" />
        <span className="truncate">Add New Task</span>
      </Button>

      <div
        ref={setNodeRef}
        className={`space-y-3 overflow-y-scroll h-[5vh] flex-1 p-1 rounded-lg -z-1 ${
          isOver ? "bg-blue-50" : ""
        }`}
      >
          {tasks.map((task) => (
            <TaskCard
              onAddComment={onAddComment}
              onAssignUser={onAssignUser}
              key={task.id}
              task={task}
              users={users}
            />
          ))}

        {tasks.length === 0 && (
          <div className="text-center p-3 text-gray-400 text-sm border border-dashed rounded-lg">
            No tasks in this column
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onAddTask}
        columnId={column.id}
        users={users}
      />
    </div>
  );
}
