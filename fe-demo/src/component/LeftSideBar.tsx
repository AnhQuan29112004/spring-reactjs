import { NavLink } from "react-router-dom";
import { getMenu } from "../util/leftMenu";
import { icons } from "lucide-react";

import { useAuthStore } from "../store/authStore";


type LeftSideBarProps = {
  isOpen: boolean;
  onClose: () => void;
};


export default function LeftSideBar({ isOpen, onClose }: LeftSideBarProps) {
  const role = useAuthStore((state) => state.user?.role);
  const items = getMenu(role)

  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={onClose}
        className={`fixed inset-0 z-20 bg-black/40 transition-opacity duration-200 md:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed left-0 top-0 z-30 flex h-full w-[280px] max-w-[85vw] flex-col bg-white px-3 pt-20 shadow-lg transition-transform duration-200 md:static md:z-0 md:h-auto md:w-[240px] md:max-w-none md:translate-x-0 md:rounded md:px-3 md:pt-5 md:shadow-none lg:w-[280px] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex w-full items-center gap-4 rounded-[8px] py-3 pl-3 pr-2 transition-colors ${
                  isActive ? "bg-[#00854C]" : "bg-white hover:bg-[#F3F7F5]"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <img
                    src={item.icons}
                    aria-hidden="true"
                    className={`${
                      isActive ? "border-white invert brightness-200" : "grayscale opacity-60"
                    }`}
                  />
                  
                  <span
                    className={`font-be_vietnam_pro truncate text-base font-bold leading-[22px] ${
                      isActive ? "text-white" : "text-black/80"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
