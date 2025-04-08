import { useState, useEffect } from "react";
import { Task, TaskModalProps, User } from "@/types/kanban";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ScrollArea } from "./ui/scroll-area";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const users = [
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
];


export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  columnId,
  task,
  users,
}: TaskModalProps & { users: User[] }) {
  const defaultTask = {
    title: "",
    description: "",
    tag: "UX stages",
    tagType: "default",
    kanban_column: columnId,
    progress: "0/1",
    assignees: [],
    comments: 0,
    attachments: 0,
    subtasks: 0,
  };

  const [formValues, setFormValues] = useState<Omit<Task, "id">>({
    ...(task || defaultTask),
    assignees: task?.assignees || [],
    kanban_column: task?.kanban_column || columnId,
  });

  useEffect(() => {
    if (isOpen) {
      setFormValues({
        ...(task || defaultTask),
        assignees: task?.assignees || [],
        kanban_column: task?.kanban_column || columnId,
      });
    }
  }, [isOpen, task, columnId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("clicked");
    
    
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });
      
      console.log("clicked and got response");
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create task");
      }

      const { task } = await response.json();
      onSave(task);
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Failed to create task. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleChange}
                placeholder="Task title"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleChange}
                placeholder="Task description"
                className="min-h-24"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="tag">Tag</Label>
                <Select
                  value={formValues.tag}
                  onValueChange={(value) => handleSelectChange("tag", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UX stages">UX stages</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Branding">Branding</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tagType">Tag Style</Label>
                <Select
                  value={formValues.tagType}
                  onValueChange={(value) =>
                    handleSelectChange("tagType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="purple">Purple</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progress">Progress</Label>
              <Input
                id="progress"
                name="progress"
                value={formValues.progress}
                onChange={handleChange}
                placeholder="0/1"
                pattern="\d+\/\d+"
                title="Format: completed/total (e.g., 0/5)"
              />
              <p className="text-xs text-gray-500">
                Format: completed/total (e.g., 0/5)
              </p>
            </div>

            <div className="grid gap-2 mt-4">
              <Label htmlFor="assignees">Assign Task</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {(formValues.assignees?.length || 0) > 0
                      ? `${formValues.assignees?.length} user${
                          (formValues.assignees?.length || 0) > 1 ? "s" : ""
                        } selected`
                      : "Select users"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandEmpty>No users found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {users.map((user) => (
                        <CommandItem
                          key={user.id}
                          value={user.name}
                          onSelect={() => {
                            setFormValues((prev) => {
                              const currentAssignees = prev.assignees || [];
                              const newAssignees = currentAssignees.includes(
                                user.id
                              )
                                ? currentAssignees.filter(
                                    (id) => id !== user.id
                                  )
                                : [...currentAssignees, user.id];

                              return {
                                ...prev,
                                assignees: newAssignees,
                              };
                            });
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span>{user.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {user.role}
                              </span>
                            </div>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              (formValues.assignees || []).includes(user.id)
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

              {(formValues.assignees?.length || 0) > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {(formValues.assignees || []).map((userId) => {
                    const user = users.find((u) => u.id === userId);
                    return (
                      <div
                        key={userId}
                        className="flex items-center bg-gray-100 rounded-full px-2 py-1 text-xs"
                      >
                        <Avatar className="h-4 w-4 mr-1">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>
                            {user?.name?.charAt(0) || userId.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user?.name || `User ${userId}`}</span>
                        <button
                          type="button"
                          className="ml-1 text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setFormValues((prev) => ({
                              ...prev,
                              assignees: (prev.assignees || []).filter(
                                (id) => id !== userId
                              ),
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button type="submit">Save Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
