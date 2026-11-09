import { useState } from 'react';
import { resolveMediaPath } from '../utils/resolveMediaPath';

function ServiceCardImage({ service, defaultIdx = 0 }) {
  const serviceTitle = (service.title || '').toLowerCase();
  const images = (Array.isArray(service.images) && service.images.length > 0)
    ? service.images
    : (serviceTitle.includes('vitre')
      ? ['/services/vitres-1.jpg', '/services/vitres-2.png', '/services/vitres-3.jpg']
      : (serviceTitle.includes('canape') || serviceTitle.includes('tapis')
        ? ['/services/canapes-1.jpg', '/services/canapes-2.jpg', '/services/canapes-3.jpg']
        : (serviceTitle.includes('chantier')
          ? ['/services/chantier-1.jpg', '/services/chantier-2.jpg', '/services/chantier-3.png']
          : (serviceTitle.includes('grand') || serviceTitle.includes('menage')
            ? ['/services/grand-menage-1.png', '/services/grand-menage-2.jpg', '/services/grand-menage-3.png']
            : [service.image || `/${(defaultIdx % 10) + 1}.jpeg`]))));

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentSrc = resolveMediaPath(images[currentIndex]);

  return (
    <div className="home-service-image-wrap">
      <img
        src={currentSrc}
        alt={`${service.title} - ${currentIndex + 1}`}
        className="home-service-img"
        loading="lazy"
      />
      <div className="home-service-badge">
        <i className={`bi ${service.icon || 'bi-stars'}`} />
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="service-img-arrow service-img-arrow-left"
            onClick={prevImage}
            title="Image précédente"
            aria-label="Image précédente"
          >
            <i className="bi bi-chevron-left" />
          </button>
          <button
            type="button"
            className="service-img-arrow service-img-arrow-right"
            onClick={nextImage}
            title="Image suivante"
            aria-label="Image suivante"
          >
            <i className="bi bi-chevron-right" />
          </button>

          <div className="service-img-dots">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`service-img-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(i);
                }}
                aria-label={`Aller à l'image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ServiceCardImage;
