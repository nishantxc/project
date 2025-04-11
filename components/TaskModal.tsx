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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the default Quill stylesheet

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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (value: string) => {
    setFormValues((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Quill modules configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["link"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  // Quill formats configuration
  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "link",
    "list",
    "bullet",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full">
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

            <div className="grid gap-2 ">
              <Label htmlFor="description">Description</Label>
              <ReactQuill
                value={formValues.description}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Task description"
                className="min-h-24"
                theme="snow"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 z-10 mt-16 sm:mt-12">
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