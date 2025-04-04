// components/TaskCard.tsx
import { useState } from "react";
import { Task } from "@/types/kanban";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  MoreVertical,
  MessageSquare,
  Paperclip,
  CheckSquare,
} from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import TaskDrawer from "./TaskDrawer";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartTime, setDragStartTime] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Set up draggable with custom drag start/end handlers
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  // Custom drag handlers to track dragging state
  const handleDragStart = () => {
    setIsDragging(true);
    setDragStartTime(Date.now());
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Handle card click to open drawer, but only if not dragging
  const handleCardClick = (e: React.MouseEvent) => {
    // If it was a short drag (effectively a click), open the drawer
    const dragDuration = Date.now() - dragStartTime;
    if (!isDragging || dragDuration < 200) {
      setIsDrawerOpen(true);
      e.stopPropagation();
    }
  };

  // Apply transform styles
  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.8 : 1,
  };

  // Get tag style based on tagType
  const getTagStyle = (tagType: string) => {
    switch (tagType) {
      case "purple":
        return "bg-purple-100 text-purple-800";
      case "red":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  // Combine drag listeners with our custom handlers
  const combinedListeners = {
    ...listeners,
    onDragStart: (e: any) => {
      handleDragStart();
      if (listeners?.onDragStart) listeners?.onDragStart(e);
    },
    onDragEnd: (e: any) => {
      handleDragEnd();
      if (listeners?.onDragEnd) listeners?.onDragEnd(e);
    },
  };

  return (
    <>
      <div 
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        {...combinedListeners}
        onClick={handleCardClick}
      >
        <Card
          className={`bg-white border ${
            isDragging ? "shadow-md" : "shadow-sm"
          } cursor-grab`}
        >
          <CardHeader className="p-3 pb-0 flex flex-row items-center justify-between">
            <div
              className={`text-xs px-2 py-1 rounded-md ${getTagStyle(
                task.tagType
              )}`}
            >
              {task.tag}
            </div>
            <button 
              className="text-gray-400 hover:text-gray-600"
              onClick={(e) => {
                e.stopPropagation();
                // Add menu handling here if needed
              }}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <h4 className="font-medium mb-1">{task.title}</h4>
            <p className="text-gray-500 text-sm line-clamp-2">
              {task.description}
            </p>

            {task.progress && (
              <div className="mt-2 flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-xs text-gray-500">{task.progress}</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-3 pt-0 flex items-center justify-between">
            <div className="flex -space-x-2">
              {task.assignees.map((assigneeId, i) => (
                <Avatar
                  key={assigneeId}
                  className="border-2 border-white w-6 h-6"
                >
                  <AvatarFallback>{assigneeId.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>

            <div className="flex items-center space-x-2 text-gray-400">
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-3 h-3" />
                <span className="text-xs">{task.comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Paperclip className="w-3 h-3" />
                <span className="text-xs">{task.attachments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckSquare className="w-3 h-3" />
                <span className="text-xs">{task.subtasks}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Task Drawer */}
      <TaskDrawer
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)}
        task={task}
      />
    </>
  );
}