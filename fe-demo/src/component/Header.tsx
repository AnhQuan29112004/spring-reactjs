import { useEffect, useRef, useState } from "react";
import logo from "../assets/logo.svg";
import notification from "../assets/notification.svg";
import avatar from "../assets/avatar.svg";
import user_info from "../assets/info-user.svg";
import change_pass from "../assets/change-pass.svg";
import logout_logo from "../assets/logout.svg";
import { logout } from "../service/authService";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";


type HeaderProps = {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
};



export default function Header({
  isSidebarOpen,
  onToggleSidebar,
}: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
      try {
        const tokens = await logout();
        useAuthStore.getState().logout();
        navigate("/login");
      } catch (err) {
        alert("Sai tài khoản hoặc mật khẩu");
      }
    };

  const menuItems = [
    { icon: user_info, label: "Thông tin cá nhân", handle: ()=>{} },
    { icon: change_pass, label: "Đổi mật khẩu", handle: ()=>{} },
    { icon: logout_logo, label: "Đăng xuất", handle: ()=>{handleLogout()} },
  ];

  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between gap-3 bg-[#00854C] px-4 py-3 sm:px-5 mb-3">
      <button
        type="button"
        onClick={onToggleSidebar}
        aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isSidebarOpen}
        className="flex items-center justify-center w-10 h-10 text-white border rounded-md shrink-0 border-white/25 md:hidden"
      >
        <span className="text-xl leading-none">{isSidebarOpen ? "X" : "="}</span>
      </button>
      <div className="flex items-center flex-1 min-w-0 gap-3">
        <img src={logo} alt="Logo" className="w-10 h-10 shrink-0" />
        <div className="flex flex-col items-start justify-center min-w-0 max-sm:hidden">
          <span className="text-xs font-bold leading-tight text-left text-white font-be_vietnam_pro sm:text-sm">
            HỆ THỐNG QUẢN LÝ KHO VẬT CHỨNG VÀ TÀI LIỆU ĐỒ VẬT
          </span>
          <span className="font-be_vietnam_pro text-left text-[11px] font-normal leading-tight tracking-[0.3px] text-white/70 sm:text-xs">
            Công An Nhân Dân Việt Nam
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 ml-auto sm:gap-4 md:w-auto">
        <button
          type="button"
          aria-label="Notifications"
          className="flex items-center justify-center w-10 h-10 rounded-full shrink-0"
        >
          <img src={notification} alt="" className="w-full h-full" />
        </button>
        <div ref={userMenuRef} className="relative flex items-center min-w-0 gap-3">
          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 z-10 w-60 rounded-[4px] bg-white p-1 shadow-md">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.handle}
                  className="flex w-full items-center gap-[10px] rounded-[4px] pl-[12px] text-left transition-colors hover:bg-[#F3F7F5]"
                >
                  <div className="flex items-center gap-[10px] py-[10px]">
                    <img src={item.icon} alt="" />
                    <span className="font-be_vietnam_pro text-sm font-normal leading-[22px] text-[#000000] opacity-[88%]">
                      {item.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            aria-expanded={isUserMenuOpen}
            className="flex items-center min-w-0 gap-3 rounded-full"
          >
            <img src={avatar} alt="User avatar" className="w-10 h-10 rounded-full shrink-0" />
            <div className="flex-col items-start hidden min-w-0 sm:flex">
              <span className="truncate username">Nguyễn Văn Hùng</span>
              <span className="truncate username opacity-70">QTHT - Phòng CNTT, C11</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
