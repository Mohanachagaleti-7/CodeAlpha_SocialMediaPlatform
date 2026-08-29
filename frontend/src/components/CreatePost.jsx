import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function CreatePost() {
const navigate = useNavigate();

const [content, setContent] = useState("");
const [image, setImage] = useState("");
const [video, setVideo] = useState("");
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

const token = localStorage.getItem("token");

const handleSubmit = async (event) => {
event.preventDefault();


setMessage("");
setError("");

if (!content.trim()) {
  setError("Please write something before creating the post.");
  return;
}

if (!token) {
  setError("Please login first.");
  return;
}

setLoading(true);

try {
  const response = await fetch(`${API_URL}/api/posts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify({
      content: content,
      image: image,
      video: video,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.detail ||
        data.error ||
        "Unable to create post."
    );
    setLoading(false);
    return;
  }

  setMessage("Post created successfully!");

  setContent("");
  setImage("");
  setVideo("");

  setTimeout(() => {
    navigate("/home");
  }, 1000);
} catch (error) {
  setError("Unable to connect to the server.");
}

setLoading(false);


};

return ( <div style={styles.page}> <div style={styles.card}>


    <h1 style={styles.heading}>Create Post</h1>

    {message && (
      <div style={styles.success}>
        {message}
      </div>
    )}

    {error && (
      <div style={styles.error}>
        {error}
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
        rows="6"
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
        placeholder="Enter image URL"
        style={styles.input}
      />

      {image && (
        <div style={styles.previewContainer}>
          <p style={styles.previewText}>
            Image Preview
          </p>

          <img
            src={image}
            alt="Preview"
            style={styles.imagePreview}
            onError={(event) => {
              event.target.style.display = "none";
            }}
          />
        </div>
      )}

      <label style={styles.label}>
        Video URL
      </label>

      <input
        type="text"
        value={video}
        onChange={(event) =>
          setVideo(event.target.value)
        }
        placeholder="Enter video URL"
        style={styles.input}
      />

      {video && (
        <div style={styles.previewContainer}>
          <p style={styles.previewText}>
            Video Preview
          </p>

          <video
            src={video}
            controls
            style={styles.videoPreview}
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Creating..." : "Create Post"}
      </button>

    </form>

  </div>
</div>


);
}

const styles = {
page: {
minHeight: "100vh",
backgroundColor: "#f4f6f8",
padding: "40px 20px",
boxSizing: "border-box",
},

card: {
width: "100%",
maxWidth: "650px",
margin: "0 auto",
backgroundColor: "#ffffff",
padding: "30px",
borderRadius: "15px",
boxShadow: "0 5px 20px rgba(0, 0, 0, 0.1)",
boxSizing: "border-box",
},

heading: {
textAlign: "center",
marginBottom: "30px",
color: "#222222",
},

label: {
display: "block",
marginTop: "20px",
marginBottom: "8px",
fontWeight: "bold",
color: "#333333",
},

textarea: {
width: "100%",
padding: "12px",
border: "1px solid #cccccc",
borderRadius: "8px",
fontSize: "15px",
resize: "vertical",
boxSizing: "border-box",
outline: "none",
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

success: {
backgroundColor: "#e8f7ee",
color: "#16733b",
padding: "12px",
borderRadius: "8px",
marginBottom: "15px",
},

error: {
backgroundColor: "#fdecec",
color: "#b42318",
padding: "12px",
borderRadius: "8px",
marginBottom: "15px",
},

previewContainer: {
marginTop: "15px",
padding: "15px",
border: "1px solid #eeeeee",
borderRadius: "8px",
},

previewText: {
marginTop: 0,
fontWeight: "bold",
},

imagePreview: {
width: "100%",
maxHeight: "350px",
objectFit: "contain",
borderRadius: "8px",
},

videoPreview: {
width: "100%",
maxHeight: "350px",
borderRadius: "8px",
},
};

export default CreatePost;
