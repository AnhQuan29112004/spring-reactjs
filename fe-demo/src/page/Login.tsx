import { useState } from "react";
import { login } from "../service/authService";
import { saveToken } from "../util/token";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AuthMode } from "../types/AuthType.types";
import { register } from "../service/authService";
import logo from "../assets/logo.svg";
import { validateForm } from "../util/validateForm";

export default function Login() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [errors, setErrors] = useState<{
                                        username?: string;
                                        password?: string;
                                      }>({});
  const loginSchema = {
    username: {
      required: true,
      message: "Tên đăng nhập không được để trống",
    },
    password: {
      required: true,
      message: "Mật khẩu không được để trống",
  },
  };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  void setError;
  void setSuccess;
  void setLoading;

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const formValues = {
      username,
      password,
    };

    const validationErrors = validateForm(
      formValues,
      loginSchema
    );

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      
      const tokens = await login({ username, password });
      saveToken(tokens);

      navigate("/"); // chuyển sang home
    } catch (err) {
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  const handleRegister = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        alert("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu");
        return;
      }
      await register({ username, password });
      alert("Đăng ký thành công!");
      setMode("login");
      setUsername("");
      setPassword("");
    } catch (err) {
      alert("Đăng ký thất bại hoặc tên đăng nhập đã tồn tại");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf0f5] via-[#f7f9fb] to-[#ebf0f5] flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-blue-100 rounded-full pointer-events-none w-96 h-96 blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00288e]/5 rounded-full blur-3xl opacity-30 translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

      {/* Main Container */}
      <div className="flex items-center justify-center flex-grow p-4">
        <motion.div
          id="login-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E5E7EB80] w-auto h-auto relative z-10 rounded-xl overflow-hidden"
        >
          <div className="flex justify-center items-center h-[35%] w-full bg-gradient-to-r from-[#009966] to-[#008236]">
            <div className="flex w-full px-[84px] py-6 justify-center items-center flex-col gap-[6px] h-full">
              <img src={logo} alt='logo' className="w-[145px] h-[112px]"/>
              <p className="font-inter font-bold text-2xl leading-8 text-white">
                ĐĂNG NHẬP
              </p>
              <p className="font-inter font-medium text-sm leading-5 text-white">Phân hệ quản lý kho vật chứng và tài liệu đồ vật</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-grow flex-col h-[65%] pb-3"
              >
                {/* Notifications */}
                {error && (
                  <div className="mb-5 p-3.5 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="mb-5 p-3.5 bg-green-50 text-green-700 text-xs rounded-lg border border-green-100 flex items-start gap-2.5">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}
                {/* <button onClick={()=>setMode('register')}>
                  ablddjfkgdf
                </button> */}
                {/* Login Form */}
                <form onSubmit={handleLogin} className="w-full px-8 pt-8">
                  <div className="flex flex-col items-start">
                    <label className="block font-inter text-xs font-semibold text-[#364153] mb-2 leading-5 antialiased">
                      Tên đăng nhập
                    </label>
                    {errors.username && (
                      <span className="text-red-600 text-sm mb-1">
                        {errors.username}
                      </span>
                    )}
                    <div className="relative w-full mb-5">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm transition-all focus:outline-none focus:border-[#00288e] focus:ring-2 focus:ring-[#00288e]/10 placeholder-gray-400"
                        placeholder="admin_store_01"
                      />
                    </div>
                  

                    
                    <label className="block font-inter text-xs font-semibold text-[#364153] mb-2 leading-5 antialiased">
                      Mật khẩu
                    </label>
                    {errors.password && (
                      <span className="text-red-600 text-sm mb-1">
                        {errors.password}
                      </span>
                    )}
                    <div className="relative w-full mb-7">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 text-gray-900 rounded-lg text-sm transition-all focus:outline-none focus:border-[#00288e] focus:ring-2 focus:ring-[#00288e]/10 placeholder-gray-400"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-[#009966] to-[#008236] text-white font-semibold py-4 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-[0_2px_8px_rgba(0,40,142,0.15)] focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer text-sm"
                    >
                      <span className="block font-inter text-base font-semibold text-white leading-6 antialiased">{loading ? "Đang kết nối..." : "Đăng nhập"}</span>
                    </button>
                  </div>
                </form>

                <div className="mt-7 text-center">
                  <span className="text-sm font-inter leading-5 font-medium text-[#009966]">Quên mật khẩu? </span>
                  {/* <button
                    onClick={() => setMode("register")}
                    className="text-sm font-bold text-[#00288e] hover:underline cursor-pointer"
                  >
                    Đăng ký ngay
                  </button> */}
                </div>
                <p className="mt-auto font-inter text-xs leading-4 font-normal">© 2026 Công an nhân dân Việt Nam</p>
              </motion.div>
            )}

            {mode === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="mb-2 text-2xl font-bold tracking-tight text-center text-gray-900">
                    Đăng ký tài khoản
                  </h1>
                  <p className="text-[#505f76] text-sm text-center mb-6">
                    Bắt đầu số hóa hành trình quản lý kinh doanh của bạn.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 text-xs text-red-700 border border-red-100 rounded-lg bg-red-50">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="flex items-start gap-2 p-3 text-xs text-green-700 border border-green-100 rounded-lg bg-green-50">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Tên tài khoản</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00288e]"
                      placeholder="vd: store_admin_moi"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Mật khẩu mới</label>
                    <input
                      type="password"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#00288e]"
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00288e] hover:bg-blue-800 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 mt-4 transition-all shadow-md cursor-pointer text-sm"
                  >
                    <span>{loading ? "Đang xử lý..." : "Đăng ký thành viên"}</span>
                  </button>
                </form>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setMode("login")}
                    className="text-sm font-semibold text-gray-500 transition-all cursor-pointer hover:text-gray-800"
                  >
                    Đôi ý? Đăng nhập tại đây
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

    </div>
  );
}
