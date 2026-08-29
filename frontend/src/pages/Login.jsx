import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function Login() {
const navigate = useNavigate();

const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const handleLogin = async (event) => {
event.preventDefault();


setError("");

if (!username.trim() || !password) {
  setError("Please enter username and password.");
  return;
}

setLoading(true);

try {
  const response = await fetch(`${API_URL}/api/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.trim(),
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.error ||
        data.detail ||
        "Invalid username or password."
    );
    setLoading(false);
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  navigate("/home");
} catch (error) {
  setError("Unable to connect to the server.");
}

setLoading(false);


};

return ( <div style={styles.page}>


  <div style={styles.card}>

    <h1 style={styles.title}>
      Welcome Back
    </h1>

    <p style={styles.subtitle}>
      Login to your account
    </p>

    {error && (
      <div style={styles.error}>
        {error}
      </div>
    )}

    <form onSubmit={handleLogin}>

      <label style={styles.label}>
        Username
      </label>

      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(event) =>
          setUsername(event.target.value)
        }
        style={styles.input}
      />

      <label style={styles.label}>
        Password
      </label>

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        style={styles.input}
      />

      <button
        type="submit"
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </form>

    <p style={styles.registerText}>
      Don't have an account?
    </p>

    <Link
      to="/register"
      style={styles.registerLink}
    >
      Create Account
    </Link>

  </div>

</div>


);
}

const styles = {
page: {
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
backgroundColor: "#f4f6f8",
padding: "20px",
boxSizing: "border-box",
},

card: {
width: "100%",
maxWidth: "450px",
backgroundColor: "#ffffff",
padding: "35px",
borderRadius: "15px",
boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
boxSizing: "border-box",
},

title: {
textAlign: "center",
margin: "0",
color: "#222222",
},

subtitle: {
textAlign: "center",
color: "#777777",
marginBottom: "25px",
},

label: {
display: "block",
marginBottom: "7px",
marginTop: "15px",
fontWeight: "bold",
color: "#333333",
},

input: {
width: "100%",
padding: "12px",
border: "1px solid #cccccc",
borderRadius: "8px",
fontSize: "15px",
boxSizing: "border-box",
outline: "none",
},

button: {
width: "100%",
padding: "13px",
marginTop: "25px",
border: "none",
borderRadius: "8px",
backgroundColor: "#4f46e5",
color: "#ffffff",
fontSize: "16px",
fontWeight: "bold",
cursor: "pointer",
},

error: {
backgroundColor: "#fdecec",
color: "#b42318",
padding: "12px",
borderRadius: "8px",
marginBottom: "15px",
},

registerText: {
textAlign: "center",
marginTop: "25px",
marginBottom: "8px",
color: "#666666",
},

registerLink: {
display: "block",
textAlign: "center",
color: "#4f46e5",
fontWeight: "bold",
textDecoration: "none",
},
};

export default Login;
