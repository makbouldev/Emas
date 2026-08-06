import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import heroImage from '../assets/hero.jpeg';
import Seo from '../components/Seo';
import { resolveMediaPath } from '../utils/resolveMediaPath';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildOrganizationSchema,
  buildWebPageSchema,
  buildWebsiteSchema
} from '../seo/schemas';

const homeFaqs = [
  { q: 'EMAS Nettoyage intervient-elle 7j/7 ?', a: 'Oui, nos equipes organisent des interventions rapides selon vos horaires, pour domicile, bureaux, commerces et chantiers.' },
  { q: 'Quels services de nettoyage proposez-vous ?', a: 'Nettoyage a domicile, bureaux, fin de chantier, vitrerie, tapis, canapes, espaces communs et desinfection.' },
  { q: 'Intervenez-vous pour les evenements ?', a: 'Oui, nous assurons le nettoyage avant, pendant et apres les evenements, salons, receptions, chantiers et sites professionnels.' },
  { q: 'Pouvez-vous proposer un contrat regulier ?', a: 'Oui, nous preparons un planning d entretien quotidien, hebdomadaire ou mensuel avec controle qualite.' }
];


function AnimatedStatValue({ value }) {
  const valueRef = useRef(null);
  const isInView = useInView(valueRef, { once: true, amount: 0.2 });
  const [displayValue, setDisplayValue] = useState(value);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const match = value.match(/(\d+(?:[.,]\d+)?)/);
    if (!isInView || !match) {
      return;
    }

    const numericRaw = match[0].replace(/,/g, '');
    const target = Number(numericRaw);
    if (Number.isNaN(target)) {
      return;
    }

    const hasDecimal = numericRaw.includes('.');
    const decimals = hasDecimal ? numericRaw.split('.')[1].length : 0;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + match[0].length);
    const duration = 1900;
    let rafId;

    const formatNumber = (num) => {
      const fixed = decimals > 0 ? num.toFixed(decimals) : Math.round(num);
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }).format(Number(fixed));
    };

    setIsRunning(true);
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = target * eased;
      setDisplayValue(`${prefix}${formatNumber(current)}${suffix}`);
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
        setIsRunning(false);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [isInView, value]);

  return <span ref={valueRef} className={isRunning ? 'count-pop' : ''}>{displayValue}</span>;
}

function getStatIcon(label, index) {
  const text = label.toLowerCase();
  if (text.includes('espace') || text.includes('nettoy')) return 'bi bi-stars';
  if (text.includes('intervention')) return 'bi bi-calendar-check';
  if (text.includes('agent') || text.includes('equipe') || text.includes('equipes')) return 'bi bi-people-fill';
  if (text.includes('client') || text.includes('satisf')) return 'bi bi-hand-thumbs-up-fill';
  if (text.includes('dispatch')) return 'bi bi-activity';
  if (text.includes('response') || text.includes('time')) return 'bi bi-stopwatch-fill';
  if (text.includes('cities') || text.includes('covered')) return 'bi bi-geo-alt-fill';
  const fallback = ['bi bi-stars', 'bi bi-shield-check', 'bi bi-graph-up-arrow', 'bi bi-brush-fill'];
  return fallback[index % fallback.length];
}

