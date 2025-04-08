import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { createSupabaseClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

type MemberModalProps = {
  onCancel: () => void;
//   onAddMember: (member: any) => void;
};

const AddMemberModal: React.FC<MemberModalProps> = ({ onCancel }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/avatars/default.png");
  const supabase = createSupabaseClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new member object
    const newMember = {
      id: uuidv4(),
      name,
      role,
      online: true,
      avatar: avatarUrl,
    };
    
    // Pass the new member to parent component
    // onAddMember(newMember);
    onCancel();
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
          
          {/* <div className="space-y-2">
            <Label htmlFor="avatar">Profile Picture</Label>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                <img 
                  src={avatarUrl} 
                  alt="Avatar preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* <Select value={avatarUrl} onValueChange={setAvatarUrl}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose avatar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="/avatars/karen.png">Karen</SelectItem>
                  <SelectItem value="/avatars/steve.png">Steve</SelectItem>
                  <SelectItem value="/avatars/sarah.png">Sarah</SelectItem>
                  <SelectItem value="/avatars/brad.png">Brad</SelectItem>
                  <SelectItem value="/avatars/alice.png">Alice</SelectItem>
                  <SelectItem value="/avatars/default.png">Default</SelectItem>
                </SelectContent>
              </Select> */}
            {/* </div> */}
          {/* </div> */}
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Add Member
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddMemberModal;