import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function Users() {
const navigate = useNavigate();

const [users, setUsers] = useState([]);
const [following, setFollowing] = useState([]);
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


loadUsers();
loadFollowing();


}, []);

const loadUsers = async () => {
try {
const response = await fetch(
`${API_URL}/api/users/`,
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
        "Unable to load users."
    );
    setLoading(false);
    return;
  }

  setUsers(data);
} catch (error) {
  setError("Unable to connect to the server.");
}

setLoading(false);


};

const loadFollowing = async () => {
try {
const response = await fetch(
`${API_URL}/api/likes/follow/`,
{
headers: {
Authorization: `Token ${token}`,
},
}
);


  const data = await response.json();

  if (response.ok) {
    setFollowing(
      data.map((item) => item.following)
    );
  }
} catch (error) {
  console.log("Unable to load following list.");
}


};

const handleFollow = async (userId) => {
const isFollowing = following.includes(userId);


try {
  const response = await fetch(
    `${API_URL}/api/likes/follow/`,
    {
      method: isFollowing ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        following: userId,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    alert(
      data.error ||
        data.detail ||
        "Unable to update follow."
    );
    return;
  }

  if (isFollowing) {
    setFollowing((previous) =>
      previous.filter((id) => id !== userId)
    );
  } else {
    setFollowing((previous) => [
      ...previous,
      userId,
    ]);
  }
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
return ( <div style={styles.center}> <h2>Loading users...</h2> </div>
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

    <h2 style={styles.title}>
      Find People
    </h2>

    {error && (
      <div style={styles.error}>
        {error}
      </div>
    )}

    {users.length === 0 ? (
      <div style={styles.empty}>
        No users found.
      </div>
    ) : (
      users.map((user) => {

        const isCurrentUser =
          currentUser &&
          currentUser.id === user.id;

        const isFollowing =
          following.includes(user.id);

        if (isCurrentUser) {
          return null;
        }

        return (
          <div
            key={user.id}
            style={styles.userCard}
          >

            <div style={styles.avatar}>
              {user.username
                .charAt(0)
                .toUpperCase()}
            </div>

            <div style={styles.userInfo}>
              <strong>
                {user.username}
              </strong>

              <p>
                {user.email}
              </p>
            </div>

            <button
              onClick={() =>
                handleFollow(user.id)
              }
              style={
                isFollowing
                  ? styles.unfollowButton
                  : styles.followButton
              }
            >
              {isFollowing
                ? "Following"
                : "Follow"}
            </button>

          </div>
        );
      })
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
maxWidth: "700px",
margin: "0 auto",
padding: "40px 20px",
boxSizing: "border-box",
},

title: {
textAlign: "center",
marginBottom: "25px",
},

userCard: {
backgroundColor: "#ffffff",
padding: "18px",
borderRadius: "12px",
marginBottom: "12px",
display: "flex",
alignItems: "center",
gap: "15px",
boxShadow: "0 3px 12px rgba(0, 0, 0, 0.06)",
},

avatar: {
width: "50px",
height: "50px",
borderRadius: "50%",
backgroundColor: "#4f46e5",
color: "#ffffff",
display: "flex",
justifyContent: "center",
alignItems: "center",
fontSize: "20px",
fontWeight: "bold",
flexShrink: 0,
},

userInfo: {
flex: 1,
},

followButton: {
padding: "9px 18px",
border: "none",
borderRadius: "7px",
backgroundColor: "#4f46e5",
color: "#ffffff",
cursor: "pointer",
fontWeight: "bold",
},

unfollowButton: {
padding: "9px 18px",
border: "1px solid #dc3545",
borderRadius: "7px",
backgroundColor: "#ffffff",
color: "#dc3545",
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
padding: "40px",
textAlign: "center",
borderRadius: "12px",
},

center: {
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
},
};

export default Users;