function HomePage() {
  const { content, apiBaseUrl } = useSiteData();
  const [openFaq, setOpenFaq] = useState(0);
  const phoneDigits = (content.phone || '').replace(/[^\d+]/g, '');
  const whatsappDigits = (content.phone || '').replace(/\D/g, '');
  const resolvedHeroImage = content?.hero?.backgroundImage
    ? resolveMediaPath(content.hero.backgroundImage, apiBaseUrl)
    : heroImage;

  const openQuickBookPanel = (detail, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    // Dispatch on both window and document for better compatibility across browsers.
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('cmpf-open-book-panel', { detail }));
      document.dispatchEvent(new CustomEvent('cmpf-open-book-panel', { detail }));
    }, 0);
  };

  const leftFaqs = homeFaqs.slice(0, Math.ceil(homeFaqs.length / 2));
  const rightFaqs = homeFaqs.slice(Math.ceil(homeFaqs.length / 2));


  const googleStyleReviews = useMemo(
    () =>
      content.testimonials.map((item, index) => ({
        ...item,
        date: ['il y a 2 jours', 'il y a 1 semaine', 'il y a 2 semaines'][index % 3],
        badge: ['Guide Local', 'Utilisateur Verifie', 'Guide Local'][index % 3],
        avatar: `https://i.pravatar.cc/100?img=${index + 12}`
      })),
    [content.testimonials]
  );
  const featuredReview = googleStyleReviews[0];
  const compactReviews = googleStyleReviews.slice(1);

  return (
    <>
      <Seo
        title="Nettoyage Professionnel pour Domiciles et Entreprises"
        description="EMAS Nettoyage intervient pour entretien, grand nettoyage, nettoyage bureaux, fin de chantier, vitres, tapis, canapes et desinfection au Maroc."
        path="/"
        image="hero.jpeg"
        keywords="nettoyage maroc, nettoyage casablanca, nettoyage bureaux, grand nettoyage, nettoyage fin de chantier, societe de nettoyage"
        structuredData={[
          buildOrganizationSchema(content),
          buildWebsiteSchema(),
          buildWebPageSchema({
            name: 'Accueil EMAS Nettoyage',
            path: '/',
            description: 'Services de nettoyage professionnel pour particuliers et entreprises au Maroc.'
          }),
          buildBreadcrumbSchema([{ name: 'Accueil', path: '/' }]),
          buildFaqSchema(homeFaqs)
        ]}
      />
      <section className="hero-section" style={{ backgroundImage: `url(${resolvedHeroImage})` }}>
        <div className="hero-overlay" />
        <div className="container position-relative">
          <motion.div className="hero-content" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
            <h1>{content.hero.title}</h1>
            <p>{content.hero.subtitle}</p>
            <div className="hero-urgency-note">
              <i className="bi bi-stars" />
              <span>Nettoyage Rapide - Devis et Planning Flexibles</span>
            </div>
            <div className="hero-actions-wrap">
              <a className="hero-action-btn hero-call-btn" href={`tel:${phoneDigits}`}>
                <i className="bi bi-telephone-fill" />
                <span>Appeler: 07 71 01 44 47</span>
              </a>
              <a className="hero-action-btn hero-wa-btn" href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer">
                <i className="bi bi-whatsapp" />
                <span>WhatsApp: 07 71 01 44 47</span>
              </a>
            </div>
            <div className="hero-secondary-action">
              <Link to="/services" className="btn btn-light">{content.hero.ctaSecondary}</Link>
            </div>
          </motion.div>
        </div>
        <div className="hero-wave" />
      </section>

      <div className="home-creative">
      <section className="section services-section">
        <div className="container">
          <h2 className="section-title">Services de Nettoyage</h2>
          <div className="row g-4 mt-2">
            {content.services.slice(0, 4).map((service, idx) => (
              <motion.div key={service.title} className="col-12 col-md-6 col-lg-3" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <div className="service-card h-100">
                  <i className={`bi ${service.icon} service-icon`} />
                  <h5>{service.title}</h5>
                  <p>{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-about-premium">
        <div className="container">
          <h2 className="section-title">Qui Sommes-Nous ?</h2>
          <p className="home-about-lead text-center">EMAS Nettoyage accompagne les particuliers, entreprises, syndics et commerces avec des prestations propres, flexibles et controlees.</p>
          <div className="row g-4 mt-2 align-items-stretch">
            <div className="col-lg-5">
              <div className="about-photo-wrap h-100">
                <img
                  src={resolvedHeroImage}
                  alt="EMAS Nettoyage service"
                  className="about-photo"
                />
              </div>
            </div>
            <div className="col-lg-7">
              <div className="row g-3">
                <div className="col-md-6"><div className="about-premium-card h-100"><span className="about-badge">Intervention</span><span className="about-card-icon"><i className="bi bi-shield-check" /></span><h5>Rapide et Structuree</h5><p>Visite, devis, planning et intervention selon la taille du lieu et le niveau de nettoyage demande.</p></div></div>
                <div className="col-md-6"><div className="about-premium-card h-100"><span className="about-badge">Equipe</span><span className="about-card-icon"><i className="bi bi-people-fill" /></span><h5>Agents Qualifies</h5><p>Mobilisation d agents formes avec superviseur pour les interventions sensibles ou volumineuses.</p></div></div>
                <div className="col-md-6"><div className="about-premium-card h-100"><span className="about-badge">Domicile</span><span className="about-card-icon"><i className="bi bi-globe2" /></span><h5>Maisons et Appartements</h5><p>Nettoyage regulier, grand menage, cuisine, sanitaires, vitres, tapis et canapes.</p></div></div>
                <div className="col-md-6"><div className="about-premium-card h-100"><span className="about-badge">Professionnel</span><span className="about-card-icon"><i className="bi bi-cpu-fill" /></span><h5>Couverture Complete</h5><p>Bureaux, commerces, chantiers, syndics et evenements avec controle qualite.</p></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="ops-section" className="section cmpf-ops-section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <motion.div
              className="col-lg-7"
              initial={{ opacity: 0, x: -34 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65 }}
            >
              <h2 className="section-title text-start mb-3">Equipe EMAS Nettoyage: Organisation, Qualite et Fiabilite</h2>
              <p className="section-copy mb-3">
                EMAS Nettoyage planifie chaque passage, prepare les produits adaptes et controle le resultat.
              </p>
              <p className="section-copy mb-4">
                Nos agents interviennent avec methode et discretion pour livrer des espaces propres et agreables.
              </p>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="ops-mini-card h-100">
                    <i className="bi bi-activity" />
                    <h6>Planning Clair</h6>
                    <p>Organisation des passages selon vos contraintes et priorites.</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="ops-mini-card h-100">
                    <i className="bi bi-stopwatch-fill" />
                    <h6>Intervention Rapide</h6>
                    <p>Equipe disponible pour nettoyage ponctuel ou contrat regulier.</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="ops-mini-card h-100">
                    <i className="bi bi-shield-check" />
                    <h6>Service Fiable</h6>
                    <p>Methodes de nettoyage claires, controle final et respect des lieux.</p>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="ops-mini-card h-100">
                    <i className="bi bi-people-fill" />
                    <h6>Equipe Encadree</h6>
                    <p>Agents formes, supervises et informes des attentes de chaque client.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-lg-5"
              initial={{ opacity: 0, x: 34 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.08 }}
            >
              <div className="ops-photo-grid">
                <div className="ops-photo-main">
                  <img
                    src="7.jpeg"
                    alt="Equipe EMAS Nettoyage avec aspirateur professionnel"
                  />
                </div>
                <div className="ops-photo-small ops-photo-small-top">
                  <img
                    src="1.jpeg"
                    alt="Nettoyage soigne d une cuisine"
                  />
                </div>
                <div className="ops-photo-small ops-photo-small-bottom">
                  <img
                    src="6.jpeg"
                    alt="Desinfection professionnelle des surfaces"
                  />
                </div>
                <div className="ops-photo-badge">
                  <span className="d-block">Controle Qualite</span>
                  <strong>7j/7</strong>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section stats-band">
        <div className="container">
          <div className="stats-header text-center mb-4">
            <h2 className="section-title text-white mb-2">EMAS Nettoyage en Chiffres</h2>
            <p className="stats-subtitle mb-0">Des indicateurs qui montrent le volume d interventions, la qualite des equipes et la satisfaction client.</p>
          </div>
          <div className="row g-4">
            {content.stats.map((item, index) => (
              (() => {
                const normalizedLabel = String(item.label || '').toLowerCase();
                const safeValue = normalizedLabel.includes('service disponible') ? '7j/7' : item.value;
                return (
              <motion.div
                className="col-6 col-lg-3"
                key={item.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
              >
                <div className="stat-card text-center h-100">
                  <div className="stat-icon-badge"><i className={getStatIcon(item.label, index)} /></div>
                  <div className="stat-value"><AnimatedStatValue value={safeValue} /></div>
                  <div className="stat-label">{item.label}</div>
                </div>
              </motion.div>
                );
              })()
            ))}
          </div>
        </div>
      </section>



      <section className="section reviews-creative-section">
        <div className="container">
          <h2 className="section-title">Avis Clients</h2>
          <p className="reviews-subtitle">Avec EMAS Nettoyage, chaque espace retrouve une sensation propre, saine et accueillante.</p>
          {featuredReview && (
            <div className="reviews-studio mt-4">
              <motion.article
                className="review-feature-card"
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55 }}
              >
                <div className="review-feature-top">
                  <div className="review-person-pill">
                    <img src={featuredReview.avatar} alt={featuredReview.name} className="review-avatar" />
                    <div>
                      <h6>{featuredReview.name}</h6>
                      <span>{featuredReview.role}</span>
                    </div>
                  </div>
                  <div className="review-score">
                    <strong>5.0</strong>
                    <span>Note client</span>
                  </div>
                </div>

                <div className="review-feature-stars">
                  <i className="bi bi-star-fill" />
                  <i className="bi bi-star-fill" />
                  <i className="bi bi-star-fill" />
                  <i className="bi bi-star-fill" />
                  <i className="bi bi-star-fill" />
                </div>
                <p className="review-feature-text">"{featuredReview.text}"</p>

                <div className="review-feature-footer">
                  <span><i className="bi bi-patch-check-fill" /> Avis verifie</span>
                  <span>{featuredReview.date}</span>
                </div>
              </motion.article>

              <div className="reviews-side-stack">
                {compactReviews.map((person, index) => (
                  <motion.article
                    className="review-note-card"
                    key={person.name}
                    initial={{ opacity: 0, x: 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.08 * index }}
                  >
                    <div className="review-note-top">
                      <img src={person.avatar} alt={person.name} className="review-note-avatar" />
                      <div>
                        <h6>{person.name}</h6>
                        <span>{person.role}</span>
                      </div>
                      <i className="bi bi-quote review-note-quote" />
                    </div>
                    <p>"{person.text}"</p>
                    <div className="review-note-footer">
                      <span><i className="bi bi-star-fill" /> 5/5</span>
                      <small>{person.date}</small>
                    </div>
                  </motion.article>
                ))}
              </div>

              <motion.div
                className="reviews-quality-strip"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, delay: 0.12 }}
              >
                <span><i className="bi bi-stars" /> Proprete</span>
                <span><i className="bi bi-clock-history" /> Ponctualite</span>
                <span><i className="bi bi-shield-check" /> Discretion</span>
              </motion.div>
            </div>
          )}
        </div>
      </section>

      <section className="section light-area">
        <div className="container">
          <h2 className="section-title">Les Questions Frequentes</h2>
          <div className="row g-3 mt-2">
            <div className="col-md-6">
              {leftFaqs.map((item, idx) => {
                const questionIndex = idx;
                const isOpen = openFaq === questionIndex;
                return (
                  <div className={`faq-item faq-clickable mb-3 ${isOpen ? 'open' : ''}`} key={item.q}>
                    <button type="button" className="faq-toggle" onClick={() => setOpenFaq(isOpen ? -1 : questionIndex)}>
                      <span>{item.q}</span>
                      <i className={`bi ${isOpen ? 'bi-dash-lg' : 'bi-plus-lg'}`} />
                    </button>
                    {isOpen && <p className="faq-answer">{item.a}</p>}
                  </div>
                );
              })}
            </div>
            <div className="col-md-6">
              {rightFaqs.map((item, idx) => {
                const questionIndex = idx + leftFaqs.length;
                const isOpen = openFaq === questionIndex;
                return (
                  <div className={`faq-item faq-clickable mb-3 ${isOpen ? 'open' : ''}`} key={item.q}>
                    <button type="button" className="faq-toggle" onClick={() => setOpenFaq(isOpen ? -1 : questionIndex)}>
                      <span>{item.q}</span>
                      <i className={`bi ${isOpen ? 'bi-dash-lg' : 'bi-plus-lg'}`} />
                    </button>
                    {isOpen && <p className="faq-answer">{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Nettoyage Evenementiel et Professionnel</h2>
          <div className="row g-4 mt-2">
            <div className="col-md-4"><div className="partner-card h-100"><h5>Congres et Salons</h5><p>Equipe de nettoyage avant ouverture, pendant l evenement et apres fermeture.</p></div></div>
            <div className="col-md-4"><div className="partner-card h-100"><h5>Evenements Sportifs et Culturels</h5><p>Gestion des dechets, sanitaires, zones publiques et remise en etat rapide.</p></div></div>
            <div className="col-md-4"><div className="partner-card h-100"><h5>Chantiers et Sites Professionnels</h5><p>Nettoyage technique, poussiere fine, vitres, sols et preparation avant livraison.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container text-center">
          <h2>Besoin d un nettoyage rapide ?</h2>
          <p className="mb-4">EMAS Nettoyage intervient pour domicile, bureaux, chantiers, vitres et desinfection.</p>
          <Link
            to="/contact"
            className="btn btn-emergency"
            onClick={(event) =>
              openQuickBookPanel(
                {
                  title: 'Cellule Devis Nettoyage',
                  copy: 'Appelez-nous ou ecrivez sur WhatsApp. Nous vous aidons a choisir le service et le planning adaptes.'
                },
                event
              )
            }
          >
            Demander un Devis
          </Link>
        </div>
      </section>
      </div>
    </>
  );
}

export default HomePage;
