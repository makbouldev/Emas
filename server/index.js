const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { randomUUID } = require('crypto');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@cmpf.ma').trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'EMAS@2026';
const ADMIN_TOKEN_TTL_HOURS = Number(process.env.ADMIN_TOKEN_TTL_HOURS || 12);
const OPENAI_API_KEY = String(process.env.OPENAI_API_KEY || '').trim();
const OPENAI_MODEL = String(process.env.OPENAI_MODEL || 'gpt-4o-mini').trim();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const isVercel = Boolean(process.env.VERCEL);
const INITIAL_DATA_DIR = path.join(__dirname, 'data');
const DATA_DIR = isVercel ? path.join('/tmp', 'emas_data') : INITIAL_DATA_DIR;
const UPLOAD_DIR = isVercel ? path.join('/tmp', 'emas_uploads') : path.join(__dirname, 'uploads');
const BLOG_FILE = path.join(DATA_DIR, 'blog-posts.json');
const SITE_CONTENT_FILE = path.join(DATA_DIR, 'site-content.json');
const CONTACT_MESSAGES_FILE = path.join(DATA_DIR, 'contact-messages.json');


const defaultBlogPosts = [
  {
    id: randomUUID(),
    title: 'Que Faire en Cas d Urgence Medicale a Domicile ?',
    excerpt: 'Les reflexes essentiels avant l arrivee de l ambulance.',
    content: 'Garder le calme, donner des informations claires et preparer les documents utiles permet une prise en charge plus rapide.',
    image: '/3.jpeg',
    category: 'Urgence',
    author: 'Equipe EMAS',
    published: true,
    createdAt: '2026-02-12T10:00:00.000Z',
    updatedAt: '2026-02-12T10:00:00.000Z'
  },
  {
    id: randomUUID(),
    title: 'Transport Dialyse: Comment Bien Organiser les Trajets',
    excerpt: 'Planification, ponctualite et confort du patient.',
    content: 'Une bonne organisation des horaires et un suivi regulier ameliorent l experience du patient et de sa famille.',
    image: '/6.jpeg',
    category: 'Transport',
    author: 'Equipe EMAS',
    published: true,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-02-10T10:00:00.000Z'
  }
];

