"use client";

export const dynamic = "force-dynamic";

import AddMemberModal from "@/components/AddMemberModal";
import BoardColumn from "@/components/BoardColumn";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseClient } from "@/lib/supabase";
import { Member } from "@/types/apiTypes";
import { Column, Task, User } from "@/types/kanban";
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
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { api } from "./api/api-collection";
import { handleApiError } from "./api/errors";

export default function KanbanBoard() {
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [toggleMemberModal, setToggleMemberModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [toggleMember, setToggleMembers] = useState(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const fetchUser = async () => {
    try {
      const supabase = createSupabaseClient();
      // Get the full response first
      const { data, error } = await supabase.auth.getUser();
      console.log("Full auth response:", data);

      if (error) {
        console.error("Auth error:", error);
        window.location.href = "/login";
        // return;
      }

      if (data.user) {
        setSupabaseUser(data.user);
        fetchTasks();
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Fetch user error:", error);
      window.location.href = "/login";
    }
  };

  async function fetchMembers() {
    try {
      setLoading(true);
      const res = await api.members.getAll();
      console.log(res, "members log");
      setMembers(res.members);
    } catch (error) {
      console.log(error);
      setError(handleApiError(error, "Failed to load members"));
    }
  }

  async function fetchTasks() {
    try {
      setLoading(true);
      const response = await api.tasks.getAll();
      setTasks(response.tasks);
      setError(null);
    } catch (err) {
      setError(handleApiError(err, "Failed to load tasks"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTasks();
    fetchMembers();
    fetchUser();
  }, []);

  const [users] = useState<Member[]>([
    {
      id: "1",
      name: "Karen Smith",
      role: "Designer",
      online: true,
      avatar: "",
    },
    {
      id: "2",
      name: "Steve McConnell",
      role: "Officer",
      online: true,
      avatar: "",
    },
    {
      id: "3",
      name: "Sarah Green",
      role: "Officer",
      online: true,
      avatar: "",
    },
  ]);

  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", count: 0 },
    { id: "progress", title: "In Progress", count: 0 },
    { id: "review", title: "Need Review", count: 0 },
    { id: "done", title: "Done", count: 0 },
  ]);

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

    // 🔄 API call to update this task
    // try {
    //   const response = await fetch("/api/tasks", {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       id: taskId,
    //       kanban_column: targetColumnId,
    //     }),
    //   });

    //   if (!response.ok) {
    //     const error = await response.json();
    //     throw new Error(error.message || "Failed to update task");
    //   }

    //   const { task } = await response.json();
    //   console.log("Task updated:", task);
    // } catch (error) {
    //   console.error("Error updating task:", error);
    //   alert("Failed to update task. Please try again.");

    //   // Optional: Revert UI update if needed
    //   setTasks(tasks);
    //   setColumns(columns);
    try {
      console.log("Submitting task:", taskId, targetColumnId);

      const response = await api.tasks.update(taskId, {
        kanban_column: targetColumnId,
      });
      console.log("Create response:", response);

      if (response.task) {
        // onSave?.(response.task);
        // onClose();
        console.log("done jii");
      }
    } catch (err) {
      console.error("Create task error:", err);
      handleApiError(err, "Failed to create task");
    }
  };

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const taskWithId: Task = {
      id: uuidv4(),
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

  const handleAddMember = () => {
    setToggleMemberModal(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {/* <Sidebar users={users} /> */}
      {toggleMemberModal && (
        <AddMemberModal onCancel={() => setToggleMemberModal(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={supabaseUser} />

        {/* Project Header */}
        <div className="bg-white px-6 py-4 border-b">
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Sunfocus Solutions</h1>
              <div className="h-1 w-80 bg-blue-500 mt-2 rounded-full"></div>
              <span className="text-xs text-gray-500 mt-1">55% complete</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
                {members.slice(0, 4).map((user) => (
                  <div className="relative">
                  <Avatar
                    key={user.id}
                    className="border-2 border-white w-8 h-8"
                  >
                    {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                    <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="absolute botton-0 right-0 w-fit bg-blue-100 rounded-lg flex flex-col gap-1 p-2 items-start justify-center">
                      <p className="font-semibold text-sm text-gray-700">Name: <span className="font-light text-sm text-black">{user?.name}</span></p>
                      <p className="font-semibold text-sm text-gray-700">Role: <span className="font-light text-sm text-black">{user?.role}</span></p>
                  </div>
                  </div>
                ))}
                {members.length > 3 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-xs text-gray-500">
                    +1
                  </div>)
                }
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={() => handleAddMember()}
              >
                + Add Member
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="board" className="mt-6">
            <TabsList className="bg-transparent border-b rounded-none w-full justify-start space-x-6">
              <TabsTrigger
                disabled={true}
                value="overview"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                disabled={true}
                value="tasks"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                disabled={true}
                value="notes"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Notes
              </TabsTrigger>
              <TabsTrigger
                disabled={true}
                value="questions"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Questions
              </TabsTrigger>
              <TabsTrigger
                value="board"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Board
              </TabsTrigger>
              <TabsTrigger
                disabled={true}
                value="table"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Table
              </TabsTrigger>
              <TabsTrigger
                disabled={true}
                value="list"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                List
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Board Content */}
        <div className="flex-1 p-6 bg-gray-50">
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
      </div>
    </div>
  );
}
