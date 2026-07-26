"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FiHome, FiInfo, FiBriefcase, FiStar, FiUsers, FiMail, FiMenu, FiX, FiChevronRight } from 'react-icons/fi'
import styles from './Header.module.css'
import logoMark from '../images/Logo.svg'

const navLinks = [
  { href: '#accueil', label: 'Accueil', icon: FiHome },
  { href: '#apropos', label: 'Présentation', icon: FiInfo },
  { href: '#services', label: 'Nos domaines', icon: FiBriefcase },
  { href: '#realisations', label: 'Réalisations', icon: FiStar },
  { href: '#references', label: 'Références', icon: FiUsers },
  { href: '#contact', label: 'Contact', icon: FiMail },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Effet d'ombre/translucidité au défilement
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.headerContainer}>
        <Link href="#accueil" className={styles.brand}>
          <div className={styles.logoWrapper}>
            <Image 
              src={logoMark} 
              alt="Logo EURL Romaïsa Liray" 
              width={42} 
              height={42} 
              priority 
            />
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandSmall}>EURL</span>
            <span className={styles.brandLarge}>ROMAISA LIRAY</span>
          </div>
        </Link>

        <nav className={styles.desktopNav}>
          <ul className={styles.navList}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={styles.navLink}>
                  <span className={styles.navIcon}>
                    <link.icon />
                  </span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Button & Toggle Mobile */}
        <div className={styles.headerActions}>
          

          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      <div className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}>
        <nav className={styles.mobileNavContainer}>
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className={styles.mobileNavLink}
              onClick={() => setIsMenuOpen(false)}
            >
              <div className={styles.mobileNavContent}>
                <span className={styles.navIcon}>
                  <link.icon />
                </span>
                <span>{link.label}</span>
              </div>
              <span className={styles.mobileChevron}>
                <FiChevronRight />
              </span>
            </Link>
          ))}
          
        </nav>
      </div>
    </header>
  )
}