const defaultSiteContent = {
  company: 'EMAS Assistance',
  phone: '+212 522 49 16 16',
  phones: ['+212 522 49 16 16', '+212 522 20 71 11', '+212 522 22 06 92'],
  email: 'cmpfcasa@cmpfassistance.ma',
  hero: {
    title: 'Ambulance et Assistance Medicale',
    subtitle:
      'Sur un simple appel et a tout moment, la EMAS intervient pour le transport, le rapatriement sanitaire et l assistance medicale avec rapidite et promptitude.',
    ctaPrimary: 'Demander une Assistance',
    ctaSecondary: 'Voir Tous Les Services',
    backgroundImage: '/hero.jpeg'
  },
  services: [
    {
      title: 'Ambulance Medicalisee',
      description: 'Prise en charge medicale immediate avec equipements adaptes selon l urgence.',
      icon: 'bi-heart-pulse'
    },
    {
      title: 'Ambulance avec Medecin',
      description: 'Mobilisation d une ambulance avec medecin et/ou infirmier(e) si la situation l exige.',
      icon: 'bi-hospital'
    },
    {
      title: 'Medecin et Infirmier a Domicile',
      description: 'Intervention a domicile pour soins medicaux, infirmiers et suivi apres hospitalisation.',
      icon: 'bi-house-heart'
    },
    {
      title: 'Hospitalisation a Domicile',
      description: 'Organisation d une prise en charge medicale a domicile avec intervenants qualifies.',
      icon: 'bi-hospital-fill'
    },
    {
      title: 'Transport Dialyse',
      description: 'Transport programme et securise des patients pour les seances de dialyse.',
      icon: 'bi-truck'
    },
    {
      title: 'Couveuse et Heliport',
      description: 'Solutions specialisees pour le transfert neonatal et les evacuations specifiques.',
      icon: 'bi-airplane'
    },
    {
      title: 'Assistance Psychologique',
      description: 'Soutien psychologique en cas d evenement traumatisant.',
      icon: 'bi-person-hearts'
    },
    {
      title: 'Evenements Speciaux',
      description: 'Presence d ambulance(s), infirmerie mobile et equipe medicale pendant tout evenement.',
      icon: 'bi-shield-check'
    }
  ],
  story: {
    heading: 'Une Assistance Complete et Rapide',
    content:
      'La EMAS assure le transfert vers des structures de soins, le rapatriement sanitaire, la constitution du dossier administratif et l organisation d evacuations locoregionales ou de rapatriements si necessaire. Pour les cas hors urgence, nous recherchons et mobilisons medecins, infirmiers, intervenants paramedicaux et materiel medical.',
    image: '/1.jpeg'
  },
  fleet: [
    {
      name: 'Ambulance Urgence',
      image: '/2.jpeg',
      details: ['Intervention immediate', 'Materiel de premiers soins', 'Prise en charge 24/7', 'Equipe qualifiee']
    },
    {
      name: 'Ambulance Medicalisee',
      image: '/3.jpeg',
      details: ['Monitoring medical', 'Oxygene et equipements', 'Accompagnement medical', 'Transport securise']
    },
    {
      name: 'Transport Specialise',
      image: '/4.jpeg',
      details: ['Couveuse', 'Dialyse', 'Rapatriement', 'Evacuation locoregionale']
    }
  ],
  gallery: ['/5.jpeg', '/6.jpeg', '/7.jpeg', '/8.jpeg', '/9.jpeg', '/10.jpeg'],
  stats: [
    { label: 'Espaces Nettoyes', value: '1200+' },
    { label: 'Interventions Mensuelles', value: '350+' },
    { label: 'Agents Formes', value: '80+' },
    { label: 'Clients Satisfaits', value: '98%' }
  ],
  partners: [
    { name: 'Atlas Bureaux', initials: 'AB', logo: '/partners/atlas-bureaux.svg' },
    { name: 'Casa Syndic', initials: 'CS', logo: '/partners/casa-syndic.svg' },
    { name: 'Riad Services', initials: 'RS', logo: '/partners/riad-services.svg' },
    { name: 'Nova Events', initials: 'NE', logo: '/partners/nova-events.svg' },
    { name: 'Clinique Al Amal', initials: 'CA', logo: '/partners/clinique-al-amal.svg' },
    { name: 'Market Pro', initials: 'MP', logo: '/partners/market-pro.svg' }
  ],
  testimonials: [
    {
      name: 'Client EMAS',
      role: 'Transport Medical',
      text: 'Avec EMAS Assistance, chaque deplacement devient une experience unique, securisee et rassurante.'
    },
    {
      name: 'Famille Patient',
      role: 'Assistance a Domicile',
      text: 'Nos ambulanciers qualifies et attentifs placent le confort et la securite au coeur de leur mission.'
    },
    {
      name: 'Partenaire Entreprise',
      role: 'Prise en charge sur site',
      text: 'Vehicules conventionnes, modernes et equipes: fiabilite et serenite de jour comme de nuit.'
    }
  ]
};

const ensureDir = (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (_e) {
    // Ignore error if directory creation fails on read-only system
  }
};

const ensureJsonStorage = (filePath, fallbackData) => {
  ensureDir(path.dirname(filePath));
  if (!fs.existsSync(filePath)) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(fallbackData, null, 2), 'utf8');
    } catch (_e) {
      // Ignore write errors if filesystem is read-only
    }
  }
};

const readJsonFile = (filePath, fallbackData) => {
  ensureJsonStorage(filePath, fallbackData);
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
    const initialFilePath = path.join(INITIAL_DATA_DIR, path.basename(filePath));
    if (fs.existsSync(initialFilePath)) {
      const raw = fs.readFileSync(initialFilePath, 'utf8');
      return JSON.parse(raw);
    }
    return fallbackData;
  } catch {
    return fallbackData;
  }
};

const writeJsonFile = (filePath, payload) => {
  ensureDir(path.dirname(filePath));
  try {
    fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write JSON file:', e.message);
  }
};

