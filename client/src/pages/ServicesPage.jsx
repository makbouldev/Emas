import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import ServiceCardImage from '../components/ServiceCardImage';
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from '../seo/schemas';

const serviceCatalog = [
  {
    title: 'Nettoyage a Domicile',
    icon: 'bi-house-check-fill',
    category: 'Domicile',
    image: '/services/domicile.jpg',
    description: 'Entretien des appartements, villas, cuisines, sanitaires, chambres et espaces de vie.'
  },
  {
    slug: 'grand-menage',
    title: 'Grand Nettoyage',
    icon: 'bi-stars',
    category: 'Domicile',
    image: '/services/grand-menage-1.png',
    images: [
      '/services/grand-menage-1.png',
      '/services/grand-menage-2.jpg',
      '/services/grand-menage-3.png'
    ],
    description: 'Nettoyage approfondi apres demenagement, reception, travaux legers ou longue absence.'
  },
  {
    slug: 'canapes-tapis-moquettes',
    title: 'Canapes et Tapis',
    icon: 'bi-brush-fill',
    category: 'Domicile',
    image: '/services/canapes-1.jpg',
    images: [
      '/services/canapes-1.jpg',
      '/services/canapes-2.jpg',
      '/services/canapes-3.jpg'
    ],
    description: 'Shampooing, aspiration, traitement des taches et rafraichissement des textiles.'
  },
  {
    slug: 'nettoyage-de-bureaux',
    title: 'Nettoyage Bureaux',
    icon: 'bi-building-check',
    category: 'Professionnel',
    image: '/services/bureaux-1.png',
    images: [
      '/services/bureaux-1.png',
      '/services/bureaux-2.png',
      '/services/bureaux-3.png'
    ],
    description: 'Entretien regulier des bureaux, open spaces, salles de reunion et sanitaires.'
  },
  {
    title: 'Commerces et Showrooms',
    icon: 'bi-shop',
    category: 'Professionnel',
    image: '/services/bureaux.jpg',
    description: 'Nettoyage de vitrines, sols, rayons, comptoirs et zones clients avant ouverture.'
  },
  {
    title: 'Syndics et Espaces Communs',
    icon: 'bi-door-open-fill',
    category: 'Professionnel',
    image: '/services/sols.jpg',
    description: 'Halls, escaliers, ascenseurs, parkings, locaux techniques et sorties des poubelles.'
  },
  {
    slug: 'nettoyage-fin-de-chantier',
    title: 'Nettoyage Fin de Chantier',
    icon: 'bi-cone-striped',
    category: 'Technique',
    image: '/services/chantier-1.jpg',
    images: [
      '/services/chantier-1.jpg',
      '/services/chantier-2.jpg',
      '/services/chantier-3.png'
    ],
    description: 'Poussiere fine, traces de peinture, vitres, sols et remise en propre avant livraison.'
  },
  {
    slug: 'traitement-cristallisation-des-sols',
    title: 'Traitement et Cristallisation des Sols',
    icon: 'bi-grid-3x3-gap-fill',
    category: 'Technique',
    image: '/services/sols-1.jpg',
    images: [
      '/services/sols-1.jpg',
      '/services/sols-2.jpg',
      '/services/sols-3.png'
    ],
    description: 'Decapage, poncage, lustrage et cristallisation du marbre, carrelage et parquets.'
  },
  {
    slug: 'nettoyage-de-vitres',
    title: 'Vitrerie et Facades',
    icon: 'bi-window',
    category: 'Technique',
    image: '/services/vitres-1.jpg',
    images: [
      '/services/vitres-1.jpg',
      '/services/vitres-2.png',
      '/services/vitres-3.jpg'
    ],
    description: 'Vitres, baies, vitrines et facades avec materiel adapte et finition sans traces.'
  },
  {
    title: 'Desinfection',
    icon: 'bi-shield-check',
    category: 'Technique',
    image: '/services/desinfection.jpg',
    description: 'Desinfection ciblee des surfaces, sanitaires, cuisines et zones sensibles.'
  },
  {
    title: 'Nettoyage Evenementiel',
    icon: 'bi-calendar-check-fill',
    category: 'Evenementiel',
    image: '/services/facades.jpg',
    description: 'Equipe avant, pendant et apres salons, receptions, conferences et evenements publics.'
  },
  {
    title: 'Contrats Reguliers',
    icon: 'bi-repeat',
    category: 'Evenementiel',
    image: '/services/domicile.jpg',
    description: 'Planning quotidien, hebdomadaire ou mensuel avec suivi, reporting et controle qualite.'
  },
  {
    title: 'Intervention Express',
    icon: 'bi-lightning-charge-fill',
    category: 'Evenementiel',
    image: '/services/vitres.jpg',
    description: 'Equipe mobilisee rapidement pour remise en etat urgente ou preparation d un lieu.'
  }
];

const categories = ['Domicile', 'Professionnel', 'Technique', 'Evenementiel'];

