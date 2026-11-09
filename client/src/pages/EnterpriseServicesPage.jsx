import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildServiceSchema,
  buildWebPageSchema
} from '../seo/schemas';

const b2bSectors = [
  {
    title: 'Bureaux, Open Spaces & Sièges Sociaux',
    badge: 'Tertiaire & Corporate',
    icon: 'bi-building',
    image: '/services/bureaux-1.png',
    description: 'Entretien quotidien ou hebdomadaire des postes de travail, dépoussiérage informatique, désinfection des salles de réunion, sanitaires et coins café.',
    features: [
      'Dépoussiérage et désinfection des écrans, claviers et bureaux',
      'Aspiration silencieuse des moquettes et lavage des sols',
      'Nettoyage et réapprovisionnement complet des sanitaires',
      'Vidage quotidien et tri sélectif des corbeilles'
    ]
  },
  {
    title: 'Commerces, Boutiques & Showrooms',
    badge: 'Retail & Commerce',
    icon: 'bi-shop',
    image: '/services/bureaux.jpg',
    description: 'Mise en valeur de votre image de marque avant l’ouverture : vitrines étincelantes, sols haute brillance, caisses et zones d’accueil clients impeccables.',
    features: [
      'Lavage régulier des vitrines et baies vitrées sans traces',
      'Lustrage des sols carrelés et marbre à fort passage',
      'Dépoussiérage des rayons, comptoirs et présentoirs',
      'Intervention matinale avant l’ouverture au public'
    ]
  },
  {
    title: 'Sites Industriels, Dépôts & Entrepôts',
    badge: 'Industrie & Logistique',
    icon: 'bi-gear-wide-connected',
    image: '/services/chantier-2.jpg',
    description: 'Nettoyage technique respectant les normes de sécurité en milieu industriel : dégraissage des sols, dépoussiérage des structures et zones de stockage.',
    features: [
      'Décapage mécanisé à la monobrosse des sols bétons et résines',
      'Nettoyage des vestiaires, réfectoires et blocs sanitaires',
      'Dépoussiérage des gaines, canalisations et charpentes',
      'Respect strict des règles de sécurité et port des EPI'
    ]
  },
  {
    title: 'Syndics, Copropriétés & Immeubles',
    badge: 'Immobilier & Résidentiel',
    icon: 'bi-door-open-fill',
    image: '/services/sols-2.jpg',
    description: 'Gestion complète de la propreté des parties communes de résidences et immeubles d’affaires pour le confort et la satisfaction des résidents.',
    features: [
      'Entretien soigné des halls d’entrée, paliers et escaliers',
      'Nettoyage des cabines d’ascenseurs et vitrages communs',
      'Balayage et lavage des parkings sous-sol et cours',
      'Sortie, rentrée et désinfection des bacs à poubelles'
    ]
  },
  {
    title: 'Nettoyage de Fin de Chantier B2B',
    badge: 'BTP & Rénovation',
    icon: 'bi-cone-striped',
    image: '/services/chantier-1.jpg',
    description: 'Remise en état complète de vos locaux professionnels neufs ou rénovés avant aménagement des collaborateurs ou remise des clés au client.',
    features: [
      'Évacuation totale de la poussière fine de plâtre et ciment',
      'Grattoyage minutieux des peintures et silicones sur vitrages',
      'Décapage chimique neutralisé pour éliminer la laitance',
      'Livraison clés en main prête à l’exploitation immédiate'
    ]
  },
  {
    title: 'Événements Professionnels & Salons',
    badge: 'Événementiel & Congrès',
    icon: 'bi-calendar2-check',
    image: '/services/bureaux-3.png',
    description: 'Présence d’agents discrets et efficaces avant, pendant et après vos séminaires, salons professionnels, lancements de produits et réceptions.',
    features: [
      'Préparation et mise en beauté des lieux avant ouverture',
      'Permanence discrète pour le ramassage des verres et déchets',
      'Remise en état rapide et intégrale après clôture',
      'Équipes formées aux réceptions d’affaires et protocole'
    ]
  }
];