const readBlogPosts = () => {
  const posts = readJsonFile(BLOG_FILE, defaultBlogPosts);
  if (!Array.isArray(posts)) return [];
  return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const saveBlogPosts = (posts) => {
  writeJsonFile(BLOG_FILE, Array.isArray(posts) ? posts : []);
};

const readSiteContent = () => {
  const payload = readJsonFile(SITE_CONTENT_FILE, defaultSiteContent);
  if (!payload || typeof payload !== 'object') {
    return defaultSiteContent;
  }
  return { ...defaultSiteContent, ...payload };
};

const saveSiteContent = (content) => {
  writeJsonFile(SITE_CONTENT_FILE, content);
};

const readContactMessages = () => {
  const messages = readJsonFile(CONTACT_MESSAGES_FILE, []);
  if (!Array.isArray(messages)) return [];
  return messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

const saveContactMessages = (messages) => {
  writeJsonFile(CONTACT_MESSAGES_FILE, Array.isArray(messages) ? messages : []);
};

const computeContactStats = (messages) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - ((startOfWeek.getDay() + 6) % 7));

  const total = messages.length;
  const unread = messages.filter((msg) => msg.status !== 'read' && msg.status !== 'archived').length;
  const read = messages.filter((msg) => msg.status === 'read').length;
  const archived = messages.filter((msg) => msg.status === 'archived').length;
  const today = messages.filter((msg) => new Date(msg.createdAt) >= startOfDay).length;
  const week = messages.filter((msg) => new Date(msg.createdAt) >= startOfWeek).length;

  return { total, unread, read, archived, today, week };
};

const adminSessions = new Map();

const cleanupExpiredSessions = () => {
  const now = Date.now();
  for (const [token, session] of adminSessions.entries()) {
    if (!session?.expiresAt || session.expiresAt <= now) {
      adminSessions.delete(token);
    }
  }
};

const createAdminSession = () => {
  cleanupExpiredSessions();
  const token = `${randomUUID()}-${randomUUID()}`;
  const issuedAt = Date.now();
  const expiresAt = issuedAt + ADMIN_TOKEN_TTL_HOURS * 60 * 60 * 1000;
  adminSessions.set(token, { email: ADMIN_EMAIL, issuedAt, expiresAt });
  return { token, expiresAt };
};

const extractBearerToken = (req) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return '';
  return authHeader.slice(7).trim();
};

const requireAdminAuth = (req, res, next) => {
  cleanupExpiredSessions();
  const token = extractBearerToken(req);
  if (!token) {
    return res.status(401).json({ success: false, message: 'Admin authentication required.' });
  }

  const session = adminSessions.get(token);
  if (!session || session.expiresAt <= Date.now()) {
    adminSessions.delete(token);
    return res.status(401).json({ success: false, message: 'Session expired. Please login again.' });
  }

  req.admin = { email: session.email, token, expiresAt: session.expiresAt };
  return next();
};

ensureDir(UPLOAD_DIR);
app.use('/uploads', express.static(UPLOAD_DIR));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'EMAS Assistance API' });
});

app.post('/api/admin/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
  }

  const session = createAdminSession();
  return res.json({
    success: true,
    token: session.token,
    expiresAt: session.expiresAt,
    email: ADMIN_EMAIL
  });
});

app.post('/api/admin/logout', requireAdminAuth, (req, res) => {
  adminSessions.delete(req.admin.token);
  return res.json({ success: true });
});

app.get('/api/admin/session', requireAdminAuth, (req, res) => {
  return res.json({ success: true, email: req.admin.email, expiresAt: req.admin.expiresAt });
});

app.get('/api/site-content', (_req, res) => {
  res.json(readSiteContent());
});

app.put('/api/site-content', requireAdminAuth, (req, res) => {
  const body = req.body || {};
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ success: false, message: 'Invalid payload.' });
  }

  const current = readSiteContent();
  const next = {
    ...current,
    company: body.company ?? current.company,
    phone: body.phone ?? current.phone,
    phones: Array.isArray(body.phones) && body.phones.length ? body.phones : current.phones,
    email: body.email ?? current.email,
    hero: {
      ...current.hero,
      ...(body.hero || {})
    }
  };

  saveSiteContent(next);
  return res.json({ success: true, data: next });
});

app.post('/api/contact', (req, res) => {
  const { name, phone, message } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: 'Nom et telephone sont obligatoires.'
    });
  }

  const contactEntry = {
    id: randomUUID(),
    name: String(name).trim(),
    phone: String(phone).trim(),
    message: String(message || '').trim(),
    status: 'new',
    source: 'contact-page',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const messages = readContactMessages();
  messages.unshift(contactEntry);
  saveContactMessages(messages);

  return res.json({
    success: true,
    message: 'Demande recue. L equipe EMAS vous contactera rapidement.',
    data: {
      name: contactEntry.name,
      phone: contactEntry.phone,
      message: contactEntry.message
    }
  });
});