const faqs = [
  { q: 'Intervenez-vous 7j/7 ?', a: 'Oui, EMAS Nettoyage organise les passages selon vos contraintes, y compris tot le matin, le soir ou le week-end.' },
  { q: 'Proposez-vous un devis avant intervention ?', a: 'Oui, nous pouvons estimer par telephone ou WhatsApp, puis confirmer apres details ou visite si necessaire.' },
  { q: 'Pouvez-vous assurer un contrat regulier ?', a: 'Oui, nous mettons en place un planning d entretien pour bureaux, syndics, commerces et residences.' },
  { q: 'Apportez-vous le materiel et les produits ?', a: 'Oui, nos equipes peuvent venir avec les produits, machines et accessoires adaptes au type de surface.' }
];

function ServicesPage() {
  const { content } = useSiteData();

  return (
    <>
      <Seo
        title="Services de Nettoyage Professionnel"
        description="Tous les services EMAS Nettoyage: domicile, bureaux, fin de chantier, vitres, tapis, canapes, espaces communs, desinfection et evenementiel."
        path="/services"
        image={content.hero.backgroundImage}
        keywords="service nettoyage, nettoyage domicile, nettoyage bureaux, nettoyage fin de chantier, vitres, tapis, canapes, desinfection"
        structuredData={[
          buildWebPageSchema({
            name: 'Services EMAS Nettoyage',
            path: '/services',
            description: 'Catalogue complet des services EMAS Nettoyage.'
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Services', path: '/services' }
          ]),
          buildFaqSchema(faqs)
        ]}
      />

      <section className="inner-hero">
        <div className="container">
          <h1>Services de Nettoyage Professionnel</h1>
          <p>Des prestations propres, rapides et structurees pour domicile, entreprise, chantier et evenement.</p>
        </div>
      </section>

      <section className="section services-intro-creative">
        <div className="container">
          <div className="service-intro-panel">
            <h2 className="section-title text-start mb-3">Catalogue de Services EMAS Nettoyage</h2>
            <p className="section-copy mb-4">
              Nos prestations couvrent l entretien regulier, le grand nettoyage, la vitrerie, les textiles,
              la desinfection, les fins de chantier et les besoins professionnels. Chaque intervention est preparee
              avec un planning clair, une equipe adaptee et un controle qualite.
            </p>
            <div className="transport-chip-wrap">
              {categories.map((item) => (
                <span key={item} className="transport-chip">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section service-catalog-section">
        <div className="container">
          {categories.map((category) => (
            <div className="service-catalog-group mb-5" key={category}>
              <h3 className="service-catalog-title">{category}</h3>
              <div className="row g-4 mt-1">
                {serviceCatalog.filter((item) => item.category === category).map((item, idx) => (
                  <motion.div
                    className="col-md-6 col-xl-4"
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="service-catalog-card h-100">
                      <ServiceCardImage service={item} defaultIdx={idx} />
                      <div className="service-catalog-body">
                        <span className="service-catalog-icon"><i className={`bi ${item.icon}`} /></span>
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                        {item.slug ? (
                          <Link to={`/services/${item.slug}`} className="btn btn-sm btn-outline-primary mt-3 rounded-pill fw-bold w-100">
                            Voir Détails & Devis <i className="bi bi-arrow-right ms-1" />
                          </Link>
                        ) : (
                          <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('cmpf-open-book-panel', { detail: { service: item.title } }))}
                            className="btn btn-sm btn-outline-secondary mt-3 rounded-pill fw-bold w-100"
                          >
                            Demander un Devis <i className="bi bi-arrow-right ms-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 1: Nos Équipes & Femmes de Ménage */}
      <section className="showcase-section showcase-section-light">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <div className="showcase-img-mosaic">
                <img
                  src="/equipe-menage.jpg"
                  alt="Équipe professionnelle et femmes de ménage EMAS Nettoyage"
                  className="showcase-main-photo"
                />
                <div className="showcase-float-card">
                  <div className="showcase-float-icon">
                    <i className="bi bi-people-fill" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1" style={{ color: '#04508d' }}>100% Qualifiées & Déclarées</h6>
                    <p className="small text-muted mb-0">Discrétion, rigueur et encadrement sur chaque mission.</p>
                  </div>
                </div>
              </div>
              <div className="showcase-sub-gallery">
                <div className="showcase-sub-img-wrap">
                  <img src="/services/bureaux-3.png" alt="Agents de nettoyage en intervention entreprise" />
                  <div className="showcase-sub-caption">Entretien Soigné & Discret</div>
                </div>
                <div className="showcase-sub-img-wrap">
                  <img src="/services/chantier-1.jpg" alt="Femmes de ménage et équipe fin de chantier" />
                  <div className="showcase-sub-caption">Intervention en Équipe</div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
                <i className="bi bi-award-fill me-1" /> PERSONNEL DE CONFIANCE
              </span>
              <h2 className="section-title text-start mb-3">
                Des Équipes Qualifiées & des Femmes de Ménage Expérimentées
              </h2>
              <p className="section-copy mb-4">
                La réussite de notre travail repose sur des femmes et des hommes de confiance. 
                Nos femmes de ménage et agents de propreté sont formés aux exigences les plus rigoureuses 
                pour intervenir chez vous ou dans vos bureaux avec discrétion, respect et minutie.
              </p>

              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="showcase-feature-box">
                    <div className="showcase-feature-icon">
                      <i className="bi bi-house-heart-fill" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#04508d' }}>Femmes de Ménage Triées</h6>
                      <p className="small text-muted mb-0">Sélection rigoureuse, honnêteté et soin extrême des objets de valeur.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="showcase-feature-box">
                    <div className="showcase-feature-icon">
                      <i className="bi bi-shield-lock-fill" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#04508d' }}>Discrétion & Sécurité</h6>
                      <p className="small text-muted mb-0">Personnel en uniforme, déclaré et soumis à une charte de confidentialité.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="showcase-feature-box">
                    <div className="showcase-feature-icon">
                      <i className="bi bi-person-check-fill" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#04508d' }}>Supervision Continue</h6>
                      <p className="small text-muted mb-0">Un chef d'équipe contrôle les tâches réalisées avant validation finale.</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="showcase-feature-box">
                    <div className="showcase-feature-icon">
                      <i className="bi bi-calendar2-week-fill" />
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#04508d' }}>Flexibilité 7j/7</h6>
                      <p className="small text-muted mb-0">Horaires sur mesure : passage unique, hebdomadaire ou contrat mensuel.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Matériel Professionnel & Machines de Pointe */}
      <section className="showcase-section showcase-section-white">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge px-3 py-2 rounded-pill mb-2" style={{ background: '#e1f2ff', color: '#04508d', fontWeight: 700 }}>
              <i className="bi bi-gear-fill me-1" /> MATÉRIEL & TECHNOLOGIE
            </span>
            <h2 className="section-title">Notre Parc de Matériel Professionnel & Produits Certifiés</h2>
            <p className="section-copy mx-auto" style={{ maxWidth: '680px' }}>
              Pour garantir une propreté en profondeur sans endommager vos installations, 
              nous utilisons des équipements industriels de grandes marques et des produits écologiques agréés.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="equipment-showcase-card">
                <div className="equipment-card-img-wrap">
                  <img src="/services/sols-1.jpg" alt="Monobrosse industrielle lustrage et décapage marbre" />
                  <span className="equipment-badge-overlay">Sols & Marbre</span>
                </div>
                <div className="equipment-card-content">
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>Monobrosses Industrielles</h5>
                  <p className="small text-muted mb-0">
                    Décapage puissant, lustrage et cristallisation thermo-chimique pour redonner au marbre et carrelage un éclat miroir durable.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="equipment-showcase-card">
                <div className="equipment-card-img-wrap">
                  <img src="/services/canapes-1.jpg" alt="Injecteur-extracteur nettoyage canapé et tapis" />
                  <span className="equipment-badge-overlay">Textiles & Meubles</span>
                </div>
                <div className="equipment-card-content">
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>Injecteurs-Extracteurs Kärcher</h5>
                  <p className="small text-muted mb-0">
                    Pulvérisation et extraction simultanée à haute pression éliminant taches rebelles, acariens et odeurs au cœur des fibres textiles.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="equipment-showcase-card">
                <div className="equipment-card-img-wrap">
                  <img src="/services/vitres-1.jpg" alt="Perche télescopique nettoyage vitres en hauteur" />
                  <span className="equipment-badge-overlay">Vitrerie Haute Précision</span>
                </div>
                <div className="equipment-card-content">
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>Perches Télescopiques Carbone</h5>
                  <p className="small text-muted mb-0">
                    Système de lavage à eau osmosée jusqu'à 15 mètres de hauteur assurant une finition 100% sans traces ni résidus de calcaire.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3">
              <div className="equipment-showcase-card">
                <div className="equipment-card-img-wrap">
                  <img src="/materiel-pro.jpg" alt="Produits écologiques et aspirateurs HEPA" />
                  <span className="equipment-badge-overlay">Hygiène & Santé</span>
                </div>
                <div className="equipment-card-content">
                  <h5 className="fw-bold mb-2" style={{ color: '#04508d' }}>Aspirateurs HEPA & Produits Écolabel</h5>
                  <p className="small text-muted mb-0">
                    Filtration totale des particules de plâtre et poussières fines, alliée à des détergents écologiques sans risque pour enfants et animaux.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section light-area">
        <div className="container">
          <h2 className="section-title">Questions Frequentes</h2>
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
          <h2>Besoin d un service specifique ?</h2>
          <p className="mb-4">Notre equipe vous oriente rapidement vers la prestation de nettoyage la plus adaptee.</p>
          <Link to="/contact" className="btn btn-emergency" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event('cmpf-open-book-panel')); }}>
            Demander un Devis
          </Link>
        </div>
      </section>
    </>
  );
}

export default ServicesPage;
