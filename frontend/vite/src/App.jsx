import { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";

export default function App() {
  const [view, setView] = useState("login"); // login | signup | users
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [users, setUsers] = useState([]);
  const [protectedData, setProtectedData] = useState(null);

  // If token exists, auto-switch to users view
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setView("users");
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/signup", form);
      alert(response.data.message);
      setView("login");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/login", form);
      localStorage.setItem("token", response.data.token);
      setView("users");
      fetchUsers();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  // Fetch users (protected)
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (error) {
      alert("Failed to fetch users");
    }
    
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setView("login");
    setUsers([]);
    
  };

  const handleProtected = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3001/protected", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
    } catch (error) {
      alert("Failed to access protected route");
    }
  };


  return (
    <div className="container">
      <h1>Auth App</h1>
      <button onClick={handleProtected}>Access Protected Route</button>

      {view === "signup" && (
        <form onSubmit={handleSignup}>
          <h2>Signup</h2>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit">Signup</button>
          <p>
            Already have an account?{" "}
            <span className="link" onClick={() => setView("login")}>
              Login
            </span>
          </p>
        </form>
      )}

      {view === "login" && (
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
          <p>
            Don’t have an account?{" "}
            <span className="link" onClick={() => setView("signup")}>
              Signup
            </span>
          </p>
        </form>
      )}

      {view === "users" && (
        <div>
          <h2>Users List</h2>
          <button className="logout" onClick={handleLogout}>
            Logout
          </button>
          <ul>
            {users.map((u) => (
              <li key={u._id}>
                {u.name} — {u.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