const b2bFaqs = [
  {
    q: 'Comment se passe la mise en place d’un contrat d’entretien régulier ?',
    a: 'Nous effectuons d’abord une visite gratuite sur site pour évaluer vos locaux, votre surface et vos besoins. Nous vous soumettons sous 24h un cahier des charges détaillé avec devis transparent. Une fois validé, nous assignons des agents fixes et un superviseur dédié.'
  },
  {
    q: 'Quels sont vos créneaux horaires d’intervention dans les bureaux ?',
    a: 'Nous intervenons selon vos contraintes : tôt le matin (avant 8h00), en soirée (après 18h00) ou en journée continue avec du matériel silencieux pour ne jamais perturber vos collaborateurs.'
  },
  {
    q: 'Fournissez-vous également les consommables sanitaires ?',
    a: 'Oui, nous proposons une formule clé en main incluant la fourniture, la livraison et le réapprovisionnement de papier toilette, essuie-mains, savon liquide antibactérien, sacs poubelles et désodorisants.'
  },
  {
    q: 'Vos agents sont-ils assurés et déclarés ?',
    a: 'Absolument. 100% de notre personnel est déclaré à la CNSS, couvert par une assurance responsabilité civile professionnelle et soumis à une charte stricte de confidentialité relative à vos documents et activités.'
  },
  {
    q: 'Pouvons-nous tester vos services sans engagement ?',
    a: 'Oui, nous proposons une période probatoire d’un mois sans engagement de longue durée, afin de vous permettre de constater par vous-même la rigueur et la qualité de notre travail.'
  }
];

