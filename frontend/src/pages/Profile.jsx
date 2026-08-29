import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000";

function Profile() {
const navigate = useNavigate();

const [profile, setProfile] = useState(null);
const [followingCount, setFollowingCount] = useState(0);
const [followersCount, setFollowersCount] = useState(0);

const [bio, setBio] = useState("");
const [profileImage, setProfileImage] = useState("");

const [editing, setEditing] = useState(false);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);
const [error, setError] = useState("");
const [message, setMessage] = useState("");

const token = localStorage.getItem("token");

useEffect(() => {
if (!token) {
navigate("/login");
return;
}


loadProfile();
loadFollowing();


}, []);

const loadProfile = async () => {
try {
const response = await fetch(
`${API_URL}/api/profile/`,
{
headers: {
Authorization: `Token ${token}`,
},
}
);


  const data = await response.json();

  if (!response.ok) {
    setError(
      data.error ||
        data.detail ||
        "Unable to load profile."
    );
    setLoading(false);
    return;
  }

  setProfile(data);
  setBio(data.bio || "");
  setProfileImage(data.profile_image || "");
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

  if (!response.ok) {
    return;
  }

  setFollowingCount(data.length);

  await loadFollowers();
} catch (error) {
  console.log("Unable to load following.");
}


};

const loadFollowers = async () => {
try {
const response = await fetch(
`${API_URL}/api/users/`,
{
headers: {
Authorization: `Token ${token}`,
},
}
);


  const users = await response.json();

  if (!response.ok) {
    return;
  }

  const currentUserId = profile?.user?.id;

  if (!currentUserId) {
    return;
  }

  let count = 0;

  for (const user of users) {
    try {
      const followResponse = await fetch(
        `${API_URL}/api/likes/follow/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (followResponse.ok) {
        const followData =
          await followResponse.json();

        count = followData.filter(
          (item) =>
            item.following === currentUserId
        ).length;
      }

      break;
    } catch (error) {
      break;
    }
  }

  setFollowersCount(count);
} catch (error) {
  console.log("Unable to load followers.");
}


};

const handleSave = async () => {
setSaving(true);
setError("");
setMessage("");


try {
  const response = await fetch(
    `${API_URL}/api/profile/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({
        bio: bio,
        profile_image: profileImage,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    setError(
      data.error ||
        data.detail ||
        "Unable to update profile."
    );
    setSaving(false);
    return;
  }

  setProfile(data);
  setBio(data.bio || "");
  setProfileImage(data.profile_image || "");

  setMessage("Profile updated successfully.");
  setEditing(false);
} catch (error) {
  setError("Unable to connect to the server.");
}

setSaving(false);


};

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("user");


navigate("/login");


};

if (loading) {
return ( <div style={styles.center}> <h2>Loading profile...</h2> </div>
);
}

if (!profile) {
return ( <div style={styles.center}> <h2>Profile not found.</h2>
<button
onClick={() => navigate("/home")}
style={styles.button}
>
Go Home </button> </div>
);
}

return ( <div style={styles.page}>


  <header style={styles.header}>

    <h1 style={styles.logo}>
      Social Media
    </h1>

    <div style={styles.nav}>

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
        onClick={() => navigate("/create-post")}
      >
        Create Post
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

    <div style={styles.profileCard}>

      <div style={styles.profileTop}>

        {profileImage ? (
          <img
            src={profileImage}
            alt="Profile"
            style={styles.profileImage}
          />
        ) : (
          <div style={styles.avatar}>
            {profile.user.username
              .charAt(0)
              .toUpperCase()}
          </div>
        )}

        <div style={styles.userInfo}>

          <h2>
            {profile.user.username}
          </h2>

          <p>
            {profile.user.email}
          </p>

        </div>

      </div>

      <div style={styles.stats}>

        <div style={styles.stat}>
          <strong>
            {followersCount}
          </strong>
          <span>Followers</span>
        </div>

        <div style={styles.stat}>
          <strong>
            {followingCount}
          </strong>
          <span>Following</span>
        </div>

      </div>

      <div style={styles.bioSection}>

        <h3>Bio</h3>

        {!editing ? (
          <p style={styles.bio}>
            {profile.bio
              ? profile.bio
              : "No bio added yet."}
          </p>
        ) : (
          <textarea
            value={bio}
            onChange={(event) =>
              setBio(event.target.value)
            }
            placeholder="Write something about yourself..."
            style={styles.textarea}
            rows="4"
          />
        )}

      </div>

      {editing && (
        <div style={styles.editSection}>

          <label>
            Profile Image URL
          </label>

          <input
            type="text"
            value={profileImage}
            onChange={(event) =>
              setProfileImage(
                event.target.value
              )
            }
            placeholder="Paste image URL"
            style={styles.input}
          />

        </div>
      )}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {message && (
        <div style={styles.success}>
          {message}
        </div>
      )}

      {!editing ? (
        <button
          style={styles.editButton}
          onClick={() => {
            setMessage("");
            setEditing(true);
          }}
        >
          Edit Profile
        </button>
      ) : (
        <div style={styles.actions}>

          <button
            style={styles.saveButton}
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <button
            style={styles.cancelButton}
            onClick={() => {
              setBio(profile.bio || "");
              setProfileImage(
                profile.profile_image || ""
              );
              setEditing(false);
            }}
          >
            Cancel
          </button>

        </div>
      )}

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
boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
position: "sticky",
top: 0,
zIndex: 10,
},

logo: {
margin: 0,
color: "#4f46e5",
},

nav: {
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
maxWidth: "700px",
margin: "0 auto",
padding: "40px 20px",
},

profileCard: {
backgroundColor: "#ffffff",
borderRadius: "15px",
padding: "30px",
boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
},

profileTop: {
display: "flex",
alignItems: "center",
gap: "20px",
},

profileImage: {
width: "100px",
height: "100px",
borderRadius: "50%",
objectFit: "cover",
},

avatar: {
width: "100px",
height: "100px",
borderRadius: "50%",
backgroundColor: "#4f46e5",
color: "#ffffff",
display: "flex",
justifyContent: "center",
alignItems: "center",
fontSize: "40px",
fontWeight: "bold",
flexShrink: 0,
},

userInfo: {
flex: 1,
},

stats: {
display: "flex",
justifyContent: "center",
gap: "80px",
marginTop: "30px",
padding: "20px 0",
borderTop: "1px solid #eeeeee",
borderBottom: "1px solid #eeeeee",
},

stat: {
display: "flex",
flexDirection: "column",
alignItems: "center",
gap: "5px",
},

bioSection: {
marginTop: "25px",
},

bio: {
color: "#555555",
lineHeight: "1.6",
},

textarea: {
width: "100%",
padding: "12px",
border: "1px solid #cccccc",
borderRadius: "8px",
resize: "vertical",
fontSize: "15px",
boxSizing: "border-box",
},

editSection: {
marginTop: "20px",
},

input: {
width: "100%",
padding: "12px",
marginTop: "8px",
border: "1px solid #cccccc",
borderRadius: "8px",
boxSizing: "border-box",
},

editButton: {
width: "100%",
marginTop: "25px",
padding: "12px",
border: "none",
borderRadius: "8px",
backgroundColor: "#4f46e5",
color: "#ffffff",
fontWeight: "bold",
cursor: "pointer",
},

actions: {
display: "flex",
gap: "10px",
marginTop: "25px",
},

saveButton: {
flex: 1,
padding: "12px",
border: "none",
borderRadius: "8px",
backgroundColor: "#4f46e5",
color: "#ffffff",
fontWeight: "bold",
cursor: "pointer",
},

cancelButton: {
flex: 1,
padding: "12px",
border: "1px solid #cccccc",
borderRadius: "8px",
backgroundColor: "#ffffff",
cursor: "pointer",
},

error: {
marginTop: "15px",
padding: "12px",
borderRadius: "8px",
backgroundColor: "#fdecec",
color: "#b42318",
},

success: {
marginTop: "15px",
padding: "12px",
borderRadius: "8px",
backgroundColor: "#e8f7ee",
color: "#16733b",
},

button: {
padding: "10px 20px",
border: "none",
borderRadius: "8px",
backgroundColor: "#4f46e5",
color: "#ffffff",
cursor: "pointer",
},

center: {
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
flexDirection: "column",
gap: "15px",
},
};

export default Profile;
