import React, { useState } from "react";
import { Button } from "./ui/button";
import { createSupabaseClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

type LogoutModalProps = {
  onCancel: () => void;
};

const LogoutModal: React.FC<LogoutModalProps> = ({ onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createSupabaseClient();

  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut().then(() => router.push("/login"));
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
    // window.location.reload(); // optional: force logout UX
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-lg w-[90vw] max-w-md p-6 space-y-6"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Log out of your account?
        </h2>
        <p className="text-sm text-gray-500">
          This will end your session. You can log back in at any time.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            {/* Logout */}
            {
              isLoading ? "Logging Out..." : "Logout"
            }
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutModal;
