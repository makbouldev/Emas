import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getServiceBySlug, detailedServices } from '../data/servicesData';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
  buildWebPageSchema
} from '../seo/schemas';

function ServiceDetailPage() {
  const { slug } = useParams();
  const { content } = useSiteData();
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const service = getServiceBySlug(slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const phoneDigits = (content?.phone || '+212 725 57 25 50').replace(/[^\d+]/g, '');
  const whatsappDigits = (content?.phone || '+212 725 57 25 50').replace(/\D/g, '');

  const openQuickBook = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.dispatchEvent(
      new CustomEvent('cmpf-open-book-panel', {
        detail: { service: service.title }
      })
    );
  };

  const otherServices = detailedServices.filter((s) => s.slug !== service.slug);

  const prevImage = () => {
    setActiveImgIndex((prev) => (prev - 1 + service.images.length) % service.images.length);
  };

  const nextImage = () => {
    setActiveImgIndex((prev) => (prev + 1) % service.images.length);
  };

  return (
    <div className="service-detail-wrapper">
      <Seo
        title={service.seoTitle}
        description={service.seoDescription}
        path={`/services/${service.slug}`}
        image={service.images[0]}
        keywords={service.seoKeywords}
        structuredData={[
          buildWebPageSchema({
            name: service.title,
            path: `/services/${service.slug}`,
            description: service.seoDescription
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Services', path: '/services' },
            { name: service.title, path: `/services/${service.slug}` }
          ]),
          buildServiceSchema({
            name: service.title,
            description: service.seoDescription,
            path: `/services/${service.slug}`,
            image: service.images[0],
            serviceType: service.title
          }),
          buildFaqSchema(service.faqs)
        ]}
      />

      {/* Hero Header */}
      <section className="service-detail-hero">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="service-breadcrumb mb-3">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/"><i className="bi bi-house-door-fill me-1" /> Accueil</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/services">Services</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {service.title}
              </li>
            </ol>
          </nav>

          <div className="row align-items-center g-4">
            <motion.div
              className="col-lg-7"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="badge service-hero-badge mb-3">
                <i className={`bi ${service.icon} me-1`} /> {service.badge}
              </span>
              <h1 className="service-hero-title mb-3">{service.heroTitle}</h1>
              <p className="service-hero-desc mb-4">{service.shortDescription}</p>

              {/* Action buttons */}
              <div className="service-hero-actions d-flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={openQuickBook}
                  className="btn btn-emergency btn-lg px-4 py-3 fw-bold rounded-pill shadow-sm"
                >
                  <i className="bi bi-file-earmark-text-fill me-2" />
                  Demander un Devis Gratuit
                </button>
                <a
                  href={`tel:${phoneDigits}`}
                  className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-pill"
                >
                  <i className="bi bi-telephone-fill me-2 text-primary" />
                  07 25 57 25 50
                </a>
                <a
                  href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(`Bonjour, je souhaite un devis pour votre service de ${service.title}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success btn-lg px-4 py-3 fw-bold rounded-pill"
                >
                  <i className="bi bi-whatsapp me-2" />
                  WhatsApp Direct
                </a>
              </div>

              {/* Key Highlights */}
              <div className="service-highlights-grid">
                {service.highlights.map((highlight, idx) => (
                  <div key={idx} className="service-highlight-chip">
                    <i className="bi bi-check-circle-fill text-success me-2" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Main Interactive Image Showcase */}
            <motion.div
              className="col-lg-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="service-detail-gallery-card">
                <div className="service-detail-img-container">
                  <img
                    src={service.images[activeImgIndex]}
                    alt={`${service.title} - Photo ${activeImgIndex + 1}`}
                    className="service-detail-main-img"
                  />
                  <div className="service-detail-badge-count">
                    {activeImgIndex + 1} / {service.images.length} Photos
                  </div>

                  {/* Left / Right Carousel Controls */}
                  <button
                    type="button"
                    className="service-gallery-nav service-gallery-prev"
                    onClick={prevImage}
                    aria-label="Photo précédente"
                  >
                    <i className="bi bi-chevron-left" />
                  </button>
                  <button
                    type="button"
                    className="service-gallery-nav service-gallery-next"
                    onClick={nextImage}
                    aria-label="Photo suivante"
                  >
                    <i className="bi bi-chevron-right" />
                  </button>
                </div>

                {/* Thumbnails row */}
                <div className="service-detail-thumbs">
                  {service.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`service-thumb-btn ${i === activeImgIndex ? 'active' : ''}`}
                      onClick={() => setActiveImgIndex(i)}
                      aria-label={`Afficher la photo ${i + 1}`}
                    >
                      <img src={img} alt={`Miniature ${i + 1}`} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Detailed Overview */}
      <section className="section bg-white py-5">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-8">
              <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
                EXCELLENCE & SAVOIR-FAIRE
              </span>
              <h2 className="section-title text-start mb-3">En Savoir Plus sur Notre Prestation de {service.title}</h2>
              <div className="service-long-description">
                <p className="lead" style={{ color: '#2d3748', lineHeight: 1.8 }}>
                  {service.detailedOverview}
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="service-quote-box p-4 rounded-4 shadow-sm text-center" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f4fe 100%)', border: '1.5px solid #bae3ff' }}>
                <i className="bi bi-shield-check text-primary" style={{ fontSize: '3rem' }} />
                <h4 className="fw-bold mt-2 mb-2" style={{ color: '#04508d' }}>Garantie de Satisfaction</h4>
                <p className="small text-muted mb-4">
                  Chaque intervention est rigoureusement contrôlée avec vous avant le départ de notre équipe.
                </p>
                <button
                  type="button"
                  onClick={openQuickBook}
                  className="btn btn-emergency w-100 py-2 fw-bold rounded-pill"
                >
                  Demander Mon Devis
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checklist - Ce que comprend notre prestation */}
      <section className="section py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              DÉTAILS DES OPÉRATIONS
            </span>
            <h2 className="section-title">Ce Que Comprend Notre Prestation</h2>
            <p className="section-copy mx-auto" style={{ maxWidth: '650px' }}>
              Une prise en charge méthodique et complète pour un résultat irréprochable jusque dans les moindres recoins.
            </p>
          </div>

          <div className="row g-4">
            {service.checklist.map((item, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="service-checklist-card h-100">
                  <div className="checklist-icon-wrap">
                    <i className="bi bi-check2-circle" />
                  </div>
                  <div>
                    <h5 className="checklist-title mb-2">{item.title}</h5>
                    <p className="checklist-desc mb-0">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipment used */}
      <section className="section bg-white py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              TECHNOLOGIE PROFESSIONNELLE
            </span>
            <h2 className="section-title">Nos Équipements & Matériel Dédié</h2>
            <p className="section-copy mx-auto" style={{ maxWidth: '650px' }}>
              Nous investissons dans des machines de pointe pour assurer une efficacité maximale et préserver vos installations.
            </p>
          </div>

          <div className="row g-4">
            {service.equipment.map((eq, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="service-equipment-card h-100 text-center">
                  <div className="equipment-icon-bubble mx-auto mb-3">
                    <i className="bi bi-tools" />
                  </div>
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>{eq.name}</h5>
                  <p className="small text-muted mb-0">{eq.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process 4 Steps */}
      <section className="section py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              MÉTHODOLOGIE ÉPROUVÉE
            </span>
            <h2 className="section-title">Notre Processus d'Intervention en 4 Étapes</h2>
            <p className="section-copy mx-auto" style={{ maxWidth: '650px' }}>
              Une organisation claire de votre première prise de contact jusqu'à la validation finale.
            </p>
          </div>

          <div className="row g-4">
            {service.process.map((p, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="service-process-card h-100">
                  <div className="process-step-num">{p.step}</div>
                  <h5 className="fw-bold mb-2">{p.title}</h5>
                  <p className="small text-muted mb-0">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section bg-white py-5">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              RÉPONSES À VOS QUESTIONS
            </span>
            <h2 className="section-title">Foire Aux Questions : {service.title}</h2>
          </div>

          <div className="accordion service-faq-accordion" id="serviceFaqAccordion">
            {service.faqs.map((faq, idx) => (
              <div className="accordion-item mb-3 border rounded-3 overflow-hidden shadow-sm" key={idx}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button fw-bold ${openFaq === idx ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                    style={{ background: openFaq === idx ? '#f0f9ff' : '#ffffff', color: '#04508d' }}
                  >
                    <i className="bi bi-question-circle me-2 text-primary" />
                    {faq.q}
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${openFaq === idx ? 'show' : ''}`}>
                  <div className="accordion-body text-secondary" style={{ lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="section cta-band text-center text-white py-5">
        <div className="container">
          <h2 className="fw-bold mb-3">Besoin d'un devis rapide pour {service.title} ?</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '650px' }}>
            Contactez EMAS Nettoyage dès maintenant. Nous vous répondons en moins d'une heure avec une estimation claire et sans engagement.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button
              type="button"
              onClick={openQuickBook}
              className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill shadow"
              style={{ color: '#04508d' }}
            >
              <i className="bi bi-calendar-check me-2" />
              Réserver / Demander un Devis
            </button>
            <a
              href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(`Bonjour, je souhaite un devis pour ${service.title}.`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-success btn-lg px-4 py-3 fw-bold rounded-pill shadow"
            >
              <i className="bi bi-whatsapp me-2" />
              WhatsApp Direct: 07 25 57 25 50
            </a>
          </div>
        </div>
      </section>

      {/* Internal Linking: Other Services */}
      <section className="section py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
                DÉCOUVREZ AUSSI
              </span>
              <h3 className="fw-bold mb-0" style={{ color: '#04508d' }}>Nos Autres Prestations de Nettoyage</h3>
            </div>
            <Link to="/services" className="btn btn-outline-primary rounded-pill fw-bold">
              Tous les services <i className="bi bi-arrow-right ms-1" />
            </Link>
          </div>

          <div className="row g-4">
            {otherServices.slice(0, 3).map((item) => (
              <div className="col-md-4" key={item.slug}>
                <div className="other-service-card h-100 bg-white rounded-4 overflow-hidden shadow-sm border">
                  <div className="other-service-img-wrap" style={{ height: '180px', overflow: 'hidden' }}>
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="p-3">
                    <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>{item.title}</h5>
                    <p className="small text-muted mb-3" style={{ height: '40px', overflow: 'hidden' }}>
                      {item.shortDescription}
                    </p>
                    <Link
                      to={`/services/${item.slug}`}
                      className="btn btn-sm btn-outline-primary w-100 rounded-pill fw-bold"
                    >
                      Voir Détails & Devis <i className="bi bi-arrow-right ms-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServiceDetailPage;
