import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function Register() {
const navigate = useNavigate();

const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleRegister = async (event) => {
event.preventDefault();


setError("");
setSuccess("");

if (!username.trim() || !email.trim() || !password) {
  setError("Please fill in all fields.");
  return;
}

if (password !== confirmPassword) {
  setError("Passwords do not match.");
  return;
}

if (password.length < 8) {
  setError("Password must contain at least 8 characters.");
  return;
}

setLoading(true);

try {
  const response = await fetch(`${API_URL}/api/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.trim(),
      email: email.trim(),
      password: password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.error ||
        data.detail ||
        "Registration failed."
    );
    setLoading(false);
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  );

  setSuccess("Registration successful!");

  setTimeout(() => {
    navigate("/home");
  }, 700);
} catch (error) {
  setError("Unable to connect to the server.");
}

setLoading(false);


};

return ( <div style={styles.page}>


  <div style={styles.card}>

    <h1 style={styles.title}>
      Create Account
    </h1>

    <p style={styles.subtitle}>
      Join our social media platform
    </p>

    {error && (
      <div style={styles.error}>
        {error}
      </div>
    )}

    {success && (
      <div style={styles.success}>
        {success}
      </div>
    )}

    <form onSubmit={handleRegister}>

      <label style={styles.label}>
        Username
      </label>

      <input
        type="text"
        value={username}
        onChange={(event) =>
          setUsername(event.target.value)
        }
        placeholder="Enter username"
        style={styles.input}
      />

      <label style={styles.label}>
        Email
      </label>

      <input
        type="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        placeholder="Enter email"
        style={styles.input}
      />

      <label style={styles.label}>
        Password
      </label>

      <input
        type="password"
        value={password}
        onChange={(event) =>
          setPassword(event.target.value)
        }
        placeholder="Enter password"
        style={styles.input}
      />

      <label style={styles.label}>
        Confirm Password
      </label>

      <input
        type="password"
        value={confirmPassword}
        onChange={(event) =>
          setConfirmPassword(event.target.value)
        }
        placeholder="Confirm password"
        style={styles.input}
      />

      <button
        type="submit"
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Creating Account..." : "Register"}
      </button>

    </form>

    <p style={styles.loginText}>
      Already have an account?
    </p>

    <Link
      to="/login"
      style={styles.loginLink}
    >
      Login
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
margin: 0,
color: "#222222",
},

subtitle: {
textAlign: "center",
color: "#777777",
marginBottom: "25px",
},

label: {
display: "block",
marginTop: "15px",
marginBottom: "7px",
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

success: {
backgroundColor: "#e8f7ee",
color: "#16733b",
padding: "12px",
borderRadius: "8px",
marginBottom: "15px",
},

loginText: {
textAlign: "center",
marginTop: "25px",
marginBottom: "8px",
color: "#666666",
},

loginLink: {
display: "block",
textAlign: "center",
color: "#4f46e5",
fontWeight: "bold",
textDecoration: "none",
},
};

export default Register;