const fallbackAssistantReply = (message, siteContent, lang = 'fr') => {
  const normalized = String(message || '').toLowerCase();
  const phones = Array.isArray(siteContent?.phones) && siteContent.phones.length ? siteContent.phones : [siteContent?.phone].filter(Boolean);
  const primaryPhone = phones[0] || '+212 522 49 16 16';
  const services = Array.isArray(siteContent?.services) ? siteContent.services.map((item) => item.title).filter(Boolean).slice(0, 5) : [];

  if (/urgence|urgent|emergency|accident|douleur|saignement|respire|respiration/.test(normalized)) {
    if (lang === 'ar') {
      return `إذا كانت الحالة خطيرة، اتصلوا فوراً على ${primaryPhone}. اذكروا العنوان بدقة وعدد المرضى والحالة العامة.`;
    }
    if (lang === 'en') {
      return `If this is life-threatening, call ${primaryPhone} immediately. Share exact address, number of patients, and current condition.`;
    }
    return `Si c est une urgence vitale, appelez immediatement le ${primaryPhone}. Donnez l adresse exacte, le nombre de patients et l etat general.`;
  }

  if (/prix|tarif|cout|cost|combien/.test(normalized)) {
    if (lang === 'ar') {
      return `الأسعار تعتمد على المدينة والمسافة ومستوى التجهيز الطبي. اتصلوا على ${primaryPhone} للحصول على تسعيرة سريعة.`;
    }
    if (lang === 'en') {
      return `Pricing depends on city, distance, and medical equipment level. Please call ${primaryPhone} for a quick quote.`;
    }
    return `Les tarifs dependent de la ville, de la distance et du niveau de medicalisation. Appelez le ${primaryPhone} pour un devis rapide.`;
  }

  if (/dialyse|transport/.test(normalized)) {
    if (lang === 'ar') {
      return 'نعم، نوفر النقل الطبي المبرمج بما فيه نقل حصص التصفية. يمكننا تنظيم جدول منتظم حسب مواعيدكم.';
    }
    if (lang === 'en') {
      return 'Yes, we provide scheduled medical transport, including dialysis trips. We can arrange a recurring schedule based on your timings.';
    }
    return `Oui, nous assurons le transport medical programme, y compris les trajets de dialyse. Nous pouvons organiser un planning regulier selon vos horaires.`;
  }

  if (/disponible|horaire|24|nuit|weekend/.test(normalized)) {
    if (lang === 'ar') {
      return 'خدمة المساعدة متوفرة 24/7، بما في ذلك الليل وعطلة نهاية الأسبوع والعطل الرسمية.';
    }
    if (lang === 'en') {
      return 'Our assistance is available 24/7, including nights, weekends, and public holidays.';
    }
    return 'Notre assistance est disponible 24/7, y compris nuits, weekends et jours feries.';
  }

  if (/service|prestation|offre/.test(normalized) && services.length) {
    if (lang === 'ar') {
      return `الخدمات الرئيسية: ${services.join('، ')}. يمكنني أيضاً توجيهكم حسب حاجتكم بدقة.`;
    }
    if (lang === 'en') {
      return `Main services: ${services.join(', ')}. I can also guide you based on your exact need.`;
    }
    return `Services principaux: ${services.join(', ')}. Je peux aussi vous orienter selon votre besoin exact.`;
  }

  if (lang === 'ar') {
    return `يمكنني المساعدة في: الطوارئ، النقل الطبي، الديال، والتوفر 24/7. للحالات المستعجلة اتصلوا على ${primaryPhone}.`;
  }
  if (lang === 'en') {
    return `I can help with emergency support, medical transport, dialysis trips, and 24/7 availability. For immediate help, call ${primaryPhone}.`;
  }
  return `Je peux vous aider pour: urgence, transport medical, dialyse, disponibilite 24/7 et contact rapide. Pour une prise en charge immediate, appelez ${primaryPhone}.`;
};

const detectAssistantLanguage = (text) => {
  const input = String(text || '').trim();
  if (!input) return 'fr';

  if (/[\u0600-\u06FF]/.test(input)) {
    return 'ar';
  }

  const lower = input.toLowerCase();
  const englishHints = [
    'the', 'and', 'is', 'are', 'can', 'how', 'book', 'ambulance', 'price', 'cost', 'urgent', 'help', 'contact'
  ];
  const frenchHints = [
    'bonjour', 'salut', 'urgence', 'ambulance', 'prix', 'tarif', 'comment', 'transport', 'dialyse', 'contact'
  ];

  const englishScore = englishHints.filter((word) => lower.includes(word)).length;
  const frenchScore = frenchHints.filter((word) => lower.includes(word)).length;

  if (englishScore > frenchScore) return 'en';
  return 'fr';
};

