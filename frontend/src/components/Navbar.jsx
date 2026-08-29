import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

    window.location.reload();
  };

  return (
    <nav className="navbar">

      <div className="navbar-container">

        <Link to="/home" className="navbar-brand">
          Social Media
        </Link>

        <div className="navbar-links">

          <Link to="/home">
            Home
          </Link>

          <Link to="/profile">
            Profile
          </Link>

          {user && (
            <span className="navbar-user">
              @{user.username}
            </span>
          )}

          <button
            onClick={handleLogout}
            className="logout-button"
          >
            Logout
          </button>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;