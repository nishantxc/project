"use client";
 
export const dynamic = "force-dynamic";

import AddMemberModal from "@/components/AddMemberModal";
import BoardTab from "@/components/BoardTab";
import ChatTab from "@/components/ChatTab";
import Header from "@/components/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createSupabaseClient } from "@/lib/supabase";
import { Member } from "@/types/apiTypes";
import { Column, Task } from "@/types/kanban";
import { useEffect, useState } from "react";
import { api } from "./api/api-collection";
import { handleApiError } from "./api/errors";

export default function KanbanBoard() {
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [toggleMemberModal, setToggleMemberModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [toggleMember, setToggleMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const supabase = createSupabaseClient();
      // Get the full response first
      const { data, error } = await supabase.auth.getUser();
      console.log("Full auth response:", data);

      if (error) {
        console.error("Auth error:", error);
        window.location.href = "/login";
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

  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", count: 0 },
    { id: "progress", title: "In Progress", count: 0 },
    { id: "review", title: "Need Review", count: 0 },
    { id: "done", title: "Done", count: 0 },
  ]);

  const handleAddMember = () => {
    setToggleMemberModal(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
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
                  <div className="relative" key={user.id}>
                    <Avatar
                      className="border-2 border-white w-8 h-8"
                      onMouseEnter={() => setToggleMembers(true)}
                      onMouseLeave={() => setToggleMembers(false)}
                    >
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {toggleMember && (
                      <div className="absolute botton-0 right-0 w-fit bg-blue-100 rounded-lg flex flex-col gap-1 p-2 items-start justify-center">
                        <p className="font-semibold text-sm text-gray-700">Name: <span className="font-light text-sm text-black">{user?.name}</span></p>
                        <p className="font-semibold text-sm text-gray-700">Role: <span className="font-light text-sm text-black">{user?.role}</span></p>
                      </div>
                    )}
                  </div>
                ))}
                {members.length > 3 && (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 border-2 border-white text-xs text-gray-500">
                    +1
                  </div>
                )}
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
          <Tabs defaultValue="board" className="mt-6 overflow-scroll">
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
                value="table"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                Chat
              </TabsTrigger>
              <TabsTrigger
                disabled={true}
                value="list"
                className="pb-2 px-1 text-sm data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
              >
                List
              </TabsTrigger>
            </TabsList>
            
            {/* Tab Content */}
            <TabsContent value="board">
              <BoardTab 
                tasks={tasks} 
                setTasks={setTasks} 
                columns={columns} 
                setColumns={setColumns} 
                members={members} 
              />
            </TabsContent>
            
            <TabsContent value="table">
              <ChatTab members={members} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
