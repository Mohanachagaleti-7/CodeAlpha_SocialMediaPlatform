import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function Home() {
const navigate = useNavigate();

const [posts, setPosts] = useState([]);
const [comments, setComments] = useState({});
const [commentText, setCommentText] = useState({});
const [likedPosts, setLikedPosts] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const token = localStorage.getItem("token");
const storedUser = localStorage.getItem("user");

const currentUser = storedUser
? JSON.parse(storedUser)
: null;

useEffect(() => {
if (!token) {
navigate("/login");
return;
}


loadPosts();


}, []);

const authHeaders = {
Authorization: `Token ${token}`,
"Content-Type": "application/json",
};

const loadPosts = async () => {
setLoading(true);
setError("");


try {
  const response = await fetch(
    `${API_URL}/api/posts/`,
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.detail ||
        data.error ||
        "Unable to load posts."
    );
    setLoading(false);
    return;
  }

  setPosts(data);

  for (const post of data) {
    loadComments(post.id);
  }
} catch (error) {
  setError("Unable to connect to the server.");
}

setLoading(false);


};

const loadComments = async (postId) => {
try {
const response = await fetch(
`${API_URL}/api/comments/?post=${postId}`,
{
headers: {
Authorization: `Token ${token}`,
},
}
);


  const data = await response.json();

  if (response.ok) {
    setComments((previous) => ({
      ...previous,
      [postId]: data,
    }));
  }
} catch (error) {
  console.log("Unable to load comments.");
}


};

