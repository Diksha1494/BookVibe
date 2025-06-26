import React from 'react'
import './Footer.css' // Import the CSS file
import footerLogo from "../assets/footer-logo.png"
import "./Footer.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section */}
      <div className="footer-container">
        {/* Left Side - Logo and Nav */}
        <div className="footer-left">
          <img src={footerLogo} alt="Logo" className="footer-logo" />
          <ul className="footer-nav">
            <li><a href="#home" style={{ textDecoration: "none" }}>Home</a></li>
            <li><a href="#services" style={{ textDecoration: "none" }}>Services</a></li>
            <li><a href="#about" style={{ textDecoration: "none" }}>About Us</a></li>
            <li><a href="#contact" style={{ textDecoration: "none" }}>Contact</a></li>
          </ul>
        </div>

        {/* Right Side - Newsletter */}
        <div className="footer-right">
          <p className="newsletter-text">
            Subscribe to our newsletter to receive the latest updates, news, and offers!
          </p>
          {/* <div className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
            />
            <button className="newsletter-button">
              Subscribe
            </button>
          </div> */}
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
  <input
    type="email"
    placeholder="Enter your email"
    className="newsletter-input"
    required
  />
  <button type="submit" className="newsletter-button">
    Subscribe
  </button>
</form>

        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        {/* Left Side - Privacy Links */}
        <ul className="footer-bottom-links">
          <li><a href="#privacy" style={{ textDecoration: "none" }}>Privacy Policy</a></li>
          <li><a href="#terms" style={{ textDecoration: "none" }}>Terms of Service</a></li>
        </ul>

        {/* Right Side - Social Icons */}
        <div className="footer-social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