const extractAssistantText = (payload) => {
  const direct = String(payload?.output_text || '').trim();
  if (direct) return direct;

  const outputs = Array.isArray(payload?.output) ? payload.output : [];
  const chunks = [];
  for (const item of outputs) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (part?.type === 'output_text' && typeof part?.text === 'string') {
        const text = part.text.trim();
        if (text) chunks.push(text);
      }
    }
  }
  return chunks.join('\n').trim();
};

app.post('/api/assistant/chat', async (req, res) => {
  const rawMessages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const singleMessage = String(req.body?.message || '').trim();
  const messages = rawMessages
    .filter((item) => item && (item.role === 'user' || item.role === 'assistant'))
    .map((item) => ({
      role: item.role,
      content: String(item.content || '').trim().slice(0, 2000)
    }))
    .filter((item) => item.content);

  if (!messages.length && singleMessage) {
    messages.push({ role: 'user', content: singleMessage.slice(0, 2000) });
  }

  const userMessage = [...messages].reverse().find((item) => item.role === 'user')?.content || '';
  if (!userMessage) {
    return res.status(400).json({ success: false, message: 'Message is required.' });
  }

  const siteContent = readSiteContent();
  const replyLanguage = detectAssistantLanguage(userMessage);
  const fallbackReply = fallbackAssistantReply(userMessage, siteContent, replyLanguage);

  if (!OPENAI_API_KEY) {
    return res.json({ success: true, reply: fallbackReply, source: 'fallback', sourceReason: 'no_api_key' });
  }

  try {
    const phones = Array.isArray(siteContent?.phones) && siteContent.phones.length ? siteContent.phones.join(' | ') : siteContent?.phone || '';
    const serviceTitles = Array.isArray(siteContent?.services) ? siteContent.services.map((item) => item.title).filter(Boolean).join(', ') : '';
    const systemPrompt =
      `You are EMAS Assistance chat helper for a Moroccan ambulance and medical transport company.\n` +
      `Write concise, practical answers only in Arabic, French, or English.\n` +
      `Use this output language now: ${replyLanguage}.\n` +
      `If the user writes in another variant (including Darija/Arabizi), normalize to French.\n` +
      `Do not diagnose. For life-threatening emergencies, instruct user to call immediately.\n` +
      `Company phone(s): ${phones || 'N/A'}.\n` +
      `Email: ${siteContent?.email || 'N/A'}.\n` +
      `Core services: ${serviceTitles || 'Ambulance and medical transport'}.\n` +
      `If unknown, say you do not know and ask for a phone call.\n` +
      `Keep response under 120 words.`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        input: [
          { role: 'system', content: [{ type: 'input_text', text: systemPrompt }] },
          ...messages.slice(-8).map((item) => ({
            role: item.role,
            content: [{ type: 'input_text', text: item.content }]
          }))
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const raw = await response.text();
      console.error('Assistant API error:', raw);
      return res.json({
        success: true,
        reply: fallbackReply,
        source: 'fallback',
        sourceReason: `openai_http_${response.status}`
      });
    }

    const payload = await response.json();
    const aiReply = extractAssistantText(payload);
    if (!aiReply) {
      return res.json({ success: true, reply: fallbackReply, source: 'fallback', sourceReason: 'empty_output' });
    }

    return res.json({ success: true, reply: aiReply, source: 'openai' });
  } catch (error) {
    console.error('Assistant endpoint error:', error.message);
    const errorCode = error?.name === 'AbortError' ? 'request_timeout' : 'request_exception';
    return res.json({ success: true, reply: fallbackReply, source: 'fallback', sourceReason: errorCode });
  }
});

app.get('/api/posts', (req, res) => {
  const includeDrafts = req.query.includeDrafts === 'true';
  const posts = readBlogPosts();
  const filtered = includeDrafts ? posts : posts.filter((post) => post.published !== false);
  res.json(filtered);
});

app.get('/api/posts/:id', (req, res) => {
  const { id } = req.params;
  const includeDrafts = req.query.includeDrafts === 'true';
  const posts = readBlogPosts();
  const post = posts.find((item) => item.id === id);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Post introuvable.' });
  }

  if (!includeDrafts && post.published === false) {
    return res.status(404).json({ success: false, message: 'Post introuvable.' });
  }

  return res.json(post);
});

