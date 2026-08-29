import React from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useFeaturedProducts';
import homeBg from '../images/home.png';
// IMPORTANTE: Si la imagen no carga, descomenta esta línea y usa homeBg en el backgroundImage
// import homeBg from '../images/home.png';

const Home: React.FC = () => {
  const { products, loading } = useFeaturedProducts();

  return (
    <div style={styles.pageWrapper}>
      {/* Hero principal */}
      <main style={styles.heroSection}>
        <div style={styles.heroBackground} />
        
        <div style={styles.heroContent}>
          <div style={styles.badge}>
            <span style={styles.badgeDot}></span>
            PISOS Y AZULEJOS
          </div>
          
          <h1 style={styles.heroTitle}>
            Revestimientos que <br/>
            <span style={styles.textHighlight}>transforman espacios.</span>
          </h1>
          
          <p style={styles.heroSubtitle}>
            Selección curada de pisos y azulejos para hogares y proyectos que buscan elegancia, calidad y carácter.
          </p>

          <div style={styles.heroButtons}>
            <Link to="/catalog" style={styles.primaryButton}>
              VER CATÁLOGO &rarr;
            </Link>
            <Link to="/about" style={styles.secondaryButtonHero}>
              CONÓCENOS
            </Link>
          </div>
        </div>
      </main>

      {/* Sección Sobre Nosotros */}
      <section style={styles.aboutSection}>
        <div style={styles.aboutContainer}>
          <h2 style={styles.sectionOverline}>SOBRE NOSOTROS</h2>
          <h1 style={styles.sectionTitleLight}>Calidad sin concesiones, diseño con propósito.</h1>
          <div style={styles.accentLineCentered}></div>
          <p style={styles.aboutText}>
            En Revestimento creemos que un piso o azulejo es mucho más que un material: 
            es la base que define la atmósfera de cada espacio. Trabajamos con fabricantes 
            europeos y artesanos locales para ofrecerte piezas que combinan durabilidad, 
            estética contemporánea y un servicio cercano.
          </p>
        </div>
      </section>

      {/* Sección Destacados */}
      <section style={styles.featuredSectionWrapper}>
        <div style={styles.featuredContainer}>
          <div style={styles.featuredHeader}>
            <div>
              <h2 style={styles.sectionOverline}>DESTACADOS</h2>
              <h1 style={styles.sectionTitleDark}>Colecciones del momento</h1>
            </div>
            <Link to="/catalog" style={styles.textLink}>
              Ver todo el catálogo &rarr;
            </Link>
          </div>

          {loading ? (
            <div style={styles.loadingContainer}>
               <div style={styles.spinner}></div>
               <p>Cargando colecciones...</p>
            </div>
          ) : (
            <div style={styles.productsGrid}>
              {products.map((p) => (
                <div key={p.id} style={styles.productCard}>
                  <div style={styles.cardImageWrapper}>
                    <img src={p.image_url} alt={p.name} style={styles.cardImage} />
                    <div style={styles.categoryTag}>{p.category}</div>
                  </div>
                  <div style={styles.cardBody}>
                    <h3 style={styles.cardTitle}>{p.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sección Beneficios */}
      <section style={styles.benefitsSection}>
        <div style={styles.benefitsGrid}>
          {/* Beneficio 1 */}
          <div style={styles.benefitItem}>
            <div style={styles.iconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e1b71f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 12 12 17 22 12"></polyline>
                <polyline points="2 17 12 22 22 17"></polyline>
              </svg>
            </div>
            <h3 style={styles.benefitTitle}>Diseño curado</h3>
            <p style={styles.benefitText}>Cada pieza es minuciosamente seleccionada por nuestro equipo de diseño.</p>
          </div>
          
          {/* Beneficio 2 */}
          <div style={styles.benefitItem}>
            <div style={styles.iconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e1b71f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <polyline points="9 12 11 14 15 10"></polyline>
              </svg>
            </div>
            <h3 style={styles.benefitTitle}>Garantía total</h3>
            <p style={styles.benefitText}>Materiales certificados con garantía extendida para tu tranquilidad.</p>
          </div>

          {/* Beneficio 3 */}
          <div style={styles.benefitItem}>
            <div style={styles.iconWrapper}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e1b71f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
            <h3 style={styles.benefitTitle}>Entrega ágil</h3>
            <p style={styles.benefitText}>Logística propia diseñada para entregas rápidas y seguras en obra.</p>
          </div>
        </div>
      </section>

      {/* Sección Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <div>
            <h1 style={styles.ctaTitle}>¿Listo para diseñar tu espacio?</h1>
            <p style={styles.ctaSubtitle}>Explora nuestro catálogo completo y encuentra la pieza perfecta.</p>
          </div>
          <div style={styles.ctaButtonWrapper}>
            <Link to="/catalog" style={styles.primaryButton}>
              EXPLORAR CATÁLOGO &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- ESTILOS ---
const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  heroSection: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: '#fff',
    overflow: 'hidden',
    padding: '80px 5% 40px 10%', 
  },
 // Ve hasta abajo de tu archivo y reemplaza el heroBackground por esto:
  heroBackground: {
    position: 'absolute',
        inset: 0,
        // 2. Inyecta la variable usando comillas invertidas y ${}
        backgroundImage: `url(${homeBg})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.55)',
        zIndex: -1,
  },
  heroContent: {
    maxWidth: '800px',
    position: 'relative',
    zIndex: 1,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.85rem',
    letterSpacing: '2px',
    fontWeight: 600,
    color: '#e1b71f',
    backgroundColor: 'rgba(225, 183, 31, 0.15)',
    padding: '6px 12px',
    borderRadius: '4px',
    marginBottom: '2rem',
  },
  badgeDot: {
    width: '6px',
    height: '6px',
    backgroundColor: '#e1b71f',
    borderRadius: '50%',
  },
  heroTitle: {
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    marginBottom: '1.5rem',
    fontWeight: 800,
    color: '#ffffff',
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  textHighlight: {
    color: '#f3f4f6',
    opacity: 0.9,
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    marginBottom: '3rem',
    lineHeight: 1.6,
    color: '#e5e7eb',
    maxWidth: '600px',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  primaryButton: {
    backgroundColor: '#e1b71f',
    color: '#111827', // CAMBIO AQUI: Texto gris oscuro en lugar de azul brillante
    padding: '1rem 2rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '1rem',
    boxShadow: '0 4px 14px rgba(225, 183, 31, 0.3)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'inline-block',
    textAlign: 'center',
  },
  secondaryButtonHero: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#ffffff',
    padding: '1rem 2rem',
    borderRadius: '6px',
    textDecoration: 'none',
    fontWeight: 600,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(8px)',
    display: 'inline-block',
    textAlign: 'center',
  },
  
  // Utilidades de Texto
  sectionOverline: {
    fontSize: '0.875rem',
    letterSpacing: '2px',
    marginBottom: '0.75rem',
    color: '#e1b71f',
    fontWeight: 700,
  },
  sectionTitleLight: {
    fontSize: '2.5rem',
    lineHeight: 1.2,
    marginBottom: '1.5rem',
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  sectionTitleDark: {
    fontSize: '2.5rem',
    lineHeight: 1.2,
    marginBottom: '1.5rem',
    fontWeight: 800,
    color: '#111827',
    letterSpacing: '-0.02em',
  },
  accentLineCentered: {
    width: '60px',
    height: '4px',
    backgroundColor: '#e1b71f',
    margin: '0 auto 2rem auto',
    borderRadius: '2px',
  },

  // Sobre Nosotros
  aboutSection: {
    backgroundColor: '#111827',
    padding: '7rem 2rem',
    textAlign: 'center',
    width: '100%',
  },
  aboutContainer: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  aboutText: {
    fontSize: '1.2rem',
    lineHeight: 1.8,
    color: '#9ca3af',
  },

  // Destacados
  featuredSectionWrapper: {
    backgroundColor: '#ffffff',
    width: '100%',
  },
  featuredContainer: {
    padding: '6rem 5%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  featuredHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  textLink: {
    color: '#111827', // CAMBIO AQUI: Link oscuro y elegante
    fontWeight: 600,
    textDecoration: 'none',
    borderBottom: '2px solid #e1b71f',
    paddingBottom: '2px',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '2.5rem',
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
    border: '1px solid #f3f4f6',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImageWrapper: {
    position: 'relative',
    height: '240px',
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryTag: {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#111827', // CAMBIO AQUI: Etiqueta oscura
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 700,
    letterSpacing: '1px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  cardBody: {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    color: '#111827',
    margin: 0,
  },

  // Beneficios
  benefitsSection: {
    backgroundColor: '#f8fafc',
    padding: '6rem 5%',
    width: '100%',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '3rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  benefitItem: {
    textAlign: 'center',
    padding: '2.5rem 2rem',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px -2px rgba(0,0,0,0.03)',
    border: '1px solid #f1f5f9',
  },
  iconWrapper: {
    width: '64px',
    height: '64px',
    margin: '0 auto 1.5rem auto',
    backgroundColor: 'rgba(225, 183, 31, 0.1)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTitle: {
    fontWeight: 800,
    fontSize: '1.25rem',
    color: '#111827',
    marginBottom: '0.75rem',
  },
  benefitText: {
    color: '#64748b',
    lineHeight: 1.6,
    fontSize: '0.95rem',
  },

  // CTA
  ctaSection: {
    backgroundColor: '#111827', // CAMBIO AQUI: Fondo elegante en lugar de azul
    padding: '5rem 5%',
    width: '100%',
  },
  ctaContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '2rem',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    fontWeight: 800,
    color: '#ffffff',
    letterSpacing: '-0.02em',
  },
  ctaSubtitle: {
    fontSize: '1.15rem',
    color: '#9ca3af',
  },
  ctaButtonWrapper: {
    flexShrink: 0,
  },
  
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem 0',
    color: '#6b7280',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #f3f4f6',
    borderTopColor: '#e1b71f',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
};

export default Home;