import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSiteData } from '../context/SiteDataContext';

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

function QuoteModal({ isOpen, onClose, initialData }) {
  const { apiBaseUrl } = useSiteData();

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Grand Ménage',
    title: 'Demande de Devis - Nettoyage',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Update initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      const selectedService = initialData?.service || 'Grand Ménage';
      const defaultTitle = initialData?.service
        ? `Demande de Devis - ${initialData.service}`
        : (initialData?.title || 'Demande de Devis - Nettoyage');

      setFormState({
        name: '',
        phone: '',
        email: '',
        service: selectedService,
        title: defaultTitle,
        message: ''
      });
      setIsSuccess(false);
      setStatusMessage('');
      setLoading(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      // 1. Direct email dispatch to noureddinema03@gmail.com via FormSubmit
      await axios.post('https://formsubmit.co/ajax/noureddinema03@gmail.com', {
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        service: formState.service,
        title: formState.title,
        message: formState.message || 'Aucun message spécifié',
        _subject: `[DEVIS EMAS] ${formState.title} - ${formState.name} (${formState.phone})`,
        _replyto: formState.email,
        _template: 'table'
      }).catch((err) => {
        console.log('FormSubmit notice:', err.message);
      });

      // 2. Local backend notification & database storage
      await axios.post(`${apiBaseUrl}/api/contact`, {
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        service: formState.service,
        title: formState.title,
        message: formState.message
      }).catch(() => null);

      setIsSuccess(true);

      // Google Ads Conversion tracking event
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', {
          send_to: 'AW-18516311815/aWsdCOy1sLAdEIf-of1E'
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Une erreur est survenue. Veuillez nous appeler directement au 07 25 57 25 50.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour EMAS Nettoyage, j'ai rempli une demande de devis :\nNom: ${formState.name}\nTél: ${formState.phone}\nService: ${formState.service}\nObjet: ${formState.title}`
  );

  return (
    <div className="quote-modal-overlay" onClick={onClose}>
      <div className="quote-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="quote-modal-header">
          <div className="d-flex align-items-center gap-2">
            <span className="quote-modal-icon">
              <i className="bi bi-file-earmark-text-fill" />
            </span>
            <div>
              <h4 className="mb-0 fw-bold" style={{ color: '#04508d' }}>
                Demander un Devis Gratuit
              </h4>
              <p className="text-muted small mb-0">
                Estimation rapide, sans engagement et adaptée à vos besoins
              </p>
            </div>
          </div>
          <button
            type="button"
            className="quote-modal-close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Content */}
        <div className="quote-modal-body">
          {isSuccess ? (
            <div className="quote-success-box text-center py-4">
              <div className="quote-success-icon mx-auto mb-3">
                <i className="bi bi-check-circle-fill text-success" />
              </div>
              <h4 className="fw-bold text-success mb-2">Demande Envoyée avec Succès !</h4>
              <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>
                Merci <strong>{formState.name}</strong> ! Votre demande de devis a bien été transmise à notre équipe. 
                Nous vous contacterons dans les plus brefs délais au <strong>{formState.phone}</strong>.
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                <a
                  href={`https://wa.me/212725572550?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm"
                >
                  <i className="bi bi-whatsapp me-2" />
                  Confirmer sur WhatsApp
                </a>
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4 py-2 rounded-pill fw-bold"
                  onClick={onClose}
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="quote-form">
              {statusMessage && (
                <div className="alert alert-danger py-2 small mb-3">
                  <i className="bi bi-exclamation-triangle-fill me-1" />
                  {statusMessage}
                </div>
              )}

              <div className="row g-3">
                {/* 1. Titre de la demande (pre-filled by default) */}
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

                {/* 2. Service / Prestation (Select) */}
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

                {/* 6. Sujet / Message / Détails du besoin */}
                <div className="col-12">
                  <label className="form-label fw-bold small text-secondary mb-1">
                    <i className="bi bi-chat-text-fill me-1 text-primary" />
                    Sujet & Détails de Votre Demande *
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formState.message}
                    onChange={handleChange}
                    required
                    className="form-control"
                    placeholder="Précisez la superficie (m²), ville/adresse, date souhaitée ou toute consigne particulière..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-4 d-flex flex-column gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-emergency btn-lg py-3 fw-bold rounded-pill shadow-sm w-100"
                >
                  {loading ? (
                    <span>
                      <span className="spinner-border spinner-border-sm me-2" role="status" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span>
                      <i className="bi bi-send-fill me-2" />
                      Envoyer Ma Demande de Devis
                    </span>
                  )}
                </button>

                <div className="text-center pt-2">
                  <span className="small text-muted">
                    Besoin urgent ? Appelez-nous directement au{' '}
                    <a href="tel:0725572550" className="fw-bold text-primary text-decoration-none">
                      07 25 57 25 50
                    </a>
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuoteModal;
