// components/TaskModal.tsx
import { useState, useEffect } from "react";
import { Task, TaskModalProps } from "@/types/kanban";
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

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  columnId,
  task,
}: TaskModalProps) {
  // Default values for a new task
  const defaultTask = {
    title: "",
    description: "",
    tag: "UX stages",
    tagType: "default",
    column: columnId,
    progress: "0/1",
    assignees: [],
    comments: 0,
    attachments: 0,
    subtasks: 0,
  };

  // State for form values
  const [formValues, setFormValues] = useState<Omit<Task, "id">>(
    task ? { ...task } : defaultTask
  );

  // Reset form when modal opens or task changes
  useEffect(() => {
    if (isOpen) {
      setFormValues(task ? { ...task } : { ...defaultTask, column: columnId });
    }
  }, [isOpen, task, columnId]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formValues);
    onClose();
  };

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select changes
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
                  onValueChange={(value) => handleSelectChange("tagType", value)}
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