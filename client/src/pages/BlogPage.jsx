import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schemas';
import { useSiteData } from '../context/SiteDataContext';
import { resolveMediaPath } from '../utils/resolveMediaPath';

function BlogPage() {
  const { apiBaseUrl } = useSiteData();
  const [blogPosts, setBlogPosts] = useState([]);
  const resolveImage = (value) => resolveMediaPath(value, apiBaseUrl);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/posts`);
        setBlogPosts(response.data || []);
      } catch {
        setBlogPosts([]);
      }
    };
    load();
  }, [apiBaseUrl]);

  return (
    <>
      <Seo
        title="Blog Ambulance et Assistance"
        description="Conseils, guides et actualites pratiques autour de l ambulance, du transport medical, du rapatriement sanitaire et de l assistance EMAS."
        path="/blog"
        image="8.jpeg"
        keywords="blog ambulance, conseils urgence medicale, transport dialyse, rapatriement sanitaire"
        structuredData={[
          buildWebPageSchema({
            name: 'Blog EMAS Assistance',
            path: '/blog',
            description: 'Articles pratiques autour des services ambulance et assistance medicale.'
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Blog', path: '/blog' }
          ])
        ]}
      />

      <section className="inner-hero inner-hero-gallery">
        <div className="container">
          <h1>Blog EMAS Assistance</h1>
          <p>Articles utiles pour mieux comprendre les services d urgence, transport medical et assistance a domicile.</p>
        </div>
      </section>

      <section className="section blog-section">
        <div className="container">
          <div className="row g-4">
            {blogPosts.map((post) => (
              <div className="col-md-6 col-xl-3" key={post.id || post.title}>
                <article className="blog-card h-100">
                  <Link to={`/blog/${post.id}`} className="blog-card-link">
                    <img src={resolveImage(post.image)} alt={post.title} className="blog-card-image" />
                  </Link>
                  <div className="blog-card-body d-flex flex-column">
                    <small className="blog-date">{post.createdAt ? new Date(post.createdAt).toLocaleDateString('fr-FR') : ''}</small>
                    <h5>{post.title}</h5>
                    <p>{post.excerpt}</p>
                    <Link to={`/blog/${post.id}`} className="btn btn-outline-primary btn-sm mt-auto">
                      Lire l article
                    </Link>
                  </div>
                </article>
              </div>
            ))}
            {blogPosts.length === 0 && (
              <div className="col-12">
                <div className="long-card">Aucun article publie pour le moment.</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container text-center">
          <h2>Besoin d une prise en charge immediate ?</h2>
          <p className="mb-4">Notre equipe repond 24/7 pour urgence, transfert medical et assistance.</p>
          <Link to="/contact" className="btn btn-emergency">Contacter EMAS</Link>
        </div>
      </section>
    </>
  );
}

export default BlogPage;


