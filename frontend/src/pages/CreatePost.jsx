import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function CreatePost() {
const navigate = useNavigate();

const [content, setContent] = useState("");
const [image, setImage] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

const handleSubmit = async (event) => {
event.preventDefault();


setError("");
setSuccess("");

const token = localStorage.getItem("token");

if (!token) {
  navigate("/login");
  return;
}

if (!content.trim()) {
  setError("Please write something before posting.");
  return;
}

setLoading(true);

try {
  const response = await fetch(
    `${API_URL}/api/posts/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        content: content.trim(),
        image: image.trim(),
      }),
    }
  );

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = {
      error: text || "Invalid response from server.",
    };
  }

  if (!response.ok) {
    setError(
      data.error ||
        data.detail ||
        JSON.stringify(data) ||
        "Unable to create post."
    );

    setLoading(false);
    return;
  }

  setContent("");
  setImage("");
  setSuccess("Post created successfully!");

  setTimeout(() => {
    navigate("/home");
  }, 800);
} catch (error) {
  console.error("Create post error:", error);
  setError(
    "Unable to connect to the server. Make sure Django is running."
  );
}

setLoading(false);


};

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");
};

return ( <div style={styles.page}>


  <header style={styles.header}>

    <h1 style={styles.logo}>
      Social Media
    </h1>

    <div style={styles.navButtons}>

      <button
        style={styles.navButton}
        onClick={() => navigate("/home")}
      >
        Home
      </button>

      <button
        style={styles.navButton}
        onClick={() => navigate("/users")}
      >
        Find People
      </button>

      <button
        style={styles.navButton}
        onClick={() => navigate("/profile")}
      >
        Profile
      </button>

      <button
        style={styles.logoutButton}
        onClick={handleLogout}
      >
        Logout
      </button>

    </div>

  </header>

  <main style={styles.container}>

    <div style={styles.card}>

      <h2 style={styles.title}>
        Create Post
      </h2>

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

      <form onSubmit={handleSubmit}>

        <label style={styles.label}>
          What's on your mind?
        </label>

        <textarea
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder="Write something..."
          rows="7"
          style={styles.textarea}
        />

        <label style={styles.label}>
          Image URL
        </label>

        <input
          type="text"
          value={image}
          onChange={(event) =>
            setImage(event.target.value)
          }
          placeholder="Paste an image URL (optional)"
          style={styles.input}
        />

        {image.trim() && (
          <div style={styles.previewContainer}>

            <p style={styles.previewText}>
              Image Preview
            </p>

            <img
              src={image}
              alt="Post preview"
              style={styles.preview}
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
              onLoad={(event) => {
                event.currentTarget.style.display = "block";
              }}
            />

          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.postButton,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Posting..." : "Create Post"}
        </button>

      </form>

    </div>

  </main>

</div>


);
}

const styles = {
page: {
minHeight: "100vh",
backgroundColor: "#f4f6f8",
},

header: {
backgroundColor: "#ffffff",
padding: "15px 30px",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
boxShadow: "0 2px 10px rgba(0, 0, 0, 0.08)",
position: "sticky",
top: 0,
zIndex: 10,
},

logo: {
margin: 0,
color: "#4f46e5",
},

navButtons: {
display: "flex",
gap: "10px",
flexWrap: "wrap",
},

navButton: {
padding: "9px 15px",
border: "none",
borderRadius: "7px",
backgroundColor: "#eeeeee",
cursor: "pointer",
fontWeight: "bold",
},

logoutButton: {
padding: "9px 15px",
border: "none",
borderRadius: "7px",
backgroundColor: "#dc3545",
color: "#ffffff",
cursor: "pointer",
fontWeight: "bold",
},

container: {
width: "100%",
maxWidth: "700px",
margin: "0 auto",
padding: "40px 20px",
boxSizing: "border-box",
},

card: {
backgroundColor: "#ffffff",
padding: "35px",
borderRadius: "15px",
boxShadow: "0 5px 20px rgba(0, 0, 0, 0.08)",
},

title: {
textAlign: "center",
marginBottom: "25px",
},

label: {
display: "block",
fontWeight: "bold",
marginBottom: "8px",
marginTop: "20px",
},

textarea: {
width: "100%",
padding: "12px",
border: "1px solid #cccccc",
borderRadius: "8px",
fontSize: "15px",
resize: "vertical",
boxSizing: "border-box",
fontFamily: "inherit",
},

input: {
width: "100%",
padding: "12px",
border: "1px solid #cccccc",
borderRadius: "8px",
fontSize: "15px",
boxSizing: "border-box",
},

previewContainer: {
marginTop: "20px",
},

previewText: {
fontWeight: "bold",
marginBottom: "10px",
},

preview: {
width: "100%",
maxHeight: "400px",
objectFit: "contain",
borderRadius: "10px",
border: "1px solid #eeeeee",
},

postButton: {
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
};

export default CreatePost;
