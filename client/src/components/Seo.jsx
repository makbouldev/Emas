import { useEffect } from 'react';

const SITE_NAME = 'EMAS Assistance';
const DEFAULT_SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://cmpfambulance.ma').replace(/\/+$/, '');
const DEFAULT_IMAGE = `${DEFAULT_SITE_URL}/logo.png`;

const setMetaTag = (name, content, isProperty = false) => {
  if (!content) return;
  const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
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
  let script = document.head.querySelector(`script[data-seo-id="${id}"]`);
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-id', id);
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
    const absolutePath = path.startsWith('/') ? path : `/${path}`;
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

