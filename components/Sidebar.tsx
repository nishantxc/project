// components/Sidebar.tsx
import { User } from '@/types/kanban';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  LayoutGrid, 
  BarChart2, 
  Clock, 
  Folder, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings, 
  PlusCircle 
} from 'lucide-react';

interface SidebarProps {
  users: User[];
}

export default function Sidebar({ users }: SidebarProps) {
  return (
    <div className="w-64 border-r bg-white flex flex-col">
      {/* App Logo */}
      <div className="p-4 flex items-center space-x-2 border-b">
        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
          <span className="text-white font-bold">M</span>
        </div>
        <h2 className="font-semibold text-lg">Projects</h2>
      </div>

      {/* Projects List */}
      <div className="p-4 border-b overflow-auto">
        <div className="bg-blue-100 text-blue-800 rounded-md p-2 flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center mr-2">
              <span className="text-white text-xs">P</span>
            </div>
            <span className="font-medium text-sm">Piper Enterprise</span>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
              <circle cx="8" cy="4" r="1" />
              <circle cx="8" cy="8" r="1" />
              <circle cx="8" cy="12" r="1" />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-cyan-100 rounded-md flex items-center justify-center mr-2">
                <span className="text-cyan-500 text-xs">W</span>
              </div>
              <span className="text-sm">Web platform</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <circle cx="8" cy="4" r="1" />
                <circle cx="8" cy="8" r="1" />
                <circle cx="8" cy="12" r="1" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                <span className="text-gray-500 text-xs">M</span>
              </div>
              <span className="text-sm">Mobile Loop</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <circle cx="8" cy="4" r="1" />
                <circle cx="8" cy="8" r="1" />
                <circle cx="8" cy="12" r="1" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center mr-2">
                <span className="text-purple-500 text-xs">W</span>
              </div>
              <span className="text-sm">Wino Mobile App</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <circle cx="8" cy="4" r="1" />
                <circle cx="8" cy="8" r="1" />
                <circle cx="8" cy="12" r="1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="p-4 border-b">
        <h3 className="font-medium text-sm mb-3">Team members</h3>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="w-6 h-6 mr-2">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-sm font-medium">{user.name}</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className={`w-2 h-2 rounded-full ${user.online ? 'bg-green-500' : 'bg-gray-300'} mr-1`}></span>
                    <span>{user.role}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Time Section */}
      <div className="p-4 border-b">
        <h3 className="font-medium text-sm mb-3">Time</h3>
        <div>
          <div className="text-2xl font-semibold">23.7 hours</div>
          <div className="flex items-center text-xs text-green-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span>2.5% from last week</span>
          </div>
        </div>
      </div>

      {/* Add Project Button */}
      <div className="p-4 mt-auto">
        <Button variant="outline" className="w-full border-dashed border-blue-500 text-blue-500">
          <PlusCircle className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>
    </div>
  );
}