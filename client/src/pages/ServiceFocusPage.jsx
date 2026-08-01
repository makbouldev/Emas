import { Navigate, useParams } from 'react-router-dom';
import { serviceFocusMap } from '../data/serviceFocusPages';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schemas';

function ServiceFocusPage() {
  const { slug } = useParams();
  const item = serviceFocusMap[slug];

  if (!item) {
    return <Navigate to="/services" replace />;
  }

  return (
    <>
      <Seo
        title={item.title}
        description={item.subtitle}
        path={`/service-focus/${item.slug}`}
        keywords={`EMAS Assistance, ${item.label.toLowerCase()}, assistance medicale`}
        structuredData={[
          buildWebPageSchema({
            name: item.title,
            path: `/service-focus/${item.slug}`,
            description: item.subtitle
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Services', path: '/services' },
            { name: item.label, path: `/service-focus/${item.slug}` }
          ])
        ]}
      />

      <section className="inner-hero">
        <div className="container">
          <h1>{item.title}</h1>
          <p>{item.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Details du Service</h2>
          <div className="row g-4 mt-2">
            {item.points.map((point, index) => (
              <div className="col-md-4" key={point}>
                <div className="long-card h-100">
                  <h5>Point {index + 1}</h5>
                  <p className="mb-0">{point}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default ServiceFocusPage;

