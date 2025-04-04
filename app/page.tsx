"use client";

import { useState } from "react";
import { DndContext, DragEndEvent, PointerSensor,useSensors, useSensor, closestCorners } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Task, Column } from "@/types/kanban";
import Sidebar from "@/components/Sidebar";
import BoardColumn from "@/components/BoardColumn";
import Header from "@/components/Header";
import { v4 as uuidv4 } from "uuid";

export default function KanbanBoard() {
  // Sample data - in a real app, you'd fetch this from an API
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "Karen Smith",
      role: "Designer",
      online: true,
      avatar: "/avatars/karen.png",
    },
    {
      id: "2",
      name: "Steve McConnell",
      role: "Officer",
      online: true,
      avatar: "/avatars/steve.png",
    },
    {
      id: "3",
      name: "Sarah Green",
      role: "Officer",
      online: true,
      avatar: "/avatars/sarah.png",
    },
    {
      id: "4",
      name: "Brad Smith",
      role: "Officer",
      online: true,
      avatar: "/avatars/brad.png",
    },
    {
      id: "5",
      name: "Alice Connell",
      role: "Online",
      online: true,
      avatar: "/avatars/alice.png",
    },
  ]);

  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", count: 3 },
    { id: "progress", title: "In Progress", count: 2 },
    { id: "review", title: "Need Review", count: 1 },
    { id: "done", title: "Done", count: 2 },
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Wireframing",
      description:
        "Create a detailed wireframe that outlines the basic structure and layout of the product or service.",
      tag: "UX stages",
      tagType: "default",
      column: "todo",
      progress: "0/8",
      assignees: ["1", "2", "4"],
      comments: 2,
      attachments: 0,
      subtasks: 0,
    },
    {
      id: "2",
      title: "First design concept",
      description:
        "Create a concept based on the research and wireframes, exploring different visionary ideas of the project.",
      tag: "Design",
      tagType: "purple",
      column: "todo",
      progress: "0/4",
      assignees: ["1", "2", "3"],
      comments: 1,
      attachments: 0,
      subtasks: 3,
    },
    {
      id: "3",
      title: "Design library",
      description:
        "Create a collection of reusable design elements, such as buttons, forms, and navigation menus.",
      tag: "Design",
      tagType: "purple",
      column: "todo",
      progress: "1/9",
      assignees: [],
      comments: 0,
      attachments: 0,
      subtasks: 0,
    },
    {
      id: "4",
      title: "Customer Journey Mapping",
      description:
        "Identify key touchpoints between users and the customer journey, and to develop strategies to improve the overall customer.",
      tag: "UX stages",
      tagType: "default",
      column: "progress",
      progress: "3/10",
      assignees: ["1", "2", "4"],
      comments: 5,
      attachments: 1,
      subtasks: 7,
    },
    {
      id: "5",
      title: "Persona development",
      description:
        "Create detailed personas based on the research data to represent different user types, their characteristics, goals, and behaviors.",
      tag: "UX stage",
      tagType: "default",
      column: "progress",
      progress: "1/3",
      assignees: ["1", "2"],
      comments: 7,
      attachments: 4,
      subtasks: 3,
    },
    {
      id: "6",
      title: "Competitor research",
      description:
        "Identify the key competitors, analyze their good and bad points each of them. Comparing their product features, quality.",
      tag: "UX stages",
      tagType: "default",
      column: "review",
      progress: "7/7",
      assignees: ["1", "2", "3", "4"],
      comments: 4,
      attachments: 3,
      subtasks: 5,
    },
    {
      id: "7",
      title: "Branding: visual identity",
      description:
        "Create a comprehensive brand identity with logo, typography, color palette, and brand guidelines.",
      tag: "Branding",
      tagType: "red",
      column: "done",
      progress: "3/3",
      assignees: ["1", "2", "4"],
      comments: 3,
      attachments: 6,
      subtasks: 8,
    },
    {
      id: "8",
      title: "Marketing materials",
      description:
        "Create branded materials such as business cards, letterhead, brochures, product graphics.",
      tag: "Branding",
      tagType: "red",
      column: "done",
      progress: "5/5",
      assignees: ["1", "2"],
      comments: 7,
      attachments: 7,
      subtasks: 8,
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // This configuration helps distinguish between clicks and drags
      activationConstraint: {
        distance: 10, // Minimum distance before a drag starts (in px)
      },
    })
  );

  // Group tasks by column
  const tasksGroupedByColumn = columns.map((column) => {
    const columnTasks = tasks.filter((task) => task.column === column.id);
    return {
      ...column,
      tasks: columnTasks,
    };
  });

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Get the dragged task id and the target column id
    const taskId = active.id.toString();
    const targetColumnId = over.id.toString();

    // Find the task being dragged
    const taskToMove = tasks.find((task) => task.id === taskId);

    if (!taskToMove || taskToMove.column === targetColumnId) return;

    // Create a new tasks array with the updated column
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          column: targetColumnId,
        };
      }
      return task;
    });

    // Update the tasks state
    setTasks(updatedTasks);

    // Update column counts based on the updated tasks
    const updatedColumns = columns.map((column) => {
      const taskCount = updatedTasks.filter(
        (task) => task.column === column.id
      ).length;
      return {
        ...column,
        count: taskCount,
      };
    });

    setColumns(updatedColumns);
  };

  // Add a function to handle adding new tasks
  const handleAddTask = (newTask: Omit<Task, "id">) => {
    // Generate a unique ID for the new task
    const taskWithId: Task = {
      id: uuidv4(),
      ...newTask,
    };

    // Add the new task to the tasks state
    setTasks([...tasks, taskWithId]);

    // Update column counts
    const updatedColumns = columns.map((column) => {
      const taskCount =
        column.id === newTask.column
          ? tasks.filter((task) => task.column === column.id).length + 1
          : tasks.filter((task) => task.column === column.id).length;

      return {
        ...column,
        count: taskCount,
      };
    });

    setColumns(updatedColumns);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      {/* <Sidebar users={users} /> */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Project Header */}
        <div className="bg-white px-6 py-4 border-b">
          <div className="w-full flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Sunfocus Solutions</h1>
              <div className="h-1 w-32 bg-blue-500 mt-2 rounded-full"></div>
              <span className="text-xs text-gray-500 mt-1">13% complete</span>
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
                  +3
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                + Add Member
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="board" className="mt-6">
            <TabsList className="bg-transparent border-b w-full justify-start space-x-6">
              <TabsTrigger
                value="overview"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="tasks"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Tasks
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Notes
              </TabsTrigger>
              <TabsTrigger
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
                value="table"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Table
              </TabsTrigger>
              <TabsTrigger
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
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
              {tasksGroupedByColumn.map((column) => (
                <BoardColumn
                  key={column.id}
                  column={column}
                  tasks={column.tasks}
                  onAddTask={handleAddTask}
                />
              ))}
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
