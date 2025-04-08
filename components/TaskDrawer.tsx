
import { useState } from "react";
import { Task, User } from "@/types/kanban";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Paperclip,
  CheckSquare,
  Clock,
  Calendar,
  Tag,
  Edit,
  CheckCircle,
  X,
  Plus,
  Check,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface TaskDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  users: User[];
  onAddComment: (taskId: string, comment: string) => void;
  onAssignUser: (taskId: string, userId: string) => void;
}

export default function TaskDrawer({
  isOpen,
  onClose,
  task,
  users,
  onAddComment,
  onAssignUser,
}: TaskDrawerProps & { users: User[] }) {
  const [activeTab, setActiveTab] = useState("details");
  const [commentText, setCommentText] = useState("");

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

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      onAddComment(task.id, commentText);
      setCommentText("");
    }
  };

  const handleAssignUser = (taskId: string, userId: string) => {
    onAssignUser(taskId, userId);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <div className="flex justify-between items-center">
            <div
              className={`text-xs px-2 py-1 rounded-md ${getTagStyle(
                task.tagType
              )}`}
            >
              {task.tag}
            </div>
          </div>
          <SheetTitle className="text-xl font-bold mt-2">
            {task.title}
          </SheetTitle>
          <SheetDescription className="text-sm text-gray-600 mt-1">
            {task.description}
          </SheetDescription>
        </SheetHeader>

        <Tabs
          defaultValue="details"
          className="mt-4"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">
              Comments ({task.comments})
            </TabsTrigger>
            <TabsTrigger value="subtasks">
              Subtasks ({task.subtasks})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Progress</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${
                      (parseInt(task.progress.split("/")[0]) /
                        parseInt(task.progress.split("/")[1])) *
                      100
                    }%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500">{task.progress}</div>
            </div>

            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 flex justify-between">
                <span>Assignees</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <Plus className="h-3 w-3 mr-1" />
                      <span className="text-xs">Add</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 p-0" align="end">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.name}
                            onSelect={() => handleAssignUser(task.id, user.id)}
                          >
                            <div className="flex items-center gap-2 mr-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{user.name}</span>
                            </div>
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                task.assignees.includes(user.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.assignees.length > 0 ? (
                  task.assignees.map((assigneeId) => {
                    const user = getUserById(assigneeId);
                    return (
                      <div
                        key={assigneeId}
                        className="flex items-center bg-gray-100 rounded-full px-2 py-1"
                      >
                        <Avatar className="h-5 w-5 mr-1">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>
                            {user?.name.charAt(0) || assigneeId.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">
                          {user?.name || `User ${assigneeId}`}
                        </span>
                        <button
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          onClick={() => handleAssignUser(task.id, assigneeId)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-gray-500">No assignees yet</div>
                )}
              </div>
            </div>

            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Timeline</div>
              <div className="flex items-center text-xs text-gray-600">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Created on Apr 3, 2025</span>
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <Clock className="h-3 w-3 mr-1" />
                <span>Due on Apr 10, 2025</span>
              </div>
            </div>

            
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 flex justify-between">
                <span>Attachments ({task.attachments})</span>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <Plus className="h-3 w-3 mr-1" />
                  <span className="text-xs">Add</span>
                </Button>
              </div>
              {task.attachments > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <div className="flex items-center">
                      <Paperclip className="h-3 w-3 mr-2 text-gray-500" />
                      <span className="text-xs">document.pdf</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <span className="text-xs">View</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500">No attachments yet</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="comments" className="mt-4 space-y-4">
            
            {task.comments > 0 ? (
              <div className="space-y-4">
                {[...Array(task.comments)].map((_, i) => {
                  const assigneeId = task.assignees[i % task.assignees.length];
                  const user = assigneeId ? getUserById(assigneeId) : null;

                  return (
                    <div key={i} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={user?.avatar} />
                          <AvatarFallback>
                            {user?.name.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-medium">
                            {user?.name || `User ${assigneeId || "Unknown"}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            Apr {i + 1}, 2025
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">
                        Sample comment {i + 1} about the task "{task.title}".
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No comments yet</div>
            )}

            
            <div className="mt-4 space-y-2">
              <Textarea
                placeholder="Add a comment..."
                className="min-h-24"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  Post Comment
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="subtasks" className="mt-4 space-y-4">
            
            {task.subtasks > 0 ? (
              <div className="space-y-2">
                {[...Array(task.subtasks)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center">
                      <CheckSquare
                        className={`h-4 w-4 mr-2 ${
                          i < 2 ? "text-green-500" : "text-gray-300"
                        }`}
                      />
                      <span className="text-sm">Subtask {i + 1}</span>
                    </div>
                    <div className="flex items-center">
                      <Avatar className="h-5 w-5 mr-1">
                        <AvatarFallback>
                          {task.assignees[i % task.assignees.length]?.charAt(
                            0
                          ) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No subtasks yet</div>
            )}

            
            <Button variant="outline" size="sm" className="w-full">
              <Plus className="h-3 w-3 mr-1" />
              <span>Add Subtask</span>
            </Button>
          </TabsContent>
        </Tabs>

        <SheetFooter className="mt-6 flex gap-2">
          <Button disabled={true} variant="outline" className="flex-1">
            <Edit className="h-4 w-4 mr-2" />
            Edit Task
          </Button>
          <Button className="flex-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark Complete
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
