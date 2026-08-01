const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://cmpfambulance.ma').replace(/\/+$/, '');
const COMPANY_NAME = 'EMAS Assistance';

const toAbsoluteUrl = (path = '/') => {
  if (path.startsWith('http')) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
};

export const buildOrganizationSchema = (content) => ({
  '@context': 'https://schema.org',
  '@type': 'MedicalBusiness',
  '@id': `${SITE_URL}#organization`,
  name: content.company || COMPANY_NAME,
  url: SITE_URL,
  logo: toAbsoluteUrl('/logo.png'),
  image: content?.hero?.backgroundImage || toAbsoluteUrl('/logo.png'),
  telephone: content.phone,
  email: content.email,
  areaServed: ['Agadir', 'Casablanca', 'Fes', 'Laayoune', 'Marrakech', 'Meknes', 'Nador', 'Ouarzazate', 'Oujda', 'Rabat', 'Tanger', 'Tetouan'],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'MA'
  },
  openingHours: 'Mo-Su 00:00-23:59',
  availableLanguage: ['fr', 'ar']
});

export const buildWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}#website`,
  url: SITE_URL,
  name: COMPANY_NAME,
  inLanguage: 'fr-MA'
});

export const buildWebPageSchema = ({ name, path = '/', description }) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${toAbsoluteUrl(path)}#webpage`,
  url: toAbsoluteUrl(path),
  name,
  description,
  isPartOf: { '@id': `${SITE_URL}#website` },
  inLanguage: 'fr-MA'
});

export const buildBreadcrumbSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: toAbsoluteUrl(item.path)
  }))
});

export const buildFaqSchema = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a
    }
  }))
});

