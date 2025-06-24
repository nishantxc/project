"use client";

import { createSupabaseClient } from "@/lib/supabase";
import { Member } from "@/types/apiTypes";
import { useEffect, useState, useRef } from "react";

interface ChatTabProps {
  members: Member[];
}

interface Message {
  id: string;
  username: string;
  content: string;
  created_at: string;
}

export default function ChatTab({ members }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Supabase client once
  const supabase = createSupabaseClient();

  // Fetch user and initial messages
  useEffect(() => {
    const fetchUserAndMessages = async () => {
      // Get authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        setError("You must be logged in to view or send messages");
        return;
      }

      // Fetch messages
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        setError("Failed to fetch messages");
        console.error("Error fetching messages:", error);
      } else {
        setMessages((data as Message[]) || []);
      }
    };

    fetchUserAndMessages();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("Subscribed to real-time updates");
        } else if (status === "CLOSED" || status === "ERROR") {
          setError("Failed to subscribe to real-time updates");
          console.error("Subscription failed:", status);
        }
      });

    // Cleanup subscription on unmount
    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("You must be logged in to send messages");
      return;
    }

    // Assume username is stored in user_metadata or a profiles table
    const username = user.user_metadata?.username || user.email?.split("@")[0] || "Anonymous";

    const { error } = await supabase
      .from("messages")
      .insert([{ username, content: message }]);

    if (error) {
      setError("Failed to send message");
      console.error("Error sending message:", error);
    } else {
      setMessage("");
      setError(null);
    }
  };

  return (
    <div className="h-[70vh] flex-1 p-6 bg-gray-50">
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-blue-200 text-white p-4 text-start">
          <h1 className="text-xl text-blue-950 font-light">Team Chat</h1>
        </div>
        {error && <p className="text-red-500 p-4">{error}</p>}
        <div className="flex-grow p-4 overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-2 p-2 rounded-md ${
                  msg.username === (supabase.auth.getUser().then(({ data: { user } }) => user?.user_metadata?.username || user?.email?.split("@")[0]))
                    ? "bg-blue-100 ml-auto"
                    : "bg-gray-100"
                } max-w-md`}
              >
                 <p className="font-semibold">{msg.username}</p>
                <p>{msg.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white border-t">
          <form onSubmit={sendMessage} className="flex gap-2" aria-label="Send chat message">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-md"
              aria-label="Message input"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className={`p-2 rounded-md ${
                message.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}