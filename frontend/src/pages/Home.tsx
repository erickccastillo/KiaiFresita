import React, { useEffect, useRef, useState } from 'react';
import vaso from '../images/vaso.png';

const TRAIL_MAX_POINTS = 60;
const TRAIL_HEAD_R = 140;
const TRAIL_NOISE_AMP = 44;
const TRAIL_BLOB_PTS = 24;
const TRAIL_FADE_SPEED = 0.92;
const TRAIL_SAMPLE_DIST = 8;

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(true);
  
  const stageRef = useRef<HTMLElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const bgLayerRef = useRef<HTMLDivElement>(null);
  const topLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Entrance Animation Cleanup
    const animTimer = setTimeout(() => {
      setIsAnimating(false);
    }, 6000);

    // 2. Mouse Morph-Reveal Trail Logic
    const stage = stageRef.current;
    const product = productRef.current;
    const bgLayer = bgLayerRef.current;
    const topLayer = topLayerRef.current;

    if (!stage || !product || !bgLayer || !topLayer) return;

    const canvasBG = document.createElement('canvas');
    const ctxBG = canvasBG.getContext('2d', { willReadFrequently: true });
    
    const canvasTOP = document.createElement('canvas');
    const ctxTOP = canvasTOP.getContext('2d', { willReadFrequently: true });

    if (!ctxBG || !ctxTOP) return;

    let width = 0;
    let height = 0;
    let hovering = false;
    let headRadius = 0;
    let points: Array<{x: number, y: number, r: number, alpha: number, seed: number}> = [];
    let mouseX = 0, mouseY = 0;
    let t = 0;
    let lastSampleX = -999, lastSampleY = -999;
    let isDrawing = false;
    let rafId: number;

    const resizeCanvases = () => {
      const rect = product.getBoundingClientRect();
      const newW = Math.max(1, rect.width);
      const newH = Math.max(1, rect.height);
      if (newW !== width || newH !== height) {
        width = newW;
        height = newH;
        canvasBG.width = width;
        canvasBG.height = height;
        canvasTOP.width = width;
        canvasTOP.height = height;
      }
    };

    const handleMouseEnter = () => { hovering = true; startLoop(); };
    const handleMouseLeave = () => { hovering = false; };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = product.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    stage.addEventListener('mouseenter', handleMouseEnter);
    stage.addEventListener('mouseleave', handleMouseLeave);
    stage.addEventListener('mousemove', handleMouseMove);

    const drawMorphBlob = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, time: number, seed: number) => {
      if (r < 2) return;
      ctx.beginPath();
      const pts = [];
      for (let i = 0; i < TRAIL_BLOB_PTS; i++) {
        const angle = (i / TRAIL_BLOB_PTS) * Math.PI * 2;
        const n1 = Math.sin(angle * 3 + time * 1.4 + seed) * 0.45;
        const n2 = Math.sin(angle * 5 - time * 0.9 + seed * 2.3) * 0.3;
        const n3 = Math.cos(angle * 2 + time * 1.8 + seed * 0.7) * 0.25;
        const noise = (n1 + n2 + n3) * TRAIL_NOISE_AMP * (r / TRAIL_HEAD_R);
        const finalR = Math.max(0, r + noise);
        
        pts.push({
          x: cx + Math.cos(angle) * finalR,
          y: cy + Math.sin(angle) * finalR
        });
      }

      ctx.moveTo((pts[0].x + pts[pts.length - 1].x) / 2, (pts[0].y + pts[pts.length - 1].y) / 2);
      for (let i = 0; i < pts.length; i++) {
        const p1 = pts[i];
        const p2 = pts[(i + 1) % pts.length];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
      }
      ctx.closePath();
      ctx.fill();
    };

    const renderFrame = () => {
      resizeCanvases();

      const targetR = hovering ? TRAIL_HEAD_R : 0;
      headRadius += (targetR - headRadius) * (hovering ? 0.14 : 0.04);
      t += 0.016;

      if (hovering && headRadius > 5) {
        const dist = Math.hypot(mouseX - lastSampleX, mouseY - lastSampleY);
        if (dist > TRAIL_SAMPLE_DIST) {
          points.unshift({
            x: mouseX,
            y: mouseY,
            r: headRadius,
            alpha: 1,
            seed: Math.random() * 100
          });
          if (points.length > TRAIL_MAX_POINTS) {
            points.pop();
          }
          lastSampleX = mouseX;
          lastSampleY = mouseY;
        }
      }

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.alpha *= TRAIL_FADE_SPEED;
        p.r *= 0.995;
        if (p.alpha < 0.01) {
          points.splice(i, 1);
        }
      }

      if (!hovering && headRadius < 1 && points.length === 0) {
        bgLayer.style.maskImage = bgLayer.style.webkitMaskImage = 'none';
        topLayer.style.maskImage = topLayer.style.webkitMaskImage = 'linear-gradient(#0000, #0000)';
        isDrawing = false;
        return; 
      }

      ctxBG.globalCompositeOperation = 'source-over';
      ctxBG.fillStyle = 'white';
      ctxBG.fillRect(0, 0, width, height);
      ctxBG.globalCompositeOperation = 'destination-out';
      ctxBG.fillStyle = 'black'; 
      
      points.forEach(p => {
        ctxBG.globalAlpha = p.alpha;
        drawMorphBlob(ctxBG, p.x, p.y, p.r, t, p.seed);
      });
      ctxBG.globalAlpha = 1.0;

      ctxTOP.globalCompositeOperation = 'source-over';
      ctxTOP.clearRect(0, 0, width, height);
      ctxTOP.fillStyle = 'white';
      
      points.forEach(p => {
        ctxTOP.globalAlpha = p.alpha;
        drawMorphBlob(ctxTOP, p.x, p.y, p.r, t, p.seed);
      });
      ctxTOP.globalAlpha = 1.0;

      const dataBG = canvasBG.toDataURL();
      const dataTOP = canvasTOP.toDataURL();
      bgLayer.style.maskImage = bgLayer.style.webkitMaskImage = `url(${dataBG})`;
      topLayer.style.maskImage = topLayer.style.webkitMaskImage = `url(${dataTOP})`;

      rafId = requestAnimationFrame(renderFrame);
    };

    const startLoop = () => {
      if (!isDrawing) {
        isDrawing = true;
        t = performance.now() / 1000;
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    return () => {
      clearTimeout(animTimer);
      cancelAnimationFrame(rafId);
      stage.removeEventListener('mouseenter', handleMouseEnter);
      stage.removeEventListener('mouseleave', handleMouseLeave);
      stage.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@700&display=swap');

        :root {
          /* Kiai Fresita Palette */
          --ink: #891411;         /* Dark Red */
          --primary: #c61d0f;     /* Primary Red */
          --surface: #fef1e4;     /* Cream White */
          
          --anim-reveal: cubic-bezier(.16, 1, .3, 1);
          --anim-soft: cubic-bezier(.25, .8, .28, 1);
        }

        :global(html), :global(body) {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: var(--surface);
          font-family: "Nunito", Arial, Helvetica, sans-serif;
          color: var(--ink);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        h1, p { margin: 0; padding: 0; }

        /* Core Layout */
        .viewport {
          position: fixed;
          inset: 0;
          background: var(--surface);
        }

        .stage {
          position: absolute;
          inset: 0;
          contain: strict;
          isolation: isolate;
        }

        /* Z-Index Hierarchy */
        .brand-word { z-index: 1; }
        .product-showcase { z-index: 2; }
        .support-copy { z-index: 3; }

        /* On-Stage Elements */
        .brand-word {
          position: absolute;
          top: 8dvh;
          left: 4.348958vw;
          font-family: "Fredoka", sans-serif;
          font-size: min(17.8125vw, 32dvh);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 0.85;
          white-space: nowrap;
        }

        .brand-word__mask {
          display: inline-block;
          overflow: hidden;
          padding-bottom: 0.15em;
          margin-bottom: -0.15em;
        }
        
        .brand-word__inner {
          display: inline-block;
        }

        .brand-word__dark {
          color: var(--ink);
        }

        .brand-word__primary {
          background: linear-gradient(135deg, var(--primary) 0%, var(--ink) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* Adjust product placement for new portrait aspect - FOTOS MÁS PEQUEÑAS */
        .product-showcase {
          position: absolute;
          top: 18dvh; /* Bajamos el top para centrarlo al ser más pequeño */
          left: 55vw;
          height: 60dvh; /* Reducido de 95dvh a 60dvh */
          transform: translateX(-50%);
          pointer-events: none; /* Let hover hit the stage underneath */
        }

        .product__sizer {
          display: block;
          height: 100%;
          width: auto;
          visibility: hidden; 
        }

        .product__layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 30px 60px rgba(137, 20, 17, 0.15);
        }

        .product__layer--top {
          -webkit-mask-image: linear-gradient(#0000, #0000);
          mask-image: linear-gradient(#0000, #0000);
        }

        .product__layer img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .support-copy {
          position: absolute;
          bottom: 5dvh;
          color: var(--primary);
          font-size: clamp(16px, min(1.6vw, 2.5dvh), 32px);
          font-weight: 700;
          white-space: pre-line;
          line-height: 1.1;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .support-copy--left { left: 4.348958vw; }
        .support-copy--right { right: 5vw; text-align: right; }

        .support-copy__inner { display: inline-block; }

        /* Entrance Choreography */
        @keyframes anim-word {
          0% { transform: translateY(118%); }
          100% { transform: translateY(0); }
        }
        @keyframes anim-subject {
          0% { opacity: 0; transform: translateX(-50%) translateY(5dvh); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes anim-corner {
          0% { opacity: 0; transform: translateY(2dvh); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes anim-dim {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .anim .brand-word__inner {
          animation: anim-word 1150ms var(--anim-reveal) 300ms both;
        }
        .anim .product-showcase {
          animation: anim-subject 1150ms var(--anim-reveal) 660ms both;
        }
        .anim .support-copy__inner {
          animation: anim-corner 720ms var(--anim-soft) 980ms both;
        }

        /* Reduced Motion Fallback */
        @media (prefers-reduced-motion: reduce) {
          .anim * {
            animation: none !important;
            transition: none !important;
          }
          .anim .stage {
            animation: anim-dim 280ms ease-out both !important;
          }
        }

        /* Responsive */
        @media (max-aspect-ratio: 4 / 5) {
          .product-showcase {
            height: min(40dvh, 80vw); /* Reducido también en móviles */
            top: auto;
            bottom: 15dvh;
            left: 50vw;
          }
          .brand-word {
            font-size: min(22vw, 15dvh);
            top: 8dvh;
            left: 0;
            width: 100%;
            text-align: center;
          }
          .support-copy {
            bottom: 4dvh;
            width: 45vw;
          }
          .support-copy--left { left: 5vw; }
          .support-copy--right { right: 5vw; }
        }
      `}</style>

      <main className={`viewport ${isAnimating ? 'anim' : ''}`}>
        <section className="stage" id="stage" ref={stageRef}>
          
          <h1 className="brand-word" id="brand-title" aria-label="Kiai Fresita">
            <span className="brand-word__mask">
              <span className="brand-word__inner">
                <span className="brand-word__dark">KIAI</span><br/>
                <span className="brand-word__primary">FRESITA</span>
              </span>
            </span>
          </h1>

          <div className="product-showcase" id="product-stack" ref={productRef}>
            {/* Front Image: Strawberries & Cream */}
            <img 
              className="product__sizer" 
              src="https://images.unsplash.com/photo-1553787762-b5f2081c15c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80"
              alt="" 
              aria-hidden="true" 
            />
            
            <div className="product__layer product__layer--bg" id="product-bg" ref={bgLayerRef}>
              <img 
                src="https://images.unsplash.com/photo-1553787762-b5f2081c15c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80"
                alt="Vaso de fresas con crema" 
              />
            </div>
            
            {/* Reveal Image: Close up of vibrant fresh strawberries */}
            <div className="product__layer product__layer--top" id="product-top" aria-hidden="true" ref={topLayerRef}>
              <img 
                src="https://images.unsplash.com/photo-1553787762-b5f2081c15c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1280&q=80"
                alt="Fresas frescas" 
              />
            </div>
          </div>

          <div className="support-copy support-copy--left">
            <span className="support-copy__inner">Energía, frescura<br />y diversión.</span>
          </div>
          
          <div className="support-copy support-copy--right">
            <span className="support-copy__inner">Un golpe<br />de sabor.</span>
          </div>

        </section>
      </main>
    </>
  );
}