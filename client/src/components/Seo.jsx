import { useEffect } from 'react';

const SITE_NAME = 'EMAS Nettoyage';
const DEFAULT_SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://emas-nettoyage.vercel.app').replace(/\/+$/, '');
const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/logo.png`;

const setMetaTag = (name, content, isProperty = false) => {
  if (!content) return;
  const safeName = String(name).replace(/"/g, '\\"');
  const selector = isProperty ? `meta[property="${safeName}"]` : `meta[name="${safeName}"]`;
  let meta = document.head.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    if (isProperty) meta.setAttribute('property', name);
    else meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

const setLinkTag = (rel, href) => {
  if (!href) return;
  let link = document.head.querySelector(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', rel);
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const setJsonLd = (id, data) => {
  if (!id) return;
  const safeId = String(id).replace(/[^a-zA-Z0-9_-]/g, '_');
  let script = document.head.querySelector(`script[data-seo-id="${safeId}"]`);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-id', safeId);
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
};

function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  keywords,
  noindex = false,
  structuredData = []
}) {
  useEffect(() => {
    const cleanPath = String(path || '/').split('?')[0].split('#')[0];
    const absolutePath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    const canonicalUrl = `${DEFAULT_SITE_URL}${absolutePath}`;
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    const ogImage = image ? (image.startsWith('http') ? image : `${DEFAULT_SITE_URL}${image}`) : DEFAULT_IMAGE;

    document.title = pageTitle;
    document.documentElement.setAttribute('lang', 'fr');

    setLinkTag('canonical', canonicalUrl);
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    setMetaTag('og:type', type, true);
    setMetaTag('og:title', pageTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:site_name', SITE_NAME, true);
    setMetaTag('og:locale', 'fr_MA', true);

    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', pageTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);

    structuredData.forEach((item, index) => {
      setJsonLd(`${absolutePath}-${index}`, item);
    });
  }, [description, image, keywords, noindex, path, structuredData, title]);

  return null;
}

export default Seo;

