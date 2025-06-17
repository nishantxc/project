import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { createSupabaseClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { api } from "@/app/api/api-collection";

type MemberModalProps = {
  onCancel: () => void;
};

const AddMemberModal: React.FC<MemberModalProps> = ({ onCancel }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Create new member object
    const newMember = {
      name: name,
      role: role,
    };

    console.log("Submitting member:", newMember);

    try {
      // Use the API collection instead of direct fetch
      const response = await api.members.create(newMember);
      console.log("Member added successfully:", response);
      onCancel();
    } catch (error) {
      console.error("Error adding member:", error);
      setError("Failed to add member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-lg w-[90vw] max-w-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Add New Team Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter team member's name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={setRole} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Designer">Designer</SelectItem>
                <SelectItem value="Developer">Developer</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Officer">Officer</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-2 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddMemberModal;