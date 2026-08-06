import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from '../seo/schemas';

const faqs = [
  { q: 'Intervenez-vous uniquement pour les grands nettoyages ?', a: 'Non, EMAS Nettoyage intervient aussi pour l entretien regulier, les petites remises en propre et les contrats professionnels.' },
  { q: 'Proposez-vous nettoyage maison et bureaux ?', a: 'Oui, nous couvrons domiciles, bureaux, commerces, syndics, chantiers, vitres, tapis et canapes.' },
  { q: 'Assurez-vous la couverture des evenements ?', a: 'Oui, avec une equipe avant, pendant et apres l evenement selon la taille du lieu.' },
  { q: 'Pouvez-vous envoyer un devis rapidement ?', a: 'Oui, envoyez les informations utiles et notre equipe prepare une estimation claire.' }
];

function ContactPage() {
  const { content, apiBaseUrl } = useSiteData();
  const phones = Array.isArray(content.phones) && content.phones.length ? content.phones : [content.phone];
  const [formState, setFormState] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const onInput = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');

    try {
      const response = await axios.post(`${apiBaseUrl}/api/contact`, formState);

      // Send email directly to noureddinema03@gmail.com
      axios.post('https://formsubmit.co/ajax/noureddinema03@gmail.com', {
        name: formState.name,
        phone: formState.phone,
        message: formState.message,
        _subject: `Nouveau Devis EMAS: ${formState.name} (${formState.phone})`
      }).catch(() => {});

      setStatusMessage(response.data.message);
      setFormState({ name: '', phone: '', message: '' });
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'conversion', { send_to: 'AW-18042778476/wB6lCM7WydwcEOzmu5tD' });
      }
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || 'Echec de la demande. Merci de nous appeler directement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Contact Nettoyage et Devis"
        description="Contactez EMAS Nettoyage pour un devis nettoyage domicile, bureaux, chantier, vitres, tapis, canapes, espaces communs ou evenement."
        path="/contact"
        keywords="contact nettoyage, devis nettoyage, nettoyage casablanca, societe nettoyage maroc, emas nettoyage"
        structuredData={[
          buildWebPageSchema({
            name: 'Contact EMAS Nettoyage',
            path: '/contact',
            description: 'Formulaire et coordonnees pour demander un devis ou une intervention de nettoyage.'
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Contact', path: '/contact' }
          ]),
          buildFaqSchema(faqs)
        ]}
      />
      <section className="inner-hero inner-hero-contact">
        <div className="container">
          <h1>Contact et Demande de Devis</h1>
          <p>Sur simple appel, EMAS Nettoyage organise la prestation adaptee a votre espace.</p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h2 className="section-title text-start">Formulaire de Nettoyage</h2>
              <p className="section-copy">Decrivez le besoin: domicile, bureau, chantier, vitres, tapis, canapes, surface, adresse et horaire souhaite.</p>
              <div className="contact-info">
                {phones.map((phone) => (
                  <div key={phone}><i className="bi bi-telephone-fill me-2" />{phone}</div>
                ))}
                <div><i className="bi bi-envelope-fill me-2" />{content.email}</div>
                <div><i className="bi bi-clock-fill me-2" />Disponibilite 7j/7 sur planning</div>
              </div>
            </div>
            <div className="col-lg-6">
              <form className="contact-form" onSubmit={onSubmit}>
                <input name="name" value={formState.name} onChange={onInput} placeholder="Nom Complet" required />
                <input name="phone" value={formState.phone} onChange={onInput} placeholder="Telephone" required />
                <textarea name="message" value={formState.message} onChange={onInput} placeholder="Type de nettoyage / adresse / surface / date souhaitee" rows="5" />
                <button type="submit" className="btn btn-emergency w-100" disabled={loading}>{loading ? 'Envoi en cours...' : 'Envoyer la Demande'}</button>
                {statusMessage && <div className="status-message mt-3">{statusMessage}</div>}
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="section light-area">
        <div className="container">
          <h2 className="section-title">Apres Votre Demande</h2>
          <div className="row g-4 mt-2">
            <div className="col-md-4"><div className="long-card h-100"><h5>1. Evaluation</h5><p>Notre equipe analyse le type de lieu, la surface, les priorites et le delai souhaite.</p></div></div>
            <div className="col-md-4"><div className="long-card h-100"><h5>2. Planning</h5><p>Nous proposons l equipe, les produits, le materiel et le creneau le plus pratique.</p></div></div>
            <div className="col-md-4"><div className="long-card h-100"><h5>3. Controle</h5><p>Apres l intervention, un controle final valide la proprete et les points sensibles.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Questions Courantes</h2>
          <div className="row g-3 mt-2">
            {faqs.map((item) => (
              <div className="col-md-6" key={item.q}>
                <div className="faq-item h-100">
                  <h6>{item.q}</h6>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container text-center">
          <h2>Besoin d informations sur nos equipes ?</h2>
          <p className="mb-4">Consultez la page equipes pour voir nos categories d intervention et la couverture.</p>
          <Link to="/fleet" className="btn btn-emergency">Voir les Equipes</Link>
        </div>
      </section>
    </>
  );
}

export default ContactPage;
