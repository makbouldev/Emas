import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSiteData } from '../context/SiteDataContext';
import logo from '../assets/logo.png';
import ChatAssistant from './ChatAssistant';

function SiteShell() {
  const { content } = useSiteData();
  const location = useLocation();
  const [showQuickBook, setShowQuickBook] = useState(false);
  const [quickBookData, setQuickBookData] = useState(null);
  const phones = Array.isArray(content.phones) && content.phones.length ? content.phones : [content.phone];
  const phoneRaw = content.phone || '';
  const phoneDigits = phoneRaw.replace(/[^\d+]/g, '');
  const whatsappDigits = phoneRaw.replace(/\D/g, '');
  const activeBookPhone = quickBookData?.phone || content.phone || '';
  const activeBookEmail = quickBookData?.email || content.email || '';
  const activeBookAddress = quickBookData?.address || '';
  const activeBookMessage = quickBookData?.message || 'Demande de devis nettoyage.';
  const activeBookPhoneDigits = activeBookPhone.replace(/[^\d+]/g, '');
  const activeBookWhatsappDigits = activeBookPhone.replace(/\D/g, '');
  const activeBookTitle = quickBookData?.title || 'Cellule Devis Nettoyage';
  const activeBookCopy =
    quickBookData?.copy ||
    'Appelez-nous ou ecrivez sur WhatsApp. Notre equipe vous repond rapidement pour planifier une intervention de nettoyage.';

  const quickLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/services', label: 'Services' },
    { to: '/gallery', label: 'Galerie' },
    { to: '/contact', label: 'Contact' }
  ];

  const serviceLinks = [
    'Nettoyage a domicile',
    'Nettoyage bureaux',
    'Grand nettoyage',
    'Nettoyage fin de chantier',
    'Vitrerie et facades'
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  useEffect(() => {
    const selector = '.service-card, .long-card, .partner-card, .faq-item, .fleet-card, .partners-strip, .review-feature-card, .review-note-card, .reviews-quality-strip, .number-card, .about-premium-card, .timeline-card, .testimonial-card, .blog-card';
    const nodes = Array.from(document.querySelectorAll(selector));

    nodes.forEach((node) => node.classList.add('scroll-fade-up'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const openQuickBook = (event) => {
      setQuickBookData(event?.detail || null);
      setShowQuickBook(true);
    };
    window.addEventListener('cmpf-open-book-panel', openQuickBook);
    document.addEventListener('cmpf-open-book-panel', openQuickBook);
    return () => {
      window.removeEventListener('cmpf-open-book-panel', openQuickBook);
      document.removeEventListener('cmpf-open-book-panel', openQuickBook);
    };
  }, []);

  return (
    <div className="cmpf-site">
      <header className="top-bar py-2">
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span><i className="bi bi-telephone me-2" />{phones.join(' | ')}</span>
          <span><i className="bi bi-envelope me-2" />{content.email}</span>
        </div>
      </header>

      <nav className="navbar navbar-expand-lg sticky-top cmpf-nav">
        <div className="container">
          <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
            <img src={logo} alt={`${content.company} logo`} className="brand-logo" />
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#cmpfMenu">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="cmpfMenu">
            <ul className="navbar-nav ms-auto gap-lg-2">
              <li className="nav-item"><NavLink className="nav-link" to="/">Accueil</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/services">Services</NavLink></li>
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#!" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Services aux Entreprises
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/services-entreprises/nettoyage-sites-professionnels">
                      Nettoyage Sites Professionnels
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/services-entreprises/audit-hygiene">
                      Audit Hygiene et Proprete
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item"><NavLink className="nav-link" to="/gallery">Galerie</NavLink></li>
            </ul>
            <NavLink className="nav-contact-cta ms-lg-3 mt-3 mt-lg-0" to="/contact">
              <i className="bi bi-telephone-fill" />
              <span>Contact</span>
            </NavLink>
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="site-footer-creative">
        <div className="footer-glow footer-glow-left" />
        <div className="footer-glow footer-glow-right" />
        <div className="container position-relative">
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="footer-brand-card h-100">
                <div className="footer-logo-wrap">
                  <img src={logo} alt={`${content.company} logo`} className="footer-logo-img" />
                  <div>
                    <h4 className="mb-0 notranslate" translate="no">EMAS Nettoyage</h4>
                    <small>Nettoyage Professionnel</small>
                  </div>
                </div>
                <p className="mt-3 mb-3">Nettoyage complet pour maisons, bureaux, commerces, chantiers, vitres, textiles et espaces communs.</p>
                <div className="footer-socials">
                  <a href="#!" aria-label="facebook"><i className="bi bi-facebook" /></a>
                  <a href="#!" aria-label="instagram"><i className="bi bi-instagram" /></a>
                  <a href="#!" aria-label="youtube"><i className="bi bi-youtube" /></a>
                  <a href="#!" aria-label="whatsapp"><i className="bi bi-whatsapp" /></a>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <h6 className="footer-title">Liens Rapides</h6>
              <ul className="footer-links">
                {quickLinks.map((item) => (
                  <li key={item.to}><NavLink to={item.to}>{item.label}</NavLink></li>
                ))}
              </ul>
            </div>

            <div className="col-md-6 col-lg-4">
              <h6 className="footer-title">Services Nettoyage</h6>
              <ul className="footer-links">
                {serviceLinks.map((item) => (
                  <li key={item}><span>{item}</span></li>
                ))}
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            <span>(c) {new Date().getFullYear()} {content.company}. Tous droits reserves.</span>
            <span>Nettoyage, entretien et desinfection pour particuliers et professionnels.</span>
          </div>
        </div>
      </footer>

      <div className="floating-actions">
        <a className="floating-btn whatsapp-btn" href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer" aria-label="WhatsApp" title="WhatsApp">
          <i className="bi bi-whatsapp" />
        </a>
        <a className="floating-btn call-btn" href={`tel:${phoneDigits}`} aria-label="Appeler" title="Appeler">
          <i className="bi bi-telephone-fill" />
        </a>
      </div>

      {showQuickBook && (
        <div className="quick-book-overlay" onClick={() => setShowQuickBook(false)}>
          <section className="quick-book-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="quick-book-close" onClick={() => setShowQuickBook(false)} aria-label="Fermer">
              <i className="bi bi-x-lg" />
            </button>
            <h4>{activeBookTitle}</h4>
            <p className="quick-book-copy">{activeBookCopy}</p>
            <div className="quick-book-row">
              <i className="bi bi-telephone-fill" />
              <a href={`tel:${activeBookPhoneDigits}`}>{activeBookPhone}</a>
            </div>
            <div className="quick-book-row">
              <i className="bi bi-envelope-fill" />
              <a href={`mailto:${activeBookEmail}`}>{activeBookEmail}</a>
            </div>
            {activeBookAddress && (
              <div className="quick-book-row">
                <i className="bi bi-geo-alt-fill" />
                <span>{activeBookAddress}</span>
              </div>
            )}
            <div className="quick-book-row">
              <i className="bi bi-chat-dots-fill" />
              <span>{activeBookMessage}</span>
            </div>
            <div className="quick-book-actions">
              <a className="quick-btn quick-wa" href={`https://wa.me/${activeBookWhatsappDigits}`} target="_blank" rel="noreferrer">
                <i className="bi bi-whatsapp" /> WhatsApp
              </a>
              <a className="quick-btn quick-call" href={`tel:${activeBookPhoneDigits}`}>
                <i className="bi bi-telephone-fill" /> Appeler
              </a>
            </div>
            <p className="quick-book-note mb-0">EMAS Nettoyage repond vite avec une equipe ponctuelle, discrete et soigneuse.</p>
          </section>
        </div>
      )}

      <ChatAssistant />
    </div>
  );
}

export default SiteShell;
