import { Link } from 'react-router-dom';

function IndustrialMedicalizationPage() {
  return (
    <>
      <section className="inner-hero">
        <div className="container">
          <h1>Medicalisation des Sites Industriels</h1>
          <p>Dispositif medical preventif et curatif pour usines, chantiers et sites a risques.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <img src="8.jpeg" alt="Medicalisation des sites industriels EMAS" className="img-fluid about-image" />
            </div>
            <div className="col-lg-6">
              <h2 className="section-title text-start mb-3">Presence Medicale Sur Site</h2>
              <p className="section-copy">
                La EMAS deploye des equipes medicales, ambulances et protocoles d intervention adaptes aux contraintes
                des environnements industriels et professionnels.
              </p>
              <ul className="pill-list">
                <li>Poste de secours et infirmerie mobile</li>
                <li>Equipe medicale et paramedicale dediee</li>
                <li>Prise en charge immediate des accidents du travail</li>
                <li>Organisation de transfert vers structures de soins</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section light-area">
        <div className="container">
          <h2 className="section-title">Pourquoi Choisir EMAS</h2>
          <div className="row g-4 mt-1">
            <div className="col-md-4"><div className="partner-card h-100"><h5>Reactivite 24/7</h5><p>Intervention rapide en cas d urgence sur site.</p></div></div>
            <div className="col-md-4"><div className="partner-card h-100"><h5>Protocoles Clairs</h5><p>Procedure medicale standardisee et suivi rigoureux.</p></div></div>
            <div className="col-md-4"><div className="partner-card h-100"><h5>Coordination Totale</h5><p>Lien direct avec ambulance, medecins et hopitaux partenaires.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container text-center">
          <h2>Besoin d une equipe medicale sur votre site ?</h2>
          <p className="mb-4">Nous construisons une solution de medicalisation adaptee a votre activite.</p>
          <Link to="/contact" className="btn btn-emergency">Contacter EMAS</Link>
        </div>
      </section>
    </>
  );
}

export default IndustrialMedicalizationPage;

