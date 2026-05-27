import { useEffect, useMemo, useRef, useState } from "react";
import { Search, Plus, Edit, Trash2, Shield, X } from "lucide-react";
import { Subject, debounceTime, distinctUntilChanged } from "rxjs";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  type UserAdmin,
  type UserPage,
  type UserRole,
} from "../service/userService";

const roles: UserRole[] = ["LANHDAO", "THUKHO", "VANTHU"];

export default function UserAdminPage() {
  const [users, setUsers] = useState<UserPage>({ content: [] });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchSubjectRef = useRef(new Subject<string>());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAdmin | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("VANTHU");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = useMemo(() => users.content, [users.content]);

  const fetchUsers = async (page = 0, keyword = debouncedSearch) => {
    try {
      const data = await getUsers(page, 10, keyword);
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    fetchUsers(0, "");
  }, []);

  useEffect(() => {
    const subscription = searchSubjectRef.current
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        setDebouncedSearch(value.trim());
      });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchUsers(0, debouncedSearch);
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    searchSubjectRef.current.next(value);
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setUsername("");
    setPassword("");
    setRole("VANTHU");
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserAdmin) => {
    setSelectedUser(user);
    setUsername(user.username);
    setPassword("");
    setRole(user.role);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    if (!selectedUser && !password.trim()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        username: username.trim(),
        password: password.trim() || undefined,
        role,
      };

      if (selectedUser) {
        await updateUser(selectedUser.id, payload);
      } else {
        await createUser(payload);
      }

      setIsModalOpen(false);
      await fetchUsers(users.number ?? 0);
    } catch (err) {
      console.error("Error saving user", err);
      alert("Lưu user thất bại. Kiểm tra username đã tồn tại hoặc dữ liệu chưa hợp lệ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (user: UserAdmin) => {
    if (!confirm(`Bạn chắc chắn muốn xóa user "${user.username}"?`)) return;

    try {
      await deleteUser(user.id);
      await fetchUsers(users.number ?? 0);
    } catch (err) {
      console.error("Error deleting user", err);
      alert("Xóa user thất bại.");
    }
  };

  return (
    <div className="space-y-6 w-[90%]">
      <div className="flex justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-left text-gray-900">Quản trị user</h2>
          <p className="text-xs text-slate-500">Quản lý tài khoản, quyền truy cập và vai trò trong hệ thống.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#00288e] hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm shadow-blue-800/10"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm user mới</span>
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4 bg-white border border-gray-200 shadow-sm rounded-xl md:flex-row">
        <div className="relative flex-grow">
          <Search className="absolute inset-y-0 left-3 my-auto w-4.5 h-4.5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Tìm kiếm theo username..."
            className="w-full px-8 py-2 bg-slate-50 border border-gray-200 text-xs rounded-lg text-gray-900 focus:outline-none focus:border-[#00288e] focus:bg-white transition-all placeholder-gray-400 font-medium"
          />
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="font-bold tracking-wider uppercase border-b border-gray-200 bg-slate-50 text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3 text-center">Role</th>
                <th className="px-4 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 font-medium text-center text-slate-400">
                    Không tìm thấy user phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-mono text-slate-500">{user.id}</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">{user.username}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[#00288e] border border-blue-100 text-[10px] font-bold">
                        <Shield className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-1 px-2 transition-all rounded cursor-pointer text-slate-600 hover:text-blue-700 hover:bg-slate-100"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 px-2 transition-all rounded cursor-pointer text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md p-6 bg-white border border-gray-100 shadow-xl rounded-xl">
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">
                {selectedUser ? "Cập nhật user" : "Thêm user mới"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 rounded cursor-pointer hover:bg-slate-100 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-500">Username *</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#00288e] text-gray-900"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-500">
                  {selectedUser ? "Mật khẩu mới" : "Mật khẩu *"}
                </label>
                <input
                  type="password"
                  required={!selectedUser}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={selectedUser ? "Để trống nếu không đổi" : ""}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#00288e] text-gray-900"
                />
              </div>
              <div>
                <label className="block mb-1 text-xs font-semibold text-slate-500">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#00288e] text-gray-900 bg-white"
                >
                  {roles.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2 text-xs font-semibold border border-gray-200 rounded-lg cursor-pointer text-slate-600 hover:bg-slate-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 py-2 bg-[#00288e] hover:bg-blue-800 disabled:bg-blue-300 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                >
                  {isSubmitting ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
