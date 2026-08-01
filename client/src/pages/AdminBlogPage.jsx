import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Seo from '../components/Seo';
import { useSiteData } from '../context/SiteDataContext';
import { resolveMediaPath } from '../utils/resolveMediaPath';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  image: '',
  category: 'Generale',
  author: 'Equipe EMAS',
  published: true
};

const adminTokenKey = 'cmpf_admin_token';

function AdminBlogPage() {
  const { apiBaseUrl } = useSiteData();

  const [authToken, setAuthToken] = useState(() => localStorage.getItem(adminTokenKey) || '');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authLoading, setAuthLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [posts, setPosts] = useState([]);
  const [overview, setOverview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageStats, setMessageStats] = useState(null);
  const [messageFilter, setMessageFilter] = useState('all');

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const [siteForm, setSiteForm] = useState({
    company: '',
    phone: '',
    phonesText: '',
    email: '',
    heroTitle: '',
    heroSubtitle: '',
    heroCtaPrimary: '',
    heroCtaSecondary: '',
    heroBackgroundImage: 'hero.jpeg'
  });

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const authHeaders = useMemo(
    () => (authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    [authToken]
  );

  const resolveImage = (value) => resolveMediaPath(value, apiBaseUrl);

  const ensureAuthError = (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(adminTokenKey);
      setAuthToken('');
      setIsAuthenticated(false);
      setMessage('Session admin expiree. Reconnectez-vous.');
      return true;
    }
    return false;
  };

  const loadPosts = async () => {
    const response = await axios.get(`${apiBaseUrl}/api/posts?includeDrafts=true`, { headers: authHeaders });
    setPosts(response.data || []);
  };

  const loadOverview = async () => {
    const response = await axios.get(`${apiBaseUrl}/api/admin/overview`, { headers: authHeaders });
    setOverview(response.data || null);
  };

  const loadMessages = async (status = messageFilter) => {
    const response = await axios.get(`${apiBaseUrl}/api/admin/messages?status=${status}`, { headers: authHeaders });
    setMessages(response.data || []);
  };

  const loadMessageStats = async () => {
    const response = await axios.get(`${apiBaseUrl}/api/admin/messages/stats`, { headers: authHeaders });
    setMessageStats(response.data || null);
  };

  const loadSiteContent = async () => {
    const response = await axios.get(`${apiBaseUrl}/api/site-content`, { headers: authHeaders });
    const payload = response.data || {};
    setSiteForm({
      company: payload.company || '',
      phone: payload.phone || '',
      phonesText: Array.isArray(payload.phones) ? payload.phones.join('\n') : '',
      email: payload.email || '',
      heroTitle: payload.hero?.title || '',
      heroSubtitle: payload.hero?.subtitle || '',
      heroCtaPrimary: payload.hero?.ctaPrimary || '',
      heroCtaSecondary: payload.hero?.ctaSecondary || '',
      heroBackgroundImage: payload.hero?.backgroundImage || 'hero.jpeg'
    });
  };

  const loadAll = async () => {
    await Promise.all([loadPosts(), loadOverview(), loadSiteContent(), loadMessages(messageFilter), loadMessageStats()]);
  };

  useEffect(() => {
    if (!authToken) {
      setIsAuthenticated(false);
      return;
    }

    const validateSession = async () => {
      try {
        await axios.get(`${apiBaseUrl}/api/admin/session`, { headers: authHeaders });
        setIsAuthenticated(true);
      } catch (error) {
        ensureAuthError(error);
      }
    };

    validateSession();
  }, [apiBaseUrl, authHeaders, authToken]);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadAll().catch((error) => {
      if (!ensureAuthError(error)) {
        setMessage('Impossible de charger les donnees admin.');
      }
    });
  }, [isAuthenticated, messageFilter]);

  const onAuthInput = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const onAdminLogin = async (event) => {
    event.preventDefault();
    setAuthLoading(true);
    setMessage('');
    try {
      const response = await axios.post(`${apiBaseUrl}/api/admin/login`, authForm);
      const token = response.data?.token || '';
      if (!token) throw new Error('Missing token');
      localStorage.setItem(adminTokenKey, token);
      setAuthToken(token);
      setIsAuthenticated(true);
      setAuthForm({ email: '', password: '' });
      setMessage('Connexion admin reussie.');
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Erreur de connexion admin.');
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  };

  const onAdminLogout = async () => {
    try {
      if (authToken) {
        await axios.post(`${apiBaseUrl}/api/admin/logout`, {}, { headers: authHeaders });
      }
    } catch {
      // noop
    } finally {
      localStorage.removeItem(adminTokenKey);
      setAuthToken('');
      setIsAuthenticated(false);
      setPosts([]);
      setOverview(null);
      setMessages([]);
      setMessageStats(null);
      setMessage('Session fermee.');
    }
  };

  const onInput = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSiteInput = (event) => {
    const { name, value } = event.target;
    setSiteForm((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImage = async (file) => {
    if (!file) return '';
    const payload = new FormData();
    payload.append('image', file);
    const response = await axios.post(`${apiBaseUrl}/api/uploads/image`, payload, {
      headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' }
    });
    return response.data?.url || '';
  };

  const onUploadPostImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Upload image en cours...');
    try {
      const url = await uploadImage(file);
      if (url) {
        setForm((prev) => ({ ...prev, image: url }));
        setMessage('Image du post chargee avec succes.');
      }
    } catch (error) {
      if (!ensureAuthError(error)) setMessage('Erreur upload image post.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const onUploadHeroImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage('Upload image hero en cours...');
    try {
      const url = await uploadImage(file);
      if (url) {
        setSiteForm((prev) => ({ ...prev, heroBackgroundImage: url }));
        setMessage('Image hero chargee avec succes.');
      }
    } catch (error) {
      if (!ensureAuthError(error)) setMessage('Erreur upload image hero.');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const onSubmitPost = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      if (isEditing) {
        await axios.put(`${apiBaseUrl}/api/posts/${editingId}`, form, { headers: authHeaders });
        setMessage('Post modifie avec succes.');
      } else {
        await axios.post(`${apiBaseUrl}/api/posts`, form, { headers: authHeaders });
        setMessage('Post cree avec succes.');
      }
      setForm(emptyForm);
      setEditingId('');
      await Promise.all([loadPosts(), loadOverview()]);
    } catch (error) {
      if (!ensureAuthError(error)) setMessage('Erreur lors de la sauvegarde du post.');
    } finally {
      setLoading(false);
    }
  };

  const onSaveSiteSettings = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const phones = siteForm.phonesText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const payload = {
        company: siteForm.company,
        phone: siteForm.phone,
        phones,
        email: siteForm.email,
        hero: {
          title: siteForm.heroTitle,
          subtitle: siteForm.heroSubtitle,
          ctaPrimary: siteForm.heroCtaPrimary,
          ctaSecondary: siteForm.heroCtaSecondary,
          backgroundImage: siteForm.heroBackgroundImage
        }
      };

      await axios.put(`${apiBaseUrl}/api/site-content`, payload, { headers: authHeaders });
      setMessage('Parametres site mis a jour avec succes.');
      await Promise.all([loadSiteContent(), loadOverview()]);
    } catch (error) {
      if (!ensureAuthError(error)) setMessage('Erreur mise a jour parametres site.');
    } finally {
      setLoading(false);
    }
  };

  const onEdit = (post) => {
    setActiveTab('posts');
    setEditingId(post.id);
    setForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      image: post.image || '',
      category: post.category || 'Generale',
      author: post.author || 'Equipe EMAS',
      published: post.published !== false
    });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Supprimer ce post ?')) return;
    try {
      await axios.delete(`${apiBaseUrl}/api/posts/${id}`, { headers: authHeaders });
      setMessage('Post supprime.');
      await Promise.all([loadPosts(), loadOverview()]);
    } catch (error) {
      if (!ensureAuthError(error)) setMessage('Erreur lors de la suppression.');
    }
  };

  const onUpdateMessageStatus = async (id, status) => {
    try {
      await axios.put(
        `${apiBaseUrl}/api/admin/messages/${id}/status`,
        { status },
        { headers: authHeaders }
      );
      await Promise.all([loadMessages(messageFilter), loadMessageStats(), loadOverview()]);
    } catch (error) {
      if (!ensureAuthError(error)) setMessage('Impossible de changer le statut du message.');
    }
  };

  const onDeleteMessage = async (id) => {
    if (!window.confirm('Supprimer ce message ?')) return;
    try {
      await axios.delete(`${apiBaseUrl}/api/admin/messages/${id}`, { headers: authHeaders });
      await Promise.all([loadMessages(messageFilter), loadMessageStats(), loadOverview()]);
    } catch (error) {
      if (!ensureAuthError(error)) setMessage('Impossible de supprimer le message.');
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Seo title="Connexion Admin" description="Connexion admin EMAS." path="/admin" noindex />
        <section className="inner-hero inner-hero-contact">
          <div className="container">
            <h1>Connexion Admin</h1>
            <p>Connectez-vous avec email et mot de passe pour gerer le site.</p>
          </div>
        </section>

        <section className="section admin-dashboard-section">
          <div className="container">
            {message && <div className="admin-alert mb-4">{message}</div>}
            <div className="admin-login-wrap">
              <form className="contact-form" onSubmit={onAdminLogin}>
                <h5 className="mb-2">Connexion Admin</h5>
                <input
                  type="email"
                  name="email"
                  value={authForm.email}
                  onChange={onAuthInput}
                  placeholder="Email admin"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={authForm.password}
                  onChange={onAuthInput}
                  placeholder="Mot de passe"
                  required
                />
                <button type="submit" className="btn btn-emergency w-100" disabled={authLoading}>
                  {authLoading ? 'Connexion...' : 'Se Connecter'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo title="Tableau de Bord Admin" description="Gestion du contenu EMAS." path="/admin" noindex />

      <section className="inner-hero inner-hero-contact">
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1>EMAS Admin Dashboard</h1>
            <p>Gestion centralisee: posts, contenu du site et messages contact.</p>
          </div>
          <button type="button" className="btn btn-outline-light" onClick={onAdminLogout}>Deconnexion</button>
        </div>
      </section>

      <section className="section admin-dashboard-section">
        <div className="container">
          <div className="admin-toolbar mb-4">
            <button type="button" className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Vue d ensemble</button>
            <button type="button" className={`admin-tab-btn ${activeTab === 'posts' ? 'active' : ''}`} onClick={() => setActiveTab('posts')}>Gestion Blog</button>
            <button type="button" className={`admin-tab-btn ${activeTab === 'site' ? 'active' : ''}`} onClick={() => setActiveTab('site')}>Parametres Site</button>
            <button type="button" className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>Messages CRM</button>
          </div>

          {message && <div className="admin-alert mb-4">{message}</div>}

          {activeTab === 'overview' && (
            <div className="row g-4">
              <div className="col-md-6 col-xl-3"><div className="admin-kpi-card"><h6>Total Posts</h6><strong>{overview?.posts?.total ?? 0}</strong></div></div>
              <div className="col-md-6 col-xl-3"><div className="admin-kpi-card"><h6>Posts Publies</h6><strong>{overview?.posts?.published ?? 0}</strong></div></div>
              <div className="col-md-6 col-xl-3"><div className="admin-kpi-card"><h6>Messages Total</h6><strong>{overview?.contacts?.stats?.total ?? 0}</strong></div></div>
              <div className="col-md-6 col-xl-3"><div className="admin-kpi-card"><h6>Messages Non Lus</h6><strong>{overview?.contacts?.stats?.unread ?? 0}</strong></div></div>

              <div className="col-lg-6">
                <div className="admin-panel h-100">
                  <h5>Derniers Posts</h5>
                  <div className="admin-post-list">
                    {posts.slice(0, 6).map((post) => (
                      <div className="admin-post-item" key={post.id}>
                        <img src={resolveImage(post.image)} alt={post.title} />
                        <div>
                          <strong>{post.title}</strong>
                          <small>{post.published ? 'Publie' : 'Brouillon'}</small>
                        </div>
                        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEdit(post)}>Modifier</button>
                      </div>
                    ))}
                    {posts.length === 0 && <p className="mb-0">Aucun post disponible.</p>}
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="admin-panel h-100">
                  <h5>Statistiques Messages</h5>
                  <ul className="check-list mb-0">
                    <li>Aujourd hui: <strong>{messageStats?.today ?? 0}</strong></li>
                    <li>Cette semaine: <strong>{messageStats?.week ?? 0}</strong></li>
                    <li>Non lus: <strong>{messageStats?.unread ?? 0}</strong></li>
                    <li>Lus: <strong>{messageStats?.read ?? 0}</strong></li>
                    <li>Archives: <strong>{messageStats?.archived ?? 0}</strong></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="row g-4">
              <div className="col-lg-5">
                <form className="contact-form" onSubmit={onSubmitPost}>
                  <h5>{isEditing ? 'Modifier Post' : 'Nouveau Post'}</h5>
                  <input name="title" value={form.title} onChange={onInput} placeholder="Titre" required />
                  <input name="excerpt" value={form.excerpt} onChange={onInput} placeholder="Extrait" required />
                  <textarea name="content" value={form.content} onChange={onInput} rows="6" placeholder="Contenu complet" required />
                  <input name="image" value={form.image} onChange={onInput} placeholder="Image URL" />
                  <div className="admin-file-upload">
                    <label className="form-label mb-1">Ou choisir une image locale</label>
                    <input type="file" accept="image/*" onChange={onUploadPostImage} disabled={uploading} />
                  </div>
                  <div className="admin-image-preview">
                    <img src={resolveImage(form.image)} alt="Apercu du post" />
                  </div>
                  <input name="category" value={form.category} onChange={onInput} placeholder="Categorie" />
                  <input name="author" value={form.author} onChange={onInput} placeholder="Auteur" />
                  <label className="d-flex align-items-center gap-2">
                    <input type="checkbox" name="published" checked={form.published} onChange={onInput} />
                    Publie
                  </label>
                  <button type="submit" className="btn btn-emergency w-100" disabled={loading || uploading}>
                    {loading ? 'Sauvegarde...' : isEditing ? 'Mettre a jour' : 'Publier Post'}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 mt-2"
                      onClick={() => {
                        setEditingId('');
                        setForm(emptyForm);
                      }}
                    >
                      Annuler modification
                    </button>
                  )}
                </form>
              </div>

              <div className="col-lg-7">
                <div className="table-responsive">
                  <table className="table cmpf-table">
                    <thead>
                      <tr>
                        <th>Titre</th>
                        <th>Categorie</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {posts.map((post) => (
                        <tr key={post.id}>
                          <td>{post.title}</td>
                          <td>{post.category || '-'}</td>
                          <td>{post.published ? 'Publie' : 'Brouillon'}</td>
                          <td className="d-flex gap-2">
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onEdit(post)}>Modifier</button>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(post.id)}>Supprimer</button>
                          </td>
                        </tr>
                      ))}
                      {posts.length === 0 && (
                        <tr>
                          <td colSpan="4">Aucun post disponible.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'site' && (
            <div className="row g-4">
              <div className="col-lg-7">
                <form className="contact-form" onSubmit={onSaveSiteSettings}>
                  <h5>Parametres Globaux du Site</h5>
                  <input name="company" value={siteForm.company} onChange={onSiteInput} placeholder="Nom de societe" required />
                  <input name="phone" value={siteForm.phone} onChange={onSiteInput} placeholder="Telephone principal" required />
                  <textarea name="phonesText" rows="4" value={siteForm.phonesText} onChange={onSiteInput} placeholder="Un numero par ligne" />
                  <input name="email" value={siteForm.email} onChange={onSiteInput} placeholder="Email" required />

                  <h6 className="mt-2">Hero</h6>
                  <input name="heroTitle" value={siteForm.heroTitle} onChange={onSiteInput} placeholder="Titre hero" />
                  <textarea name="heroSubtitle" rows="4" value={siteForm.heroSubtitle} onChange={onSiteInput} placeholder="Sous-titre hero" />
                  <input name="heroCtaPrimary" value={siteForm.heroCtaPrimary} onChange={onSiteInput} placeholder="CTA 1" />
                  <input name="heroCtaSecondary" value={siteForm.heroCtaSecondary} onChange={onSiteInput} placeholder="CTA 2" />
                  <input name="heroBackgroundImage" value={siteForm.heroBackgroundImage} onChange={onSiteInput} placeholder="Image hero URL" />

                  <div className="admin-file-upload">
                    <label className="form-label mb-1">Uploader image hero locale</label>
                    <input type="file" accept="image/*" onChange={onUploadHeroImage} disabled={uploading} />
                  </div>

                  <button type="submit" className="btn btn-emergency w-100" disabled={loading || uploading}>
                    {loading ? 'Sauvegarde...' : 'Enregistrer Parametres'}
                  </button>
                </form>
              </div>

              <div className="col-lg-5">
                <div className="admin-panel h-100">
                  <h5>Apercu Image Hero</h5>
                  <div className="admin-image-preview admin-image-preview-lg">
                    <img src={resolveImage(siteForm.heroBackgroundImage)} alt="Apercu hero" />
                  </div>
                  <p className="section-copy mb-0">Les parametres sauvegardes ici sont reutilises dans tout le site (telephone, email, hero).</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="row g-4">
              <div className="col-12">
                <div className="admin-panel mb-3">
                  <div className="d-flex flex-wrap gap-2 align-items-center justify-content-between">
                    <h5 className="mb-0">Messages Contact</h5>
                    <div className="d-flex flex-wrap gap-2">
                      <button type="button" className={`btn btn-sm ${messageFilter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMessageFilter('all')}>Tous</button>
                      <button type="button" className={`btn btn-sm ${messageFilter === 'new' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMessageFilter('new')}>Nouveaux</button>
                      <button type="button" className={`btn btn-sm ${messageFilter === 'read' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMessageFilter('read')}>Lus</button>
                      <button type="button" className={`btn btn-sm ${messageFilter === 'archived' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setMessageFilter('archived')}>Archives</button>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table cmpf-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Nom</th>
                        <th>Telephone</th>
                        <th>Message</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((item) => (
                        <tr key={item.id}>
                          <td>{new Date(item.createdAt).toLocaleString('fr-FR')}</td>
                          <td>{item.name}</td>
                          <td>{item.phone}</td>
                          <td className="admin-message-cell">{item.message || '-'}</td>
                          <td><span className={`message-status status-${item.status || 'new'}`}>{item.status || 'new'}</span></td>
                          <td className="d-flex flex-wrap gap-2">
                            <button type="button" className="btn btn-sm btn-outline-success" onClick={() => onUpdateMessageStatus(item.id, 'read')}>Marquer Lu</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onUpdateMessageStatus(item.id, 'archived')}>Archiver</button>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDeleteMessage(item.id)}>Supprimer</button>
                          </td>
                        </tr>
                      ))}
                      {messages.length === 0 && (
                        <tr>
                          <td colSpan="6">Aucun message pour ce filtre.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default AdminBlogPage;


