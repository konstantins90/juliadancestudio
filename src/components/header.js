import React, { useState, useEffect } from "react";
import { useStaticQuery, graphql, Link } from "gatsby"
import Logo from "../assets/julia-dance-studio.svg"
import AOS from "aos"

const Header = () => {
    const data = useStaticQuery(graphql`
        query {
          site {
            siteMetadata {
              title
            }
          }
          allMdx (
            filter: {
              frontmatter: {
                slug: { ne: null }
                isPublished: { eq: true }
              } 
            }
            sort: { frontmatter: { sort: ASC } }
          ) {
            nodes {
              frontmatter {
                title
                slug
              }
            }
          }
        }
    `)

    const links = data.allMdx.nodes
    const [activeSection, setActiveSection] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [hasScrolled, setHasScrolled] = useState(false)

    useEffect(() => {
      AOS.init();

      const handleScroll = () => {
        const sections = links.map(link => document.getElementById(link.frontmatter.slug));
        const scrollPosition = window.scrollY + 100; // Offset for sticky header

        sections.forEach(section => {
          if (section && section.offsetTop <= scrollPosition && section.offsetTop + section.offsetHeight > scrollPosition) {
            setActiveSection(section.id);
          }
        });

        // Add or remove 'scroll' class based on scroll position
        if (window.scrollY > 100) {
            setHasScrolled(true);
        } else {
            setHasScrolled(false);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [links]);

    const handleClick = (e, slug) => {
      e.preventDefault();
      const targetElement = document.getElementById(slug);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 50, // Adjust for sticky header height
          behavior: "smooth",
        });
        setActiveSection(slug);
        setIsMenuOpen(false); // Close menu on link click
      }
    };

    const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
      setIsMenuOpen(false);
    };

    return (
        <header id="header" className={`sticky top-0 bg-black text-white ${hasScrolled ? 'scroll' : ''}`}>
            <div className="container mx-auto flex justify-center md:justify-between items-center py-5">
                {/* <h2 className="text-2xl">{title}</h2> */}
                <h2 className="text-2xl">
                    <Link to="/"><Logo className="logo w-[200px] h-auto" /></Link>
                </h2>
                {/* Burger Icon */}
                <div id="burger-menu" className={`${isMenuOpen ? "show" : ""} md:hidden`} onClick={toggleMenu}>
                    <button className="text-white focus:outline-none">
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>
                </div>
                {/* Navigation */}
                <nav id="nav-main" className={`${isMenuOpen ? "block show z-50" : "hidden"} md:block`}>
                    <ul className="flex gap-5 mb-0">
                        {links.map(link => (
                            <li key={link.frontmatter.slug}>
                                <a
                                  href={`#${link.frontmatter.slug}`}
                                  className={activeSection === link.frontmatter.slug ? 'active text-gold' : ''}
                                  onClick={(e) => handleClick(e, link.frontmatter.slug)}
                                >
                                  {link.frontmatter.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            {/* Overlay */}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-10"
                    onClick={closeMenu}
                ></div>
            )}
        </header>
    )
}

export default Header