const handleLike = async (postId) => {
try {
const isLiked = likedPosts[postId];


  const response = await fetch(
    `${API_URL}/api/likes/`,
    {
      method: isLiked ? "DELETE" : "POST",
      headers: authHeaders,
      body: JSON.stringify({
        post: postId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    alert(
      data.error ||
        data.detail ||
        "Unable to update like."
    );
    return;
  }

  setLikedPosts((previous) => ({
    ...previous,
    [postId]: !isLiked,
  }));

  setPosts((previousPosts) =>
    previousPosts.map((post) => {
      if (post.id !== postId) {
        return post;
      }

      return {
        ...post,
        like_count: isLiked
          ? Math.max(0, post.like_count - 1)
          : post.like_count + 1,
      };
    })
  );
} catch (error) {
  alert("Unable to connect to the server.");
}


};

const handleComment = async (postId) => {
const text = commentText[postId];


if (!text || !text.trim()) {
  return;
}

try {
  const response = await fetch(
    `${API_URL}/api/comments/`,
    {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({
        post: postId,
        content: text.trim(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    alert(
      data.error ||
        data.detail ||
        "Unable to add comment."
    );
    return;
  }

  setComments((previous) => ({
    ...previous,
    [postId]: [
      ...(previous[postId] || []),
      data,
    ],
  }));

  setCommentText((previous) => ({
    ...previous,
    [postId]: "",
  }));
} catch (error) {
  alert("Unable to connect to the server.");
}


};

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");


navigate("/login");


};

if (loading) {
return ( <div style={styles.center}> <h2>Loading posts...</h2> </div>
);
}

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
        onClick={() => navigate("/create-post")}
      >
        Create Post
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

    <div style={styles.welcome}>
      <h2>
        Welcome
        {currentUser
          ? `, ${currentUser.username}`
          : ""}
        !
      </h2>

      <p>
        See what everyone is sharing.
      </p>
    </div>

    {error && (
      <div style={styles.error}>
        {error}
      </div>
    )}

    {posts.length === 0 ? (
      <div style={styles.empty}>
        <h2>No posts yet</h2>

        <p>
          Be the first person to create a post.
        </p>

        <button
          style={styles.createButton}
          onClick={() => navigate("/create-post")}
        >
          Create Post
        </button>
      </div>
    ) : (
      posts.map((post) => (
        <article
          key={post.id}
          style={styles.postCard}
        >

          <div style={styles.postHeader}>

            <div style={styles.avatar}>
              {post.author_username
                ? post.author_username
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <strong>
                {post.author_username}
              </strong>

              <p style={styles.date}>
                {new Date(
                  post.created_at
                ).toLocaleString()}
              </p>
            </div>

          </div>

          <div style={styles.content}>
            {post.content}
          </div>

          {post.image && (
            <img
              src={post.image}
              alt="Post"
              style={styles.postImage}
              onError={(event) => {
                event.currentTarget.style.display =
                  "none";
              }}
            />
          )}

          <div style={styles.actions}>

            <button
              onClick={() =>
                handleLike(post.id)
              }
              style={{
                ...styles.actionButton,
                ...(likedPosts[post.id]
                  ? styles.likedButton
                  : {}),
              }}
            >
              {likedPosts[post.id]
                ? "♥ Liked"
                : "♡ Like"}

              {" "}
              ({post.like_count})
            </button>

          </div>

          <div style={styles.commentSection}>

            <h4>
              Comments
            </h4>

            {(comments[post.id] || []).length ===
            0 ? (
              <p style={styles.noComments}>
                No comments yet.
              </p>
            ) : (
              comments[post.id].map(
                (comment) => (
                  <div
                    key={comment.id}
                    style={styles.comment}
                  >
                    <strong>
                      {comment.author_username}
                    </strong>

                    <p>
                      {comment.content}
                    </p>
                  </div>
                )
              )
            )}

            <div style={styles.commentInputRow}>

              <input
                type="text"
                value={
                  commentText[post.id] || ""
                }
                onChange={(event) =>
                  setCommentText(
                    (previous) => ({
                      ...previous,
                      [post.id]:
                        event.target.value,
                    })
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleComment(post.id);
                  }
                }}
                placeholder="Write a comment..."
                style={styles.commentInput}
              />

              <button
                onClick={() =>
                  handleComment(post.id)
                }
                style={styles.commentButton}
              >
                Send
              </button>

            </div>

          </div>

        </article>
      ))
    )}

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
maxWidth: "750px",
margin: "0 auto",
padding: "30px 20px",
boxSizing: "border-box",
},

welcome: {
backgroundColor: "#ffffff",
padding: "20px",
borderRadius: "12px",
marginBottom: "20px",
boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
},

postCard: {
backgroundColor: "#ffffff",
borderRadius: "12px",
marginBottom: "20px",
padding: "20px",
boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
},

postHeader: {
display: "flex",
alignItems: "center",
gap: "12px",
marginBottom: "15px",
},

avatar: {
width: "45px",
height: "45px",
borderRadius: "50%",
backgroundColor: "#4f46e5",
color: "#ffffff",
display: "flex",
justifyContent: "center",
alignItems: "center",
fontWeight: "bold",
fontSize: "20px",
},

date: {
margin: "3px 0 0",
color: "#888888",
fontSize: "12px",
},

content: {
fontSize: "16px",
lineHeight: "1.6",
marginBottom: "15px",
whiteSpace: "pre-wrap",
},

postImage: {
width: "100%",
maxHeight: "500px",
objectFit: "contain",
borderRadius: "10px",
marginBottom: "15px",
},

actions: {
borderTop: "1px solid #eeeeee",
borderBottom: "1px solid #eeeeee",
padding: "10px 0",
},

actionButton: {
border: "none",
backgroundColor: "transparent",
cursor: "pointer",
fontSize: "15px",
fontWeight: "bold",
padding: "8px 0",
},

likedButton: {
color: "#e11d48",
},

commentSection: {
marginTop: "15px",
},

noComments: {
color: "#888888",
fontSize: "14px",
},

comment: {
backgroundColor: "#f7f7f7",
padding: "10px",
borderRadius: "8px",
marginBottom: "8px",
},

commentInputRow: {
display: "flex",
gap: "8px",
marginTop: "15px",
},

commentInput: {
flex: 1,
padding: "11px",
border: "1px solid #cccccc",
borderRadius: "8px",
outline: "none",
boxSizing: "border-box",
},

commentButton: {
padding: "10px 16px",
border: "none",
borderRadius: "8px",
backgroundColor: "#4f46e5",
color: "#ffffff",
cursor: "pointer",
fontWeight: "bold",
},

error: {
backgroundColor: "#fdecec",
color: "#b42318",
padding: "12px",
borderRadius: "8px",
marginBottom: "15px",
},

empty: {
backgroundColor: "#ffffff",
textAlign: "center",
padding: "50px 20px",
borderRadius: "12px",
},

createButton: {
padding: "12px 20px",
border: "none",
borderRadius: "8px",
backgroundColor: "#4f46e5",
color: "#ffffff",
cursor: "pointer",
fontWeight: "bold",
},

center: {
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
},
};

export default Home;
