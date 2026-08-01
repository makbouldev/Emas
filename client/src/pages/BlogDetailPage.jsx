import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Seo from '../components/Seo';
import { buildBreadcrumbSchema, buildWebPageSchema } from '../seo/schemas';
import { useSiteData } from '../context/SiteDataContext';
import { resolveMediaPath } from '../utils/resolveMediaPath';

function BlogDetailPage() {
  const { apiBaseUrl } = useSiteData();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [notFound, setNotFound] = useState(false);

  const resolveImage = (value) => resolveMediaPath(value, apiBaseUrl);

  useEffect(() => {
    const load = async () => {
      try {
        const [postResponse, postsResponse] = await Promise.all([
          axios.get(`${apiBaseUrl}/api/posts/${postId}`),
          axios.get(`${apiBaseUrl}/api/posts`)
        ]);

        const selectedPost = postResponse.data || null;
        setPost(selectedPost);

        const list = Array.isArray(postsResponse.data) ? postsResponse.data : [];
        const related = list.filter((item) => item.id !== selectedPost?.id).slice(0, 3);
        setRelatedPosts(related);
        setNotFound(false);
      } catch {
        setNotFound(true);
      }
    };

    load();
  }, [apiBaseUrl, postId]);

  const articleDate = useMemo(() => {
    if (!post?.createdAt) return '';
    return new Date(post.createdAt).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }, [post]);

  if (notFound) {
    return <Navigate to="/blog" replace />;
  }

  if (!post) {
    return (
      <section className="section">
        <div className="container">
          <div className="long-card">Chargement de l article...</div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo
        title={`${post.title} | Blog EMAS`}
        description={post.excerpt || 'Article EMAS Assistance'}
        path={`/blog/${post.id}`}
        image={resolveImage(post.image)}
        keywords={`blog emas, ${post.category || 'ambulance'}, assistance medicale`}
        structuredData={[
          buildWebPageSchema({
            name: post.title,
            path: `/blog/${post.id}`,
            description: post.excerpt || 'Article EMAS Assistance'
          }),
          buildBreadcrumbSchema([
            { name: 'Accueil', path: '/' },
            { name: 'Blog', path: '/blog' },
            { name: post.title, path: `/blog/${post.id}` }
          ])
        ]}
      />

      <section className="inner-hero inner-hero-gallery">
        <div className="container">
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
        </div>
      </section>

      <section className="section blog-detail-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-8">
              <article className="blog-detail-card">
                <img src={resolveImage(post.image)} alt={post.title} className="blog-detail-image" />
                <div className="blog-detail-meta">
                  <span><i className="bi bi-calendar-event me-2" />{articleDate || 'Date non disponible'}</span>
                  <span><i className="bi bi-tag-fill me-2" />{post.category || 'Generale'}</span>
                  <span><i className="bi bi-person-fill me-2" />{post.author || 'Equipe EMAS'}</span>
                </div>
                <div className="blog-detail-content">
                  {String(post.content || '')
                    .split('\n')
                    .filter(Boolean)
                    .map((paragraph, index) => (
                      <p key={`${post.id}-${index}`}>{paragraph}</p>
                    ))}
                </div>
              </article>
            </div>

            <div className="col-lg-4">
              <aside className="blog-detail-sidebar">
                <h5>Articles Recents</h5>
                <div className="blog-related-list">
                  {relatedPosts.map((item) => (
                    <Link to={`/blog/${item.id}`} key={item.id} className="blog-related-item">
                      <img src={resolveImage(item.image)} alt={item.title} />
                      <div>
                        <strong>{item.title}</strong>
                        <small>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('fr-FR') : ''}</small>
                      </div>
                    </Link>
                  ))}
                  {relatedPosts.length === 0 && <p className="mb-0">Aucun autre article pour le moment.</p>}
                </div>

                <div className="blog-sidebar-cta mt-4">
                  <h6>Besoin d assistance medicale ?</h6>
                  <p className="mb-3">Notre equipe EMAS est disponible 24/7 pour urgence et transfert.</p>
                  <Link to="/contact" className="btn btn-emergency w-100">Contacter EMAS</Link>
                </div>
              </aside>
            </div>
          </div>

          <div className="mt-4">
            <Link to="/blog" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2" />Retour au Blog
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default BlogDetailPage;


