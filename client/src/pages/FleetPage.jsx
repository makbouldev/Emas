import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSiteData } from '../context/SiteDataContext';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schemas';

const coverage = ['Agadir', 'Casablanca', 'Fes', 'Laayoune', 'Marrakech', 'Meknes', 'Nador', 'Ouarzazate', 'Oujda', 'Rabat', 'Tanger', 'Tetouan'];

function FleetPage() {
  const { content } = useSiteData();

  return (
    <>
      <Seo
        title="Equipes et Materiel de Nettoyage"
        description="EMAS Nettoyage mobilise equipes domicile, equipes professionnelles, machines, produits et materiel adaptes dans plusieurs villes du Maroc."
        path="/fleet"
        image={content.fleet[0]?.image}
        keywords="materiel nettoyage, equipe nettoyage maroc, machines nettoyage, entretien bureaux, nettoyage chantier"
        structuredData={[
          buildWebPageSchema({
            name: 'Equipes EMAS Nettoyage',
            path: '/fleet',
            description: 'Equipes et moyens de nettoyage EMAS pour chaque type d intervention.'
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Equipes', path: '/fleet' }
          ])
        ]}
      />
      <section className="inner-hero inner-hero-fleet">
        <div className="container">
          <h1>Equipes et Materiel de Nettoyage</h1>
          <p>Agents formes, superviseurs, machines et produits adaptes pour des interventions propres et fiables.</p>
        </div>
      </section>

      <section className="section fleet-section">
        <div className="container">
          <h2 className="section-title">Categories d Intervention</h2>
          <div className="row g-4 mt-2">
            {content.fleet.map((item, idx) => (
              <motion.div className="col-12 col-lg-4" key={item.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <div className="fleet-card h-100">
                  <img src={item.image} alt={item.name} className="img-fluid fleet-image" />
                  <div className="p-4">
                    <h5>{item.name}</h5>
                    <ul>{item.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Nos Villes</h2>
          <div className="row g-3 mt-2">
            {coverage.map((zone) => (
              <div className="col-sm-6 col-lg-3" key={zone}>
                <div className="coverage-item"><i className="bi bi-geo-alt-fill me-2" />{zone}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section light-area">
        <div className="container">
          <h2 className="section-title">Moyens et Prestations</h2>
          <div className="table-responsive mt-4">
            <table className="table cmpf-table">
              <thead><tr><th>Prestation</th><th>Domicile</th><th>Entreprise</th><th>Evenement</th></tr></thead>
              <tbody>
                <tr><td>Nettoyage regulier</td><td>Oui</td><td>Oui</td><td>Sur demande</td></tr>
                <tr><td>Grand nettoyage</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
                <tr><td>Vitrerie / Facades</td><td>Oui</td><td>Oui</td><td>Selon besoin</td></tr>
                <tr><td>Desinfection</td><td>Oui</td><td>Oui</td><td>Oui</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Qualite et Fiabilite</h2>
          <div className="row g-4 mt-2">
            <div className="col-md-4"><div className="number-card h-100"><h4>Proprete</h4><p>Agents attentifs aux details, aux surfaces sensibles et a la finition.</p></div></div>
            <div className="col-md-4"><div className="number-card h-100"><h4>Securite</h4><p>Produits adaptes, materiel controle et respect des consignes du lieu.</p></div></div>
            <div className="col-md-4"><div className="number-card h-100"><h4>Serenite</h4><p>Planning clair, equipe ponctuelle et suivi apres intervention si besoin.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container text-center">
          <h2>Besoin d une equipe de nettoyage adaptee ?</h2>
          <p className="mb-4">EMAS Nettoyage mobilise rapidement les agents et le materiel selon votre besoin.</p>
          <Link to="/contact" className="btn btn-emergency" onClick={(event) => { event.preventDefault(); window.dispatchEvent(new Event('cmpf-open-book-panel')); }}>Demander une Intervention</Link>
        </div>
      </section>
    </>
  );
}

export default FleetPage;
