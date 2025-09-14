import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const nav = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    nav("/login");
  };

  return (
    <nav className="navbar">
      {/* Brand */}
      <div className="brand">
        <Link to="/">PDF Annotator</Link>
      </div>

      {/* Hamburger (mobile) */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Menu */}
      <div className={`nav-links ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <span className="mr">{user.email}</span>
            <Link to="/upload" className="btn" onClick={() => setMenuOpen(false)}>
              Upload
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="btn"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="btn"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn"
              onClick={() => setMenuOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
