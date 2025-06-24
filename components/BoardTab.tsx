import { Member } from "@/types/apiTypes";
import { Column, Task } from "@/types/kanban";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useState } from "react";
import BoardColumn from "./BoardColumn";
import TaskCard from "./TaskCard";
import { api } from "@/app/api/api-collection";
import { handleApiError } from "@/app/api/errors";

interface BoardTabProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  members: Member[];
}

export default function BoardTab({ tasks, setTasks, columns, setColumns, members }: BoardTabProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    })
  );

  const tasksGroupedByColumn = columns.map((column) => {
    const columnTasks = tasks.filter(
      (task) => task.kanban_column === column.id
    );
    return {
      ...column,
      tasks: columnTasks,
    };
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id.toString();
    const targetColumnId = over.id.toString();

    const taskToMove = tasks.find((task) => task.id === taskId);

    if (!taskToMove || taskToMove.kanban_column === targetColumnId) return;

    // Optimistically update state
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          kanban_column: targetColumnId,
        };
      }
      return task;
    });

    setTasks(updatedTasks);

    const updatedColumns = columns.map((column) => {
      const taskCount = updatedTasks.filter(
        (task) => task.kanban_column === column.id
      ).length;
      return {
        ...column,
        count: taskCount,
      };
    });

    setColumns(updatedColumns);

    try {
      console.log("Submitting task:", taskId, targetColumnId);

      const response = await api.tasks.update(taskId, {
        kanban_column: targetColumnId,
      });
      console.log("Create response:", response);

      if (response.task) {
        console.log("done jii");
      }
    } catch (err) {
      console.error("Create task error:", err);
      handleApiError(err, "Failed to create task");
    }
  };

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const taskWithId: Task = {
      id: crypto.randomUUID(),
      ...newTask,
    };

    setTasks([...tasks, taskWithId]);

    const updatedColumns = columns.map((column) => {
      const taskCount =
        column.id === newTask.kanban_column
          ? tasks.filter((task) => task.kanban_column === column.id).length + 1
          : tasks.filter((task) => task.kanban_column === column.id).length;

      return {
        ...column,
        count: taskCount,
      };
    });

    setColumns(updatedColumns);
  };

  const handleAddComment = (taskId: string, comment: string) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            comments: task.comments + 1,
          };
        }
        return task;
      });

      setTasks(updatedTasks);
    }
  };

  const handleAssignUser = (taskId: string, userId: string) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (taskToUpdate) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          const assignees = task.assignees.includes(userId)
            ? task.assignees.filter((id) => id !== userId)
            : [...task.assignees, userId];

          return {
            ...task,
            assignees,
          };
        }
        return task;
      });

      setTasks(updatedTasks);
    }
  };

  return (
    <div className="relative flex-1 p-6 bg-gray-50  overflow-y-scroll">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {tasksGroupedByColumn.map((column) => (
            <BoardColumn
              key={column.id}
              column={column}
              tasks={column.tasks}
              users={members}
              onAddTask={handleAddTask}
              onAddComment={handleAddComment}
              onAssignUser={handleAssignUser}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              users={members}
              onAddComment={handleAddComment}
              onAssignUser={handleAssignUser}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}