import { useState } from 'react';
import axios from 'axios';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from '../seo/schemas';

const serviceOptions = [
  'Nettoyage de Vitres',
  'Canapés, Tapis et Moquettes',
  'Grand Ménage',
  'Nettoyage Fin de Chantier',
  'Traitement et Cristallisation des Sols',
  'Nettoyage de Bureaux et Locaux',
  'Services aux Entreprises (B2B)',
  'Nettoyage à Domicile (Maison / Villa)',
  'Autre prestation sur-mesure'
];

const contactFaqs = [
  {
    q: 'Quel est le délai pour obtenir une réponse à ma demande de devis ?',
    a: 'Notre équipe traite vos demandes immédiatement. Vous recevez une estimation claire et chiffrée par téléphone ou WhatsApp en moins d’une heure.'
  },
  {
    q: 'Intervenez-vous les week-ends et jours fériés ?',
    a: 'Oui, EMAS Nettoyage intervient 7j/7, y compris les samedis, dimanches et en horaires décalés (tôt le matin ou tard le soir) selon vos impératifs.'
  },
  {
    q: 'Fournissez-vous l’ensemble des produits et des machines ?',
    a: 'Absolument. Nos équipes arrivent avec tout le matériel professionnel nécessaire (monobrosses, injecteurs-extracteurs, perches télescopiques, aspirateurs industriels) et des produits écologiques certifiés.'
  },
  {
    q: 'Puis-je demander une visite gratuite sur place avant de m’engager ?',
    a: 'Oui, pour les chantiers, villas de grande superficie ou locaux d’entreprises, un superviseur se déplace gratuitement pour évaluer les travaux et établir un cahier des charges.'
  }
];

