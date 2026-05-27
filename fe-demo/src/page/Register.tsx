import { useState } from "react";
import { register } from "../service/authService";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!username || !password) {
        alert("Vui lòng điền đầy đủ tên đăng nhập và mật khẩu");
        return;
      }
      await register({ username, password });
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      alert("Đăng ký thất bại hoặc tên đăng nhập đã tồn tại");
    }
  };

  return (
    <div id="center">
      <h2>Register</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{
          padding: "8px 12px",
          margin: "8px 0",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          width: "250px"
        }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          padding: "8px 12px",
          margin: "8px 0",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          width: "250px"
        }}
      />

      <button 
        onClick={handleRegister}
        className="counter"
        style={{
          marginTop: "16px",
          cursor: "pointer",
          width: "276px",
          justifyContent: "center"
        }}
      >
        Register
      </button>

      <div style={{ marginTop: "16px" }}>
        <span>Đã có tài khoản? </span>
        <button 
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            color: "var(--accent)",
            textDecoration: "underline",
            cursor: "pointer"
          }}
        >
          Đăng nhập
        </button>
      </div>
    </div>
  );
}
