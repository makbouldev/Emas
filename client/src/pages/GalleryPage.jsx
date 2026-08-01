import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schemas';
import { resolveMediaPath } from '../utils/resolveMediaPath';

const missions = [
  { city: 'Casablanca', type: 'Grand nettoyage appartement apres demenagement', time: 'Livre' },
  { city: 'Rabat', type: 'Entretien regulier de bureaux et sanitaires', time: 'Planifie' },
  { city: 'Marrakech', type: 'Nettoyage fin de chantier et vitrerie', time: 'Controle' },
  { city: 'Tanger', type: 'Nettoyage evenementiel avant et apres reception', time: 'Continu' }
];

function GalleryPage() {
  const { content, apiBaseUrl } = useSiteData();
  const resolveImage = (value) => resolveMediaPath(value, apiBaseUrl);

  return (
    <>
      <Seo
        title="Galerie Nettoyage et Interventions"
        description="Galerie des interventions EMAS Nettoyage: domicile, bureaux, chantiers, vitres, textiles, espaces communs et evenements au Maroc."
        path="/gallery"
        image={content.gallery[0]}
        keywords="galerie nettoyage, photos nettoyage, nettoyage bureaux, nettoyage chantier, emas nettoyage"
        structuredData={[
          buildWebPageSchema({
            name: 'Galerie EMAS Nettoyage',
            path: '/gallery',
            description: 'Photos et missions realisees par EMAS Nettoyage.'
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Galerie', path: '/gallery' }
          ])
        ]}
      />
      <section className="inner-hero inner-hero-gallery">
        <div className="container">
          <h1>Galerie et Interventions</h1>
          <p>Exemples de prestations de nettoyage, entretien, remise en etat et desinfection assurees par EMAS.</p>
        </div>
      </section>

      <section className="section gallery-section">
        <div className="container">
          <h2 className="section-title">Scenes de Nettoyage</h2>
          <div className="gallery-grid mt-4">
            {content.gallery.concat(content.gallery).map((image, idx) => (
              <motion.div className="gallery-item" key={`${image}-${idx}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (idx % 6) * 0.05 }}>
                <img src={resolveImage(image)} alt={`Intervention EMAS Nettoyage ${idx + 1}`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section light-area">
        <div className="container">
          <h2 className="section-title">Missions Realisees</h2>
          <div className="row g-4 mt-2">
            {missions.map((mission) => (
              <div key={`${mission.city}-${mission.type}`} className="col-md-6 col-lg-3">
                <div className="timeline-card h-100">
                  <h6>{mission.city}</h6>
                  <p>{mission.type}</p>
                  <span className="timeline-no">{mission.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Temoignages</h2>
          <div className="row g-4 mt-2">
            {content.testimonials.map((person) => (
              <div className="col-12 col-lg-4" key={person.name}>
                <div className="testimonial-card h-100">
                  <p>"{person.text}"</p>
                  <h6>{person.name}</h6>
                  <small>{person.role}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container text-center">
          <h2>Besoin d une intervention EMAS Nettoyage ?</h2>
          <p className="mb-4">EMAS assure une prestation propre et organisee sur simple demande.</p>
          <Link to="/contact" className="btn btn-emergency" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event('cmpf-open-book-panel')); }}>Contacter l Equipe</Link>
        </div>
      </section>
    </>
  );
}

export default GalleryPage;
