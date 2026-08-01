import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from '../seo/schemas';

const serviceCatalog = [
  {
    title: 'Nettoyage a Domicile',
    icon: 'bi-house-check-fill',
    category: 'Domicile',
    image: '1.jpeg',
    description: 'Entretien des appartements, villas, cuisines, sanitaires, chambres et espaces de vie.'
  },
  {
    title: 'Grand Nettoyage',
    icon: 'bi-stars',
    category: 'Domicile',
    image: '2.jpeg',
    description: 'Nettoyage approfondi apres demenagement, reception, travaux legers ou longue absence.'
  },
  {
    title: 'Canapes et Tapis',
    icon: 'bi-brush-fill',
    category: 'Domicile',
    image: '3.jpeg',
    description: 'Shampooing, aspiration, traitement des taches et rafraichissement des textiles.'
  },
  {
    title: 'Nettoyage Bureaux',
    icon: 'bi-building-check',
    category: 'Professionnel',
    image: '4.jpeg',
    description: 'Entretien regulier des bureaux, open spaces, salles de reunion et sanitaires.'
  },
  {
    title: 'Commerces et Showrooms',
    icon: 'bi-shop',
    category: 'Professionnel',
    image: '5.jpeg',
    description: 'Nettoyage de vitrines, sols, rayons, comptoirs et zones clients avant ouverture.'
  },
  {
    title: 'Syndics et Espaces Communs',
    icon: 'bi-door-open-fill',
    category: 'Professionnel',
    image: '6.jpeg',
    description: 'Halls, escaliers, ascenseurs, parkings, locaux techniques et sorties des poubelles.'
  },
  {
    title: 'Nettoyage Fin de Chantier',
    icon: 'bi-cone-striped',
    category: 'Technique',
    image: '7.jpeg',
    description: 'Poussiere fine, traces de peinture, vitres, sols et remise en propre avant livraison.'
  },
  {
    title: 'Vitrerie et Facades',
    icon: 'bi-window',
    category: 'Technique',
    image: '8.jpeg',
    description: 'Vitres, baies, vitrines et facades avec materiel adapte et finition sans traces.'
  },
  {
    title: 'Desinfection',
    icon: 'bi-shield-check',
    category: 'Technique',
    image: '9.jpeg',
    description: 'Desinfection ciblee des surfaces, sanitaires, cuisines et zones sensibles.'
  },
  {
    title: 'Nettoyage Evenementiel',
    icon: 'bi-calendar-check-fill',
    category: 'Evenementiel',
    image: '10.jpeg',
    description: 'Equipe avant, pendant et apres salons, receptions, conferences et evenements publics.'
  },
  {
    title: 'Contrats Reguliers',
    icon: 'bi-repeat',
    category: 'Evenementiel',
    image: '1.jpeg',
    description: 'Planning quotidien, hebdomadaire ou mensuel avec suivi, reporting et controle qualite.'
  },
  {
    title: 'Intervention Express',
    icon: 'bi-lightning-charge-fill',
    category: 'Evenementiel',
    image: '2.jpeg',
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
                      <img src={item.image} alt={item.title} className="service-catalog-image" />
                      <div className="service-catalog-body">
                        <span className="service-catalog-icon"><i className={`bi ${item.icon}`} /></span>
                        <h5>{item.title}</h5>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
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