function ContactPage() {
  const { content, apiBaseUrl } = useSiteData();

  const [formState, setFormState] = useState({
    title: 'Demande de Devis - Nettoyage',
    service: 'Grand Ménage',
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const phoneDigits = (content?.phone || '+212 725 57 25 50').replace(/[^\d+]/g, '');
  const whatsappDigits = (content?.phone || '+212 725 57 25 50').replace(/\D/g, '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'service') {
      setFormState((prev) => ({
        ...prev,
        service: value,
        title: `Demande de Devis - ${value}`
      }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');
    setIsSuccess(false);

    try {
      // 1. Direct FormSubmit dispatch to noureddinema03@gmail.com
      await axios.post('https://formsubmit.co/ajax/noureddinema03@gmail.com', {
        title: formState.title,
        service: formState.service,
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        message: formState.message || 'Aucun message spécifié',
        _subject: `[NOUVEAU DEVIS EMAS] ${formState.title} - ${formState.name} (${formState.phone})`,
        _replyto: formState.email,
        _template: 'table'
      }).catch((err) => console.log('FormSubmit catch:', err.message));

      // 2. Also send to local backend /api/contact
      await axios.post(`${apiBaseUrl}/api/contact`, {
        title: formState.title,
        service: formState.service,
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        message: formState.message
      }).catch(() => null);

      setIsSuccess(true);
      setStatusMessage('Votre demande a été envoyée avec succès ! Notre équipe vous contactera dans les plus brefs délais.');

      // Google Ads Conversion tracking event
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18516311815/aWsdCOy1sLAdEIf-of1E'
        });
      }
    } catch (error) {
      console.error(error);
      setIsSuccess(false);
      setStatusMessage('Une erreur est survenue. N’hésitez pas à nous joindre directement par téléphone ou WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour EMAS Nettoyage, je souhaite un devis :\nNom: ${formState.name || ''}\nTél: ${formState.phone || ''}\nService: ${formState.service}\nObjet: ${formState.title}`
  );

  return (
    <div className="contact-page-wrapper">
      <Seo
        title="Contact & Demande de Devis Gratuit - EMAS Nettoyage Maroc"
        description="Contactez EMAS Nettoyage pour un devis gratuit et rapide : domicile, bureaux, fin de chantier, vitres, canapés, tapis et sols partout au Maroc. Réponse sous 1h."
        path="/contact"
        keywords="contact emas nettoyage, devis nettoyage gratuit, telephone nettoyage casablanca, societe nettoyage maroc whatsapp"
        structuredData={[
          buildWebPageSchema({
            name: 'Contact & Devis EMAS Nettoyage',
            path: '/contact',
            description: 'Formulaire de demande de devis express et coordonnées complètes de l’entreprise EMAS Nettoyage.'
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Contact', path: '/contact' }
          ]),
          buildFaqSchema(contactFaqs)
        ]}
      />

      {/* Hero Header */}
      <section className="service-detail-hero">
        <div className="container">
          <nav aria-label="breadcrumb" className="service-breadcrumb mb-3">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <a href="/"><i className="bi bi-house-door-fill me-1" /> Accueil</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Contact & Devis
              </li>
            </ol>
          </nav>

          <span className="badge service-hero-badge mb-3">
            <i className="bi bi-headset me-1" /> SUPPORT CLIENT & DEVIS 7J/7
          </span>
          <h1 className="service-hero-title mb-3">
            Contactez EMAS Nettoyage & Demandez Votre Devis
          </h1>
          <p className="service-hero-desc mb-0">
            Une question, une estimation de tarif ou une urgence de nettoyage ? 
            Remplissez notre formulaire ou joignez-nous directement par téléphone et WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="row g-4 align-items-stretch">
            {/* Left Column: Coordonnées & Réseaux Sociaux */}
            <div className="col-lg-5">
              <div className="contact-info-card-premium">
                <div>
                  <span className="badge px-3 py-2 rounded-pill mb-3" style={{ background: 'rgba(0, 210, 196, 0.2)', color: '#00f0de', border: '1px solid rgba(0, 210, 196, 0.4)' }}>
                    <i className="bi bi-geo-alt-fill me-1" /> COORDONNÉES DIRECTES
                  </span>
                  <h3 className="fw-bold mb-4">À Votre Écoute 7j/7 Partout au Maroc</h3>
                </div>

                <div className="contact-info-block">
                  <div className="contact-icon-bubble">
                    <i className="bi bi-telephone-fill" />
                  </div>
                  <div className="contact-info-text">
                    <h6>Appel Téléphonique</h6>
                    <a href={`tel:${phoneDigits}`}>07 25 57 25 50</a>
                  </div>
                </div>

                <div className="contact-info-block">
                  <div className="contact-icon-bubble" style={{ color: '#25d366', borderColor: 'rgba(37, 211, 102, 0.4)' }}>
                    <i className="bi bi-whatsapp" />
                  </div>
                  <div className="contact-info-text">
                    <h6>WhatsApp Direct</h6>
                    <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noreferrer">
                      07 25 57 25 50 (Réponse rapide)
                    </a>
                  </div>
                </div>

                <div className="contact-info-block">
                  <div className="contact-icon-bubble">
                    <i className="bi bi-envelope-at-fill" />
                  </div>
                  <div className="contact-info-text">
                    <h6>Adresse Email</h6>
                    <a href="mailto:noureddinema03@gmail.com">noureddinema03@gmail.com</a>
                  </div>
                </div>

                <div className="contact-info-block">
                  <div className="contact-icon-bubble">
                    <i className="bi bi-clock-fill" />
                  </div>
                  <div className="contact-info-text">
                    <h6>Disponibilité</h6>
                    <p>7 jours sur 7 — 24h/24 pour urgences et interventions programmées</p>
                  </div>
                </div>

                <div className="contact-info-block">
                  <div className="contact-icon-bubble">
                    <i className="bi bi-pin-map-fill" />
                  </div>
                  <div className="contact-info-text">
                    <h6>Zones d'Intervention</h6>
                    <p>Casablanca, Rabat, Mohammedia, Marrakech, Tanger et tout le Maroc</p>
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="pt-3 border-top border-white border-opacity-10 mt-auto">
                  <h6 className="text-uppercase small fw-bold mb-3" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    <i className="bi bi-share-fill me-1" /> Suivez-Nous Sur les Réseaux Sociaux
                  </h6>
                  <div className="contact-social-grid">
                    <a
                      href={`https://wa.me/${whatsappDigits}`}
                      target="_blank"
                      rel="noreferrer"
                      className="social-btn-brand whatsapp"
                      aria-label="WhatsApp EMAS Nettoyage"
                    >
                      <i className="bi bi-whatsapp" /> WhatsApp
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer"
                      className="social-btn-brand instagram"
                      aria-label="Instagram EMAS Nettoyage"
                    >
                      <i className="bi bi-instagram" /> Instagram
                    </a>
                    <a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noreferrer"
                      className="social-btn-brand facebook"
                      aria-label="Facebook EMAS Nettoyage"
                    >
                      <i className="bi bi-facebook" /> Facebook
                    </a>
                    <a
                      href="https://tiktok.com"
                      target="_blank"
                      rel="noreferrer"
                      className="social-btn-brand tiktok"
                      aria-label="TikTok EMAS Nettoyage"
                    >
                      <i className="bi bi-tiktok" /> TikTok
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      className="social-btn-brand linkedin"
                      aria-label="LinkedIn EMAS Nettoyage"
                    >
                      <i className="bi bi-linkedin" /> LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: High-End Contact / Quote Form */}
            <div className="col-lg-7">
              <div className="contact-form-card-premium h-100">
                <div className="d-flex align-items-center gap-2 mb-4">
                  <span className="quote-modal-icon">
                    <i className="bi bi-file-earmark-text-fill" />
                  </span>
                  <div>
                    <h4 className="mb-1 fw-bold" style={{ color: '#04508d' }}>
                      Formulaire de Devis en Ligne
                    </h4>
                    <p className="text-muted small mb-0">
                      Remplissez ce formulaire pour recevoir une estimation personnalisée sous 1 heure
                    </p>
                  </div>
                </div>

                {isSuccess ? (
                  <div className="quote-success-box text-center py-5">
                    <div className="quote-success-icon mx-auto mb-3">
                      <i className="bi bi-check-circle-fill text-success" />
                    </div>
                    <h3 className="fw-bold text-success mb-2">Demande Envoyée avec Succès !</h3>
                    <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '520px', lineHeight: 1.7 }}>
                      Merci <strong>{formState.name}</strong> ! Votre demande pour la prestation <strong>{formState.service}</strong> a bien été transmise à notre équipe. 
                      Nous vous recontacterons au <strong>{formState.phone}</strong> très rapidement.
                    </p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      <a
                        href={`https://wa.me/${whatsappDigits}?text=${whatsappMessage}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm"
                      >
                        <i className="bi bi-whatsapp me-2" />
                        Accélérer via WhatsApp
                      </a>
                      <button
                        type="button"
                        className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-bold"
                        onClick={() => {
                          setIsSuccess(false);
                          setFormState({
                            title: 'Demande de Devis - Nettoyage',
                            service: 'Grand Ménage',
                            name: '',
                            phone: '',
                            email: '',
                            message: ''
                          });
                        }}
                      >
                        Nouvelle Demande
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="quote-form">
                    {statusMessage && (
                      <div className="alert alert-danger py-2 small mb-3">
                        <i className="bi bi-exclamation-triangle-fill me-1" />
                        {statusMessage}
                      </div>
                    )}

                    <div className="row g-3">
                      {/* 1. Titre de la demande */}
                      <div className="col-12">
                        <label className="form-label fw-bold small text-secondary mb-1">
                          <i className="bi bi-bookmark-fill me-1 text-primary" />
                          Titre de la Demande
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formState.title}
                          onChange={handleChange}
                          required
                          className="form-control"
                          placeholder="Ex: Demande de Devis - Grand Ménage"
                        />
                      </div>

                      {/* 2. Service / Prestation souhaitée */}
                      <div className="col-md-12">
                        <label className="form-label fw-bold small text-secondary mb-1">
                          <i className="bi bi-stars me-1 text-primary" />
                          Service / Prestation Souhaitée
                        </label>
                        <select
                          name="service"
                          value={formState.service}
                          onChange={handleChange}
                          required
                          className="form-select fw-semibold"
                          style={{ color: '#04508d' }}
                        >
                          {serviceOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 3. Nom Complet */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold small text-secondary mb-1">
                          <i className="bi bi-person-fill me-1 text-primary" />
                          Nom Complet *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="form-control"
                          placeholder="Ex: Mohamed Alami"
                        />
                      </div>

                      {/* 4. Téléphone */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold small text-secondary mb-1">
                          <i className="bi bi-telephone-fill me-1 text-primary" />
                          Numéro de Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formState.phone}
                          onChange={handleChange}
                          required
                          className="form-control"
                          placeholder="Ex: 07 25 57 25 50"
                        />
                      </div>

                      {/* 5. Email */}
                      <div className="col-12">
                        <label className="form-label fw-bold small text-secondary mb-1">
                          <i className="bi bi-envelope-fill me-1 text-primary" />
                          Adresse Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="form-control"
                          placeholder="Ex: contact@exemple.com"
                        />
                      </div>

                      {/* 6. Sujet & Détails de la demande */}
                      <div className="col-12">
                        <label className="form-label fw-bold small text-secondary mb-1">
                          <i className="bi bi-chat-text-fill me-1 text-primary" />
                          Sujet & Détails de Votre Demande *
                        </label>
                        <textarea
                          name="message"
                          rows="4"
                          value={formState.message}
                          onChange={handleChange}
                          required
                          className="form-control"
                          placeholder="Précisez la superficie approximative (m²), ville ou quartier, date souhaitée, état des lieux ou consignes spécifiques..."
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-emergency btn-lg py-3 fw-bold rounded-pill shadow-sm w-100"
                      >
                        {loading ? (
                          <span>
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                            Envoi de votre demande en cours...
                          </span>
                        ) : (
                          <span>
                            <i className="bi bi-send-fill me-2" />
                            Envoyer Ma Demande de Devis
                          </span>
                        )}
                      </button>

                      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 text-muted small">
                        <span><i className="bi bi-shield-check text-success me-1" /> Devis 100% gratuit et sans engagement</span>
                        <span><i className="bi bi-lock-fill text-muted me-1" /> Données strictement confidentielles</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Step Process */}
      <section className="section bg-white py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              RAPIDITÉ & SIMPLICITÉ
            </span>
            <h2 className="section-title">Ce Qui Se Passe Après Votre Envoi</h2>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="service-process-card h-100">
                <div className="process-step-num">01</div>
                <h5 className="fw-bold mb-2">Étude & Devis sous 1h</h5>
                <p className="small text-muted mb-0">
                  Notre responsable examine votre demande et vous rappelle pour affiner le besoin et vous donner une estimation précise.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="service-process-card h-100">
                <div className="process-step-num">02</div>
                <h5 className="fw-bold mb-2">Planification Sur-Mesure</h5>
                <p className="small text-muted mb-0">
                  Nous fixons le jour et l’horaire qui vous conviennent le mieux, avec affectation des agents et préparation du matériel adéquat.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="service-process-card h-100">
                <div className="process-step-num">03</div>
                <h5 className="fw-bold mb-2">Intervention & Contrôle</h5>
                <p className="small text-muted mb-0">
                  Nos professionnels réalisent le nettoyage dans les règles de l’art et vérifient avec vous chaque détail pour une satisfaction totale.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Contact */}
      <section className="section py-5" style={{ background: '#f8fafc' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              FAQ
            </span>
            <h2 className="section-title">Questions Fréquentes sur Nos Devis</h2>
          </div>

          <div className="accordion service-faq-accordion" id="contactFaqAccordion">
            {contactFaqs.map((faq, idx) => (
              <div className="accordion-item mb-3 border rounded-3 overflow-hidden shadow-sm" key={idx}>
                <h2 className="accordion-header">
                  <button
                    className="accordion-button fw-bold collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faqCollapse${idx}`}
                    style={{ background: '#ffffff', color: '#04508d' }}
                  >
                    <i className="bi bi-question-circle me-2 text-primary" />
                    {faq.q}
                  </button>
                </h2>
                <div id={`faqCollapse${idx}`} className="accordion-collapse collapse">
                  <div className="accordion-body text-secondary" style={{ lineHeight: 1.7 }}>
                    {faq.a}
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

export default ContactPage;
