// components/Header.tsx
import { Search, Settings, Bell, LogOut, ShoppingBag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

type HeaderProps = {
  user: any | null;
};

export default function Header({ user }: HeaderProps) {
  const [toggleSignoutModal, setToggleSignoutModal] = useState(false);

  const handleSettings = () => {
    setToggleSignoutModal(true);
  };

  const handleCancel = () => {
    setToggleSignoutModal(false);
  };

  const handleShoppingBag = () => {
    console.log('Shopping Bag');
  };

  return (
    <div className="relative h-16 border-b bg-white flex items-center justify-between p-6">
      {toggleSignoutModal && <LogoutModal onCancel={handleCancel} />}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          className="pl-10 pr-4 py-2 rounded-md bg-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={() => handleSettings()}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
        >
          <LogOut className="w-4 h-4" />
        </button>
        <div className="relative">
          <button onClick={handleShoppingBag} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
            <ShoppingBag className="w-4 h-4" />
          </button>
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
        </div>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src="/avatars/alison.png" alt="User Avatar" />
            <AvatarFallback>{user?.email?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          {/* <span className="text-sm font-medium md:hidden">Alison Hopper</span> */}
        </div>
      </div>
    </div>
  );
}
