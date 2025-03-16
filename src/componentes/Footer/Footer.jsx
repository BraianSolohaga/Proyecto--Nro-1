import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, } from "react-icons/fa";
import "./Footer.css";

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-copyright">
                <p>&copy; 2023 AnimeList. Todos los derechos reservados.</p>
            </div>
            <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FaFacebook size={24} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <FaTwitter size={24} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <FaInstagram size={24} />
                </a>
            </div>
        </footer>
    );
}