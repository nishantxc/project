"use client";

import { createSupabaseClient } from "@/lib/supabase";
import { Member } from "@/types/apiTypes";
import { CameraIcon, X } from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface ChatTabProps {
  members: Member[];
}

interface Message {
  id: string;
  username: string;
  content: string;
  created_at: string;
  image_url?: string; 
}

export default function ChatTab({ members }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
        setCurrentUsername(null);
        return;
      }

      // Set current username from user_metadata or email
      const username = user.user_metadata?.username || user.email?.split("@")[0] || "Anonymous";
      setCurrentUsername(username);

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

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("Please select a valid image file");
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      
      setImage(file);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setError(null);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
       };

  // Handle sending a message
  const sendMessage = async (e: React.FormEvent) => {           
    e.preventDefault();
    if (!message.trim() && !image) return;

    if (!currentUsername) {
      setError("You must be logged in to send messages");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      let imageUrl = null;
      if (image) {
        // Create a unique filename
        const fileExt = image.name.split('.').pop();
        const fileName = `${currentUsername}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from("chat-images")
          .upload(filePath, image, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error("Image upload error:", uploadError);
          setError(`Failed to upload image: ${uploadError.message}`);
          setIsUploading(false);
          return;
        }

        // Get the public URL for the uploaded image
        const { data: publicUrlData } = supabase.storage
          .from("chat-images")
          .getPublicUrl(data.path);

        imageUrl = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("messages")
        .insert([{ 
          username: currentUsername, 
          content: message.trim(), 
          image_url: imageUrl 
        }]);

      if (insertError) {
        console.error("Error sending message:", insertError);
        setError(`Failed to send message: ${insertError.message}`);
      } else {
        setMessage("");
        removeImage();
        setError(null);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsUploading(false);
    }
  };

  // Format timestamp to match image style
  const formatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="h-[70vh] flex-1 p-6 bg-gray-50">
      <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="border-b border-blue-200 text-white p-4 text-start">
          <h1 className="text-xl text-blue-950 font-light">Team Chat</h1>
        </div>
        {/* {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 m-4 rounded-md">
            <p>{error}</p>
          </div>
        )} */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start ${
                  msg.username === currentUsername
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {msg.username !== currentUsername && (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username)}`}
                    alt={`${msg.username}'s avatar`}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}
                <div
                  className={`p-2 rounded-md max-w-md ${
                    msg.username === currentUsername
                      ? "bg-blue-100 text-right"
                      : "bg-gray-100"
                  }`}
                >
                  <p className="font-semibold text-sm">{msg.username}</p>
                  {msg.content && <p className="text-sm">{msg.content}</p>}
                  {msg.image_url && (
                    <img
                      src={msg.image_url}
                      alt="Message attachment"
                      className="mt-2 max-w-full h-auto rounded-md cursor-pointer hover:opacity-90"
                      onClick={() => window.open(msg.image_url, '_blank')}
                    />
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(msg.created_at)}
                  </p>
                </div>
                {msg.username === currentUsername && (
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(msg.username)}`}
                    alt={`${msg.username}'s avatar`}
                    className="w-8 h-8 rounded-full ml-2"
                  />
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Image Preview Section */}
        {imagePreview && (
          <div className="p-4 bg-gray-50 border-t">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-32 max-h-32 rounded-md border"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
        
        <div className="p-4 bg-white border-t flex items-center gap-2">
          <form onSubmit={sendMessage} className="flex-1 flex items-center gap-2" aria-label="Send chat message">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Message input"
              disabled={isUploading}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
              disabled={isUploading}
            />
            <label 
              htmlFor="imageUpload" 
              className={`cursor-pointer ${
                isUploading 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-blue-500 hover:text-blue-600"
              }`}
            >
              <CameraIcon />
            </label>
            <button
              type="submit"
              disabled={(!message.trim() && !image) || isUploading}
              className={`p-2 rounded-md min-w-[60px] ${
                ((message.trim() || image) && !isUploading)
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isUploading ? "..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}