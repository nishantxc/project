"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensors,
  useSensor,
  closestCorners,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Task, Column } from "@/types/kanban";
import Sidebar from "@/components/Sidebar";
import BoardColumn from "@/components/BoardColumn";
import Header from "@/components/Header";
import { v4 as uuidv4 } from "uuid";
import { createSupabaseClient } from "@/lib/supabase";
import AddMemberModal from "@/components/AddMemberModal";
import TaskCard from "@/components/TaskCard";

export default function KanbanBoard() {
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [toggleMemberModal, setToggleMemberModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const fetchTasks = async () => {
    console.log("Fetching tasks...");
    try {
      const response = await fetch("/api/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch tasks");
      }

      const data = await response.json();
      console.log("Tasks data:", data);

      if (data.tasks) {
        setTasks(data.tasks);
      } else {
        console.error("No tasks found in response:", data);
        setTasks([]);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // alert("Failed to fetch tasks. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const [users] = useState<User[]>([
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
    { id: "todo", title: "To Do", count: 3 },
    { id: "progress", title: "In Progress", count: 2 },
    { id: "review", title: "Need Review", count: 1 },
    { id: "done", title: "Done", count: 2 },
  ]);

  // const [tasks, setTasks] = useState<Task[]>([
  //   {
  //     id: "1",
  //     title: "Wireframing",
  //     description:
  //       "Create a detailed wireframe that outlines the basic structure and layout of the product or service.",
  //     tag: "UX stages",
  //     tagType: "default",
  //     column: "todo",
  //     progress: "0/8",
  //     assignees: ["1", "2", "4"],
  //     comments: 2,
  //     attachments: 0,
  //     subtasks: 0,
  //   },
  //   {
  //     id: "2",
  //     title: "First design concept",
  //     description:
  //       "Create a concept based on the research and wireframes, exploring different visionary ideas of the project.",
  //     tag: "Design",
  //     tagType: "purple",
  //     column: "todo",
  //     progress: "0/4",
  //     assignees: ["1", "2", "3"],
  //     comments: 1,
  //     attachments: 0,
  //     subtasks: 3,
  //   },
  //   {
  //     id: "3",
  //     title: "Design library",
  //     description:
  //       "Create a collection of reusable design elements, such as buttons, forms, and navigation menus.",
  //     tag: "Design",
  //     tagType: "purple",
  //     column: "todo",
  //     progress: "1/9",
  //     assignees: [],
  //     comments: 0,
  //     attachments: 0,
  //     subtasks: 0,
  //   },
  //   {
  //     id: "4",
  //     title: "Customer Journey Mapping",
  //     description:
  //       "Identify key touchpoints between users and the customer journey, and to develop strategies to improve the overall customer.",
  //     tag: "UX stages",
  //     tagType: "default",
  //     column: "progress",
  //     progress: "3/10",
  //     assignees: ["1", "2", "4"],
  //     comments: 5,
  //     attachments: 1,
  //     subtasks: 7,
  //   },
  //   {
  //     id: "5",
  //     title: "Persona development",
  //     description:
  //       "Create detailed personas based on the research data to represent different user types, their characteristics, goals, and behaviors.",
  //     tag: "UX stage",
  //     tagType: "default",
  //     column: "progress",
  //     progress: "1/3",
  //     assignees: ["1", "2"],
  //     comments: 7,
  //     attachments: 4,
  //     subtasks: 3,
  //   },
  //   {
  //     id: "6",
  //     title: "Competitor research",
  //     description:
  //       "Identify the key competitors, analyze their good and bad points each of them. Comparing their product features, quality.",
  //     tag: "UX stages",
  //     tagType: "default",
  //     column: "review",
  //     progress: "7/7",
  //     assignees: ["1", "2", "3", "4"],
  //     comments: 4,
  //     attachments: 3,
  //     subtasks: 5,
  //   },
  //   {
  //     id: "7",
  //     title: "Branding: visual identity",
  //     description:
  //       "Create a comprehensive brand identity with logo, typography, color palette, and brand guidelines.",
  //     tag: "Branding",
  //     tagType: "red",
  //     column: "done",
  //     progress: "3/3",
  //     assignees: ["1", "2", "4"],
  //     comments: 3,
  //     attachments: 6,
  //     subtasks: 8,
  //   },
  //   {
  //     id: "8",
  //     title: "Marketing materials",
  //     description:
  //       "Create branded materials such as business cards, letterhead, brochures, product graphics.",
  //     tag: "Branding",
  //     tagType: "red",
  //     column: "done",
  //     progress: "5/5",
  //     assignees: ["1", "2"],
  //     comments: 7,
  //     attachments: 7,
  //     subtasks: 8,
  //   },
  // ]);

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
    // }
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

  //  const onAddMember = () => {
  //   users.push
  //  }

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
                {users.slice(0, 4).map((user) => (
                  <Avatar
                    key={user.id}
                    className="border-2 border-white w-8 h-8"
                  >
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-xs text-gray-500">
                  +1
                </div>
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
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
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
                  users={users}
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
                  users={users}
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