function EnterpriseServicesPage() {
  const { content } = useSiteData();
  const [openFaq, setOpenFaq] = useState(0);

  const phoneDigits = (content?.phone || '+212 725 57 25 50').replace(/[^\d+]/g, '');
  const whatsappDigits = (content?.phone || '+212 725 57 25 50').replace(/\D/g, '');

  const openB2bQuote = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    window.dispatchEvent(
      new CustomEvent('cmpf-open-book-panel', {
        detail: {
          title: 'Devis Nettoyage Entreprise B2B',
          service: 'Nettoyage pour Entreprises',
          copy: 'Indiquez-nous votre type de local (bureaux, magasin, usine, chantier), superficie approximative et fréquence souhaitée.'
        }
      })
    );
  };

  return (
    <div className="b2b-services-wrapper">
      <Seo
        title="Services aux Entreprises - Nettoyage Bureaux & Locaux Professionnels au Maroc"
        description="Société de nettoyage professionnel pour entreprises au Maroc : bureaux, open-spaces, commerces, chantiers, syndics et usines. Contrats flexibles, devis gratuit sous 24h."
        path="/services-entreprises"
        image="/services/bureaux-1.png"
        keywords="nettoyage entreprise maroc, nettoyage bureaux casablanca, entretien locaux professionnels, societe nettoyage entreprise, contrat nettoyage b2b"
        structuredData={[
          buildWebPageSchema({
            name: 'Services aux Entreprises EMAS Nettoyage',
            path: '/services-entreprises',
            description: 'Nettoyage et entretien professionnel pour entreprises, bureaux et locaux au Maroc.'
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Services aux Entreprises', path: '/services-entreprises' }
          ]),
          buildServiceSchema({
            name: 'Services de Nettoyage aux Entreprises',
            description: 'Contrats réguliers et ponctuels de nettoyage de locaux professionnels au Maroc.',
            path: '/services-entreprises',
            image: '/services/bureaux-1.png',
            serviceType: 'Nettoyage Entreprise B2B'
          }),
          buildFaqSchema(b2bFaqs)
        ]}
      />

      {/* Hero Header B2B */}
      <section className="service-detail-hero">
        <div className="container">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb" className="service-breadcrumb mb-3">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/"><i className="bi bi-house-door-fill me-1" /> Accueil</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Services aux Entreprises
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
                <i className="bi bi-building-check me-1" /> SOLUTIONS B2B & GRANDS COMPTES
              </span>
              <h1 className="service-hero-title mb-3">
                Nettoyage & Entretien Professionnel pour Entreprises au Maroc
              </h1>
              <p className="service-hero-desc mb-4">
                EMAS Nettoyage accompagne les entreprises, sièges sociaux, commerces, syndics et sites industriels 
                avec des contrats souples, des équipes qualifiées et un niveau d'exigence rigoureux.
              </p>

              <div className="service-hero-actions d-flex flex-wrap gap-2 mb-4">
                <button
                  type="button"
                  onClick={openB2bQuote}
                  className="btn btn-emergency btn-lg px-4 py-3 fw-bold rounded-pill shadow-sm"
                >
                  <i className="bi bi-file-earmark-text-fill me-2" />
                  Demander un Devis Entreprise
                </button>
                <a
                  href={`tel:${phoneDigits}`}
                  className="btn btn-outline-light btn-lg px-4 py-3 fw-bold rounded-pill"
                >
                  <i className="bi bi-telephone-fill me-2 text-primary" />
                  07 25 57 25 50
                </a>
                <a
                  href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Bonjour, je souhaite un devis pour le nettoyage de nos locaux professionnels.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-success btn-lg px-4 py-3 fw-bold rounded-pill"
                >
                  <i className="bi bi-whatsapp me-2" />
                  WhatsApp B2B Direct
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="service-highlights-grid">
                <div className="service-highlight-chip">
                  <i className="bi bi-check-circle-fill text-success me-2" />
                  <span>Contrats 100% Flexibles (Quotidien / Hebdo)</span>
                </div>
                <div className="service-highlight-chip">
                  <i className="bi bi-check-circle-fill text-success me-2" />
                  <span>Horaires Décals : Matin (avant 8h) ou Soir</span>
                </div>
                <div className="service-highlight-chip">
                  <i className="bi bi-check-circle-fill text-success me-2" />
                  <span>Personnel Déclaré CNSS & Supervisé</span>
                </div>
                <div className="service-highlight-chip">
                  <i className="bi bi-check-circle-fill text-success me-2" />
                  <span>Gestion Complète des Consommables</span>
                </div>
              </div>
            </motion.div>

            {/* Visual Mosaic Showcase */}
            <motion.div
              className="col-lg-5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="service-detail-gallery-card">
                <div className="service-detail-img-container" style={{ height: '360px' }}>
                  <img
                    src="/services/bureaux-1.png"
                    alt="Nettoyage bureaux et sièges d'entreprises"
                    className="service-detail-main-img"
                  />
                  <div className="service-detail-badge-count">
                    Excellence Entreprises
                  </div>
                </div>
                <div className="p-3 text-center">
                  <h6 className="fw-bold mb-1" style={{ color: '#04508d' }}>
                    <i className="bi bi-shield-check text-success me-1" /> Partenaire Certifié Propreté B2B
                  </h6>
                  <p className="small text-muted mb-0">Audit gratuit sur site et période d'essai sans engagement.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="section py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              SECTEURS D'ACTIVITÉ COUVERTS
            </span>
            <h2 className="section-title">Nos Prestations B2B Dédiées à Votre Métier</h2>
            <p className="section-copy mx-auto" style={{ maxWidth: '680px' }}>
              Chaque environnement professionnel a ses normes et ses spécificités. Nous concevons un plan d'entretien sur mesure adapté à votre secteur.
            </p>
          </div>

          <div className="row g-4">
            {b2bSectors.map((sector, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="b2b-sector-card h-100 bg-white rounded-4 overflow-hidden border shadow-sm d-flex flex-column">
                  <div className="b2b-sector-img-wrap" style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={sector.image}
                      alt={sector.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span className="badge position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill text-white" style={{ background: 'rgba(4, 80, 141, 0.88)', backdropFilter: 'blur(4px)' }}>
                      <i className={`bi ${sector.icon} me-1`} /> {sector.badge}
                    </span>
                  </div>
                  <div className="p-4 flex-grow-1 d-flex flex-column">
                    <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>{sector.title}</h5>
                    <p className="small text-muted mb-3">{sector.description}</p>
                    <ul className="list-unstyled small mb-4 flex-grow-1">
                      {sector.features.map((f, i) => (
                        <li key={i} className="mb-2 d-flex align-items-start">
                          <i className="bi bi-check2 text-success me-2 fw-bold" style={{ fontSize: '1.1rem' }} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      onClick={openB2bQuote}
                      className="btn btn-outline-primary w-100 rounded-pill fw-bold mt-auto"
                    >
                      Demander un Devis Pour Cet Espace <i className="bi bi-arrow-right ms-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Engagements B2B */}
      <section className="section bg-white py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              VALEUR AJOUTÉE
            </span>
            <h2 className="section-title">Les 5 Engagements EMAS Nettoyage pour les Entreprises</h2>
            <p className="section-copy mx-auto" style={{ maxWidth: '680px' }}>
              Pourquoi les directions générales, DRH et gestionnaires d'immeubles nous font confiance au quotidien.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <div className="showcase-feature-box p-4 h-100">
                <div className="showcase-feature-icon">
                  <i className="bi bi-clock-history" />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>Horaires Décalés & Discrétion</h5>
                  <p className="small text-muted mb-0">
                    Intervention en dehors des heures de bureau (avant 8h ou après 18h) pour ne jamais gêner vos réunions et la concentration de vos équipes.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="showcase-feature-box p-4 h-100">
                <div className="showcase-feature-icon">
                  <i className="bi bi-shield-lock-fill" />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>Sécurité & Confidentialité</h5>
                  <p className="small text-muted mb-0">
                    Agents en uniforme avec badge, déclarés à la CNSS et signataires d’un engagement strict de confidentialité pour vos données d'entreprise.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="showcase-feature-box p-4 h-100">
                <div className="showcase-feature-icon">
                  <i className="bi bi-clipboard2-check-fill" />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>Superviseur Dédié & Contrôle</h5>
                  <p className="small text-muted mb-0">
                    Un interlocuteur unique et des visites inopinées de contrôle qualité avec fiche d'émargement numérique hebdomadaire.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="showcase-feature-box p-4 h-100">
                <div className="showcase-feature-icon">
                  <i className="bi bi-box-seam-fill" />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>Gestion des Consommables</h5>
                  <p className="small text-muted mb-0">
                    Plus de rupture de stock : nous approvisionnons vos distributeurs en papier hygiénique, savon mousse, essuie-mains et sacs poubelles.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="showcase-feature-box p-4 h-100">
                <div className="showcase-feature-icon">
                  <i className="bi bi-receipt" />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>Facturation B2B Claire</h5>
                  <p className="small text-muted mb-0">
                    Facture mensuelle unique détaillée, tarifs compétitifs sans coûts cachés et possibilité d'ajuster les prestations selon vos effectifs.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4">
              <div className="showcase-feature-box p-4 h-100" style={{ background: '#f0f9ff', borderColor: '#bae3ff' }}>
                <div className="showcase-feature-icon" style={{ background: '#04508d', color: '#ffffff' }}>
                  <i className="bi bi-star-fill" />
                </div>
                <div>
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>1 Mois d'Essai Sans Engagement</h5>
                  <p className="small text-muted mb-0">
                    Testez nos services pendant 30 jours sans obligation de renouvellement pour valider notre standard de propreté sur vos propres locaux.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Steps B2B Process */}
      <section className="section py-5" style={{ background: '#f8fafc' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              MISE EN SERVICE RAPIDE
            </span>
            <h2 className="section-title">Comment Démarrer avec EMAS Nettoyage ?</h2>
            <p className="section-copy mx-auto" style={{ maxWidth: '650px' }}>
              Une intégration fluide en 4 étapes simples sans perturber vos journées de travail.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="service-process-card h-100">
                <div className="process-step-num">01</div>
                <h5 className="fw-bold mb-2">Audit Gratuit Sur Site</h5>
                <p className="small text-muted mb-0">
                  Visite de vos espaces pour mesurer les surfaces, recenser les matériaux fragiles et définir la fréquence idéale.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="service-process-card h-100">
                <div className="process-step-num">02</div>
                <h5 className="fw-bold mb-2">Cahier des Charges & Devis</h5>
                <p className="small text-muted mb-0">
                  Élaboration d'une proposition sur-mesure sous 24h avec planning d'intervention et tarification claire.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="service-process-card h-100">
                <div className="process-step-num">03</div>
                <h5 className="fw-bold mb-2">Affectation & Démarrage</h5>
                <p className="small text-muted mb-0">
                  Mise en place d'agents formés à vos consignes de sécurité avec dotation complète en machines et produits agréés.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="service-process-card h-100">
                <div className="process-step-num">04</div>
                <h5 className="fw-bold mb-2">Supervision & Reporting</h5>
                <p className="small text-muted mb-0">
                  Audits qualité réguliers avec votre responsable RH ou Facility Manager pour maintenir un standard d'excellence constant.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B2B FAQ */}
      <section className="section bg-white py-5">
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              FAQ PROFESSIONNELS
            </span>
            <h2 className="section-title">Questions Fréquentes des Entreprises</h2>
          </div>

          <div className="accordion service-faq-accordion" id="b2bFaqAccordion">
            {b2bFaqs.map((faq, idx) => (
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

      {/* Big CTA Band */}
      <section className="section cta-band text-center text-white py-5">
        <div className="container">
          <h2 className="fw-bold mb-3">Besoin d'un devis ou d'un audit gratuit pour votre entreprise ?</h2>
          <p className="lead mb-4 mx-auto" style={{ maxWidth: '680px' }}>
            Recevez une proposition personnalisée et chiffrée sous 24 heures. Nos équipes interviennent partout à Casablanca, Rabat et au Maroc.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button
              type="button"
              onClick={openB2bQuote}
              className="btn btn-light btn-lg px-5 py-3 fw-bold rounded-pill shadow"
              style={{ color: '#04508d' }}
            >
              <i className="bi bi-file-earmark-text-fill me-2" />
              Demander Mon Devis Entreprise Gratuit
            </button>
            <a
              href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Bonjour, je souhaite un devis pour le nettoyage de notre entreprise.')}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-success btn-lg px-4 py-3 fw-bold rounded-pill shadow"
            >
              <i className="bi bi-whatsapp me-2" />
              WhatsApp Entreprise: 07 25 57 25 50
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EnterpriseServicesPage;
