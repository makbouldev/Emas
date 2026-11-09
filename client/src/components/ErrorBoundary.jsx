import React from 'react';
import logo from '../assets/logo.png';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#f8fafc',
          color: '#0f172a',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '36px 28px',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e2e8f0'
          }}>
            <img
              src={logo}
              alt="EMAS Nettoyage"
              style={{ height: '54px', objectFit: 'contain', marginBottom: '20px' }}
            />
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: '#04508d' }}>
              EMAS Nettoyage
            </h2>
            <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>
              Notre service de nettoyage professionnel est à votre disposition partout au Maroc. Contactez notre équipe directement par téléphone ou WhatsApp pour votre devis immédiat.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <a
                href="tel:+212725572550"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#04508d',
                  color: '#ffffff',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '15px'
                }}
              >
                <i className="bi bi-telephone-fill" /> Appeler : +212 725 57 25 50
              </a>
              <a
                href="https://wa.me/212725572550"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '15px'
                }}
              >
                <i className="bi bi-whatsapp" /> WhatsApp direct
              </a>
            </div>

            <button
              onClick={this.handleReload}
              style={{
                background: 'none',
                border: '1px solid #cbd5e1',
                padding: '10px 18px',
                borderRadius: '8px',
                color: '#64748b',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Retour à l&apos;accueil
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
