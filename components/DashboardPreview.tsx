// components/DashboardPreview.tsx
import Image from "next/image";
import kanban from "@/public/kanban-board-copy.png";

export default function DashboardPreview() {
  return (
    <div className="relative p-4 sm:p-10 h-full flex flex-col">
      {/* Main Title */}
      <div className="mb-2 py-10 sm:py-20 z-10">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Get everything done
        </h2>
        <p className="text-gray-600">
          Organize, track, and complete your tasks efficiently with our
          intuitive task management board.
        </p>
      </div>

      {/* Dashboard mockup */}
      <div
        className="md:absolute w-full md:w-auto md:left-32 p-2 backdrop-blur-md bottom-0 md:bottom-0 flex-1 
                      bg-white/30 rounded-xl shadow-xl overflow-hidden border border-gray-200 
                      mt-4 md:mt-0 max-w-full"
      >
        <Image
          src={kanban}
          alt="dashboard"
          className="rounded-xl w-full h-auto"
          priority
        />
      </div>
    </div>
  );
}
