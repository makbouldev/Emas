import { Link } from 'react-router-dom';

function MedicalCounterVisitPage() {
  return (
    <>
      <section className="inner-hero">
        <div className="container">
          <h1>Contre Visite Medicale</h1>
          <p>Evaluation medicale objective, rapide et structuree pour entreprises et organismes.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6 order-lg-2">
              <img src="9.jpeg" alt="Contre visite medicale EMAS" className="img-fluid about-image" />
            </div>
            <div className="col-lg-6 order-lg-1">
              <h2 className="section-title text-start mb-3">Service de Controle Medical</h2>
              <p className="section-copy">
                La EMAS organise des contre-visites medicales avec des professionnels qualifies pour apporter un avis fiable
                et documente selon les exigences de votre structure.
              </p>
              <ul className="pill-list">
                <li>Planification rapide de la visite</li>
                <li>Evaluation clinique par medecin qualifie</li>
                <li>Rapport medical clair et confidentiel</li>
                <li>Accompagnement administratif si necessaire</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section light-area">
        <div className="container">
          <h2 className="section-title">Avantages Pour Votre Entreprise</h2>
          <div className="row g-4 mt-1">
            <div className="col-md-4"><div className="service-card h-100"><i className="bi bi-clipboard2-check-fill service-icon" /><h5>Decision Rapide</h5><p>Aide a la prise de decision RH et medicale en delais courts.</p></div></div>
            <div className="col-md-4"><div className="service-card h-100"><i className="bi bi-shield-check service-icon" /><h5>Fiabilite</h5><p>Processus rigoureux, conforme et realise par des experts.</p></div></div>
            <div className="col-md-4"><div className="service-card h-100"><i className="bi bi-file-earmark-medical-fill service-icon" /><h5>Tracabilite</h5><p>Documents exploitables pour suivi medical et administratif.</p></div></div>
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container text-center">
          <h2>Vous souhaitez lancer une contre visite ?</h2>
          <p className="mb-4">Nos equipes vous accompagnent de la demande au rapport final.</p>
          <Link to="/contact" className="btn btn-emergency">Demander une Contre Visite</Link>
        </div>
      </section>
    </>
  );
}

export default MedicalCounterVisitPage;