app.post('/api/posts', requireAdminAuth, (req, res) => {
  const { title, excerpt, content, image, category, author, published } = req.body || {};
  if (!title || !excerpt || !content) {
    return res.status(400).json({ success: false, message: 'title, excerpt et content sont obligatoires.' });
  }

  const now = new Date().toISOString();
  const post = {
    id: randomUUID(),
    title: String(title).trim(),
    excerpt: String(excerpt).trim(),
    content: String(content).trim(),
    image: image ? String(image).trim() : '/5.jpeg',
    category: category ? String(category).trim() : 'Generale',
    author: author ? String(author).trim() : 'Equipe EMAS',
    published: published !== false,
    createdAt: now,
    updatedAt: now
  };

  const posts = readBlogPosts();
  posts.unshift(post);
  saveBlogPosts(posts);
  return res.status(201).json(post);
});

app.put('/api/posts/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const posts = readBlogPosts();
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Post introuvable.' });
  }

  const current = posts[index];
  const updated = {
    ...current,
    title: req.body?.title ? String(req.body.title).trim() : current.title,
    excerpt: req.body?.excerpt ? String(req.body.excerpt).trim() : current.excerpt,
    content: req.body?.content ? String(req.body.content).trim() : current.content,
    image: req.body?.image ? String(req.body.image).trim() : current.image,
    category: req.body?.category ? String(req.body.category).trim() : current.category,
    author: req.body?.author ? String(req.body.author).trim() : current.author,
    published: typeof req.body?.published === 'boolean' ? req.body.published : current.published,
    updatedAt: new Date().toISOString()
  };

  posts[index] = updated;
  saveBlogPosts(posts);
  return res.json(updated);
});

app.delete('/api/posts/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const posts = readBlogPosts();
  const next = posts.filter((post) => post.id !== id);
  if (next.length === posts.length) {
    return res.status(404).json({ success: false, message: 'Post introuvable.' });
  }
  saveBlogPosts(next);
  return res.json({ success: true });
});

app.post('/api/uploads/image', requireAdminAuth, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required.' });
  }
  const publicUrl = `/uploads/${req.file.filename}`;
  return res.status(201).json({ success: true, url: publicUrl, filename: req.file.filename });
});

app.get('/api/admin/messages', requireAdminAuth, (req, res) => {
  const status = String(req.query.status || 'all').toLowerCase();
  const messages = readContactMessages();
  const filtered = status === 'all' ? messages : messages.filter((msg) => (msg.status || 'new') === status);
  return res.json(filtered);
});

app.get('/api/admin/messages/stats', requireAdminAuth, (_req, res) => {
  const messages = readContactMessages();
  return res.json(computeContactStats(messages));
});

app.put('/api/admin/messages/:id/status', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const nextStatus = String(req.body?.status || '').toLowerCase();
  const allowed = ['new', 'read', 'archived'];

  if (!allowed.includes(nextStatus)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }

  const messages = readContactMessages();
  const index = messages.findIndex((msg) => msg.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Message introuvable.' });
  }

  const updated = {
    ...messages[index],
    status: nextStatus,
    updatedAt: new Date().toISOString()
  };

  messages[index] = updated;
  saveContactMessages(messages);
  return res.json({ success: true, data: updated });
});

app.delete('/api/admin/messages/:id', requireAdminAuth, (req, res) => {
  const { id } = req.params;
  const messages = readContactMessages();
  const next = messages.filter((msg) => msg.id !== id);
  if (next.length === messages.length) {
    return res.status(404).json({ success: false, message: 'Message introuvable.' });
  }
  saveContactMessages(next);
  return res.json({ success: true });
});

app.get('/api/admin/overview', requireAdminAuth, (_req, res) => {
  const posts = readBlogPosts();
  const siteContent = readSiteContent();
  const messages = readContactMessages();
  const messageStats = computeContactStats(messages);
  const publishedCount = posts.filter((post) => post.published !== false).length;
  const draftCount = posts.length - publishedCount;

  res.json({
    posts: {
      total: posts.length,
      published: publishedCount,
      drafts: draftCount
    },
    contacts: {
      mainPhone: siteContent.phone,
      phones: siteContent.phones,
      email: siteContent.email,
      stats: messageStats
    },
    updatedAt: new Date().toISOString()
  });
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: error.message });
  }
  if (error) {
    return res.status(400).json({ success: false, message: error.message || 'Unexpected error.' });
  }
  return res.status(500).json({ success: false, message: 'Unexpected server error.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`EMAS Assistance backend running on port ${PORT}`);
  });
}

module.exports = app;


