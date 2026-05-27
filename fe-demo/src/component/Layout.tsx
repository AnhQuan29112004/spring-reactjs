import type { ReactNode } from "react";
import { useState } from "react";
import Header from "../component/Header";
import LeftSideBar from "../component/LeftSideBar";
import { Breadcrumb } from "./BreadScrum";

export function Layout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#F0F0F0]">
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className="relative flex flex-1 gap-0 md:gap-[10px] md:px-[10px] md:pb-[10px]">
        <LeftSideBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex min-w-0 flex-1 flex-col bg-white px-4 py-4 sm:px-5 md:rounded md:px-6 md:py-5">
          <Breadcrumb />
          {children}
        </main>
      </div>
    </div>
  );
}
