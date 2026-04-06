'use client';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    setMenuOpen((prev) => {
      document.body.style.overflow = !prev ? 'hidden' : '';
      return !prev;
    });
  }

  return (
    <>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobileMenu">
        <a href="#about" onClick={closeMenu}>About</a>
        <a href="#verticals" onClick={closeMenu}>Ventures</a>
        <a href="#team" onClick={closeMenu}>Team</a>
        <a href="#contact" onClick={closeMenu}>Contact</a>
      </div>

      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav__inner">
          <a href="#" className="nav__logo">House of H<span>.</span></a>
          <ul className="nav__links">
            <li><a href="#about">About</a></li>
            <li><a href="#verticals">Ventures</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <div className="nav__cta">
            <a href="tel:+919945720417" className="btn btn--outline" style={{ padding: '.65rem 1.4rem' }}>+91 99457 20417</a>
          </div>
          <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </>
  );
}
