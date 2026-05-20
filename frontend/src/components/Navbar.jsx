import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineHeart, HiOutlineXMark } from "react-icons/hi2";
import { IoSearchOutline, IoMenuOutline } from "react-icons/io5";
import { HiOutlineHome, HiOutlineUser, HiOutlineShoppingCart, HiSparkles } from "react-icons/hi";
import { MdOutlineShoppingBag } from "react-icons/md";
import "./Navbar.css";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import DarkModeToggle from "../components/DarkModeToggle";
import bookvibeLogo from "../assets/bookvibe-logo.svg";

const desktopNavigation = [
  { name: "Home", href: "/", icon: HiOutlineHome },
  { name: "Orders", href: "/orders", icon: MdOutlineShoppingBag },
  { name: "BooksyAI", href: "/recommend", icon: HiSparkles },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const wishlistItems = useSelector((state) => state.cart.wishlistItems);
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const rawUserName =
    currentUser?.displayName?.trim() ||
    currentUser?.email?.split("@")[0] ||
    "User";
  const firstName = rawUserName.split(" ")[0];
  const userLabel = `Hello, ${firstName}`;

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  const handleLogOut = async () => {
    await logout();
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedSearch = searchTerm.trim();
    navigate(trimmedSearch ? `/?q=${encodeURIComponent(trimmedSearch)}` : "/");
  };

  const userLinks = currentUser
    ? [{ name: userLabel, href: "/user-dashboard", icon: HiOutlineUser }]
    : [
        { name: "User", href: "/login", icon: HiOutlineUser },
        { name: "Signup", href: "/signup", icon: HiOutlineUser },
      ];

  const resolvedDesktopNavigation = desktopNavigation.map((item) =>
    item.name === "User"
      ? {
          ...item,
          href: currentUser ? "/user-dashboard" : "/login",
        }
      : item.requiresAuth && !currentUser
        ? {
            ...item,
            href: "/login",
          }
      : item
  );

  const mobileNavigation = [...resolvedDesktopNavigation, ...userLinks];

  return (
    <header className="navbar-container">
      <nav className="navbar">
        <div className="navbar-left">
          <Link to="/" className="brand-link">
            <img src={bookvibeLogo} alt="BookVibe logo" className="brand-logo" />
          </Link>

          <form className="search-container" onSubmit={handleSearchSubmit}>
            <IoSearchOutline className="search-icon" />
            <input
              className="search-input"
              type="text"
              placeholder="Search books, author, category"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </form>

          <div className="desktop-links">
            {resolvedDesktopNavigation.map((item) => (
              <Link key={item.name} to={item.href} className="nav-text-link">
                <item.icon className="nav-item-icon" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="navbar-right">
          <DarkModeToggle />

          <Link
            to={currentUser ? "/cart" : "/login"}
            className="icon-button desktop-only cart-icon-button"
            aria-label="Cart"
          >
            <HiOutlineShoppingCart className="icon" />
            <span className="cart-count">{cartItems.length}</span>
          </Link>

          <Link
            to={currentUser ? "/wishlist" : "/login"}
            className="icon-button desktop-only wishlist-icon-button"
            aria-label="Wishlist"
          >
            <HiOutlineHeart className="icon" />
            <span className="wishlist-count">{wishlistItems.length}</span>
          </Link>

          {currentUser ? (
            <div className="user-menu desktop-only">
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                className="nav-text-link navbar-user-link is-authenticated"
              >
                <HiOutlineUser className="nav-item-icon" />
                {userLabel}
              </button>
              {userMenuOpen && (
                <div className="user-menu-dropdown">
                  <Link to="/user-dashboard" className="user-menu-item">
                    Dashboard
                  </Link>
                  <button type="button" onClick={handleLogOut} className="user-menu-item user-menu-logout">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="nav-text-link desktop-only navbar-user-link"
            >
              <HiOutlineUser className="nav-item-icon" />
              User
            </Link>
          )}

          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <HiOutlineXMark className="icon" /> : <IoMenuOutline className="icon" />}
          </button>
        </div>
      </nav>

      <div
        className={`mobile-menu-backdrop ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <span>Menu</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <HiOutlineXMark className="icon" />
          </button>
        </div>

        <div className="mobile-menu-links">
          {mobileNavigation.map((item) => (
            <Link key={item.name} to={item.href} className="mobile-link">
              <span className="mobile-link-inner">
                <item.icon className="nav-item-icon" />
                {item.name === "Cart" ? `Cart (${cartItems.length})` : item.name}
              </span>
            </Link>
          ))}
          <Link to={currentUser ? "/wishlist" : "/login"} className="mobile-link mobile-link-static">
            <span className="mobile-link-inner">
              <HiOutlineHeart className="nav-item-icon" />
              Wishlist ({wishlistItems.length})
            </span>
          </Link>
          {currentUser && (
            <button type="button" onClick={handleLogOut} className="mobile-logout-button">
              <span className="mobile-link-inner">
                <HiOutlineXMark className="nav-item-icon" />
                Logout
              </span>
            </button>
          )}
        </div>
      </aside>
    </header>
  );
};

export default Navbar;
