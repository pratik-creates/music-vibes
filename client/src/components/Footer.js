import React from 'react';
// Lucide ki jagah react-bootstrap-icons ka istemal karein
import { Github, Linkedin, TwitterX } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom'; // Normal <a> ki jagah <Link>
import './Footer.css';

function Footer() {
    return (
        <footer className="app-footer mt-auto p-3">
            <div className="container-fluid">
                <div className="row align-items-center">
                    <div className="col-md-4 text-center text-md-start">
                        <p className="mb-0 text-secondary small">&copy; {new Date().getFullYear()} MusicVibes. All Rights Reserved.</p>
                    </div>
                    <div className="col-md-4 text-center my-2 my-md-0">
                        <Link to="/" className="footer-logo text-decoration-none">
                            <span className="purple-text">Music</span>Vibes
                        </Link>
                    </div>
                    <div className="col-md-4 text-center text-md-end">
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon me-3"><Github size={20} /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon me-3"><Linkedin size={20} /></a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon"><TwitterX size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;