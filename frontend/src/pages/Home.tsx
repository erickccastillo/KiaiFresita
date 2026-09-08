import { useEffect, useState } from "react";

function AnimatedStrawberry() {
  return (
    <div className="home-strawberry" aria-hidden="true">
      <svg
        className="home-strawberry-svg"
        viewBox="0 0 240 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cuerpo de la fresa */}
        <path
          className="strawberry-line strawberry-body-line"
          d="
            M120 57
            C78 48 43 76 43 123
            C43 181 91 229 120 252
            C149 229 197 181 197 123
            C197 76 162 48 120 57
            Z
          "
        />

        <path
          className="strawberry-fill"
          d="
            M120 57
            C78 48 43 76 43 123
            C43 181 91 229 120 252
            C149 229 197 181 197 123
            C197 76 162 48 120 57
            Z
          "
        />

        {/* Trazos de las hojas */}
        <path
          className="strawberry-line strawberry-leaf-line leaf-one"
          d="
            M120 61
            C105 36 82 28 67 35
            C79 51 95 62 120 68
          "
        />

        <path
          className="strawberry-line strawberry-leaf-line leaf-two"
          d="
            M120 61
            C124 31 145 19 159 25
            C158 45 145 60 120 68
          "
        />

        <path
          className="strawberry-line strawberry-leaf-line leaf-three"
          d="
            M120 64
            C103 42 105 20 119 10
            C133 24 135 46 120 64
          "
        />

        {/* Relleno de las hojas */}
        <path
          className="strawberry-leaf-fill leaf-one"
          d="
            M120 61
            C105 36 82 28 67 35
            C79 51 95 62 120 68
            Z
          "
        />

        <path
          className="strawberry-leaf-fill leaf-two"
          d="
            M120 61
            C124 31 145 19 159 25
            C158 45 145 60 120 68
            Z
          "
        />

        <path
          className="strawberry-leaf-fill leaf-three"
          d="
            M120 64
            C103 42 105 20 119 10
            C133 24 135 46 120 64
            Z
          "
        />

        {/* Semillas */}
        <g className="strawberry-seeds">
          <ellipse cx="88" cy="105" rx="4" ry="7" />
          <ellipse cx="120" cy="94" rx="4" ry="7" />
          <ellipse cx="153" cy="105" rx="4" ry="7" />

          <ellipse cx="72" cy="139" rx="4" ry="7" />
          <ellipse cx="104" cy="133" rx="4" ry="7" />
          <ellipse cx="137" cy="133" rx="4" ry="7" />
          <ellipse cx="169" cy="139" rx="4" ry="7" />

          <ellipse cx="89" cy="172" rx="4" ry="7" />
          <ellipse cx="120" cy="166" rx="4" ry="7" />
          <ellipse cx="151" cy="172" rx="4" ry="7" />

          <ellipse cx="105" cy="203" rx="4" ry="7" />
          <ellipse cx="136" cy="203" rx="4" ry="7" />
          <ellipse cx="120" cy="226" rx="3.5" ry="6" />
        </g>

        {/* Brillo */}
        <path
          className="strawberry-shine"
          d="M77 91 C61 111 62 142 73 163"
        />
      </svg>
    </div>
  );
}

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const animationTimer = window.setTimeout(() => {
      setIsAnimating(false);
    }, 3500);

    return () => {
      window.clearTimeout(animationTimer);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@700;800;900&display=swap");

        :root {
          --home-ink: #891411;
          --home-primary: #c61d0f;
          --home-surface: #fef1e4;
          --home-green: #46713c;
          --home-reveal: cubic-bezier(0.16, 1, 0.3, 1);
          --home-soft: cubic-bezier(0.25, 0.8, 0.28, 1);
        }

        .home-page,
        .home-page * {
          box-sizing: border-box;
        }

 .home-page {
          position: relative;
          display: flex;
          width: 100%;
          min-height: calc(100svh - 90px);
          overflow: hidden;
          background:
            radial-gradient(
              circle at 73% 47%,
              rgba(198, 29, 15, 0.07),
              transparent 30%
            ),
            var(--home-surface);
          color: var(--home-ink);
          font-family:
            "Nunito",
            Arial,
            Helvetica,
            sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .home-stage {
          position: relative;
          display: flex;
          width: 100%;
          min-height: calc(100svh - 90px);
          padding:
            clamp(34px, 7vh, 78px)
            4.35vw
            clamp(26px, 5vh, 48px);
          flex-direction: column;
          justify-content: space-between;
          isolation: isolate;
        }

        /*
          Título principal
        */

        .home-brand {
          position: relative;
          z-index: 2;
          width: fit-content;
          margin: 0;
          font-family: "Fredoka", sans-serif;
          font-size: min(17.5vw, 30dvh);
          font-weight: 700;
          line-height: 0.82;
          letter-spacing: -0.045em;
          white-space: nowrap;
        }

        .home-brand-mask {
          display: inline-block;
          margin: -0.05em -0.05em -0.17em;
          padding: 0.05em 0.05em 0.17em;
          overflow: hidden;
        }

        .home-brand-inner {
          display: inline-block;
        }

        .home-brand-dark {
          color: var(--home-ink);
        }

        .home-brand-primary {
          background:
            linear-gradient(
              135deg,
              var(--home-primary) 0%,
              var(--home-ink) 100%
            );
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
        }

        /*
          Contenedor de fresa y mensaje
        */

        .home-feature {
          position: absolute;
          z-index: 3;
          top: 48%;
          left: 74%;
          display: flex;
          width: min(25vw, 350px);
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -50%);
        }

        .home-strawberry {
          width: min(14vw, 205px);
          transform-origin: center;
        }

        .home-strawberry-svg {
          display: block;
          width: 100%;
          height: auto;
          overflow: visible;
          filter:
            drop-shadow(
              0 18px 22px
              rgba(137, 20, 17, 0.13)
            );
        }

        /*
          Dibujo animado
        */

        .strawberry-line {
          fill: transparent;
          stroke: var(--home-ink);
          stroke-width: 7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .strawberry-body-line {
          stroke-dasharray: 900;
          stroke-dashoffset: 900;
        }

        .strawberry-leaf-line {
          stroke: var(--home-green);
          stroke-width: 6;
          stroke-dasharray: 220;
          stroke-dashoffset: 220;
        }

        .strawberry-fill {
          fill: var(--home-primary);
          opacity: 0;
        }

        .strawberry-leaf-fill {
          fill: var(--home-green);
          opacity: 0;
        }

        .strawberry-seeds {
          fill: var(--home-surface);
        }

        .strawberry-seeds ellipse {
          opacity: 0;
          transform: scale(0);
          transform-box: fill-box;
          transform-origin: center;
        }

        .strawberry-shine {
          fill: none;
          stroke: rgba(255, 255, 255, 0.52);
          stroke-width: 8;
          stroke-linecap: round;
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
        }

        /*
          Mensaje debajo de la fresa
        */

        .home-center-message {
          margin: 14px 0 0;
          color: rgba(137, 20, 17, 0.82);
          font-size: clamp(0.68rem, 0.9vw, 0.9rem);
          font-weight: 900;
          line-height: 1.4;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        /*
          Frases inferiores
        */

        .home-slogans {
          position: relative;
          z-index: 4;
          display: grid;
          width: 100%;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);
          align-items: end;
          gap: 24px;
        }

        .home-support-copy {
          margin: 0;
          color: var(--home-primary);
          font-size: clamp(
            16px,
            min(1.6vw, 2.5dvh),
            30px
          );
          font-weight: 800;
          line-height: 1.08;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .home-support-copy-left {
          text-align: left;
        }

        .home-support-copy-right {
          text-align: right;
        }

        .home-support-copy-inner {
          display: inline-block;
        }

        /*
          Animaciones
        */

        @keyframes home-word-enter {
          from {
            transform: translateY(118%);
          }

          to {
            transform: translateY(0);
          }
        }

        @keyframes home-copy-enter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes strawberry-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes strawberry-fill-in {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes strawberry-seed-in {
          from {
            opacity: 0;
            transform: scale(0);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes strawberry-feature-enter {
          from {
            opacity: 0;
            transform:
              translate(-50%, -44%)
              scale(0.94);
          }

          to {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              scale(1);
          }
        }

        @keyframes strawberry-float {
          0%,
          100% {
            transform:
              translateY(0)
              rotate(-1deg);
          }

          50% {
            transform:
              translateY(-8px)
              rotate(1deg);
          }
        }

        /*
          Secuencia principal
        */

        .home-anim .home-brand-inner {
          animation:
            home-word-enter
            1050ms
            var(--home-reveal)
            180ms
            both;
        }

        .home-anim .home-feature {
          animation:
            strawberry-feature-enter
            850ms
            var(--home-reveal)
            480ms
            both;
        }

        .home-anim .strawberry-body-line {
          animation:
            strawberry-draw
            1.4s
            var(--home-reveal)
            600ms
            forwards;
        }

        .home-anim .strawberry-fill {
          animation:
            strawberry-fill-in
            700ms
            ease-out
            1.45s
            forwards;
        }

        .home-anim .strawberry-leaf-line.leaf-one {
          animation:
            strawberry-draw
            650ms
            ease-out
            1.25s
            forwards;
        }

        .home-anim .strawberry-leaf-line.leaf-two {
          animation:
            strawberry-draw
            650ms
            ease-out
            1.4s
            forwards;
        }

        .home-anim .strawberry-leaf-line.leaf-three {
          animation:
            strawberry-draw
            650ms
            ease-out
            1.55s
            forwards;
        }

        .home-anim .strawberry-leaf-fill.leaf-one {
          animation:
            strawberry-fill-in
            450ms
            ease-out
            1.65s
            forwards;
        }

        .home-anim .strawberry-leaf-fill.leaf-two {
          animation:
            strawberry-fill-in
            450ms
            ease-out
            1.78s
            forwards;
        }

        .home-anim .strawberry-leaf-fill.leaf-three {
          animation:
            strawberry-fill-in
            450ms
            ease-out
            1.91s
            forwards;
        }

        .home-anim .strawberry-shine {
          animation:
            strawberry-draw
            600ms
            ease-out
            2.15s
            forwards;
        }

        .home-anim .strawberry-seeds ellipse {
          animation:
            strawberry-seed-in
            380ms
            var(--home-reveal)
            forwards;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(1) {
          animation-delay: 1.75s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(2) {
          animation-delay: 1.82s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(3) {
          animation-delay: 1.89s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(4) {
          animation-delay: 1.96s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(5) {
          animation-delay: 2.03s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(6) {
          animation-delay: 2.1s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(7) {
          animation-delay: 2.17s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(8) {
          animation-delay: 2.24s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(9) {
          animation-delay: 2.31s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(10) {
          animation-delay: 2.38s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(11) {
          animation-delay: 2.45s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(12) {
          animation-delay: 2.52s;
        }

        .home-anim .strawberry-seeds ellipse:nth-child(13) {
          animation-delay: 2.59s;
        }

        .home-anim .home-support-copy-inner {
          animation:
            home-copy-enter
            700ms
            var(--home-soft)
            900ms
            both;
        }

        /*
          Después de terminar la entrada, la fresa flota
        */

        .home-page:not(.home-anim) .home-strawberry {
          animation:
            strawberry-float
            4s
            ease-in-out
            infinite;
        }

        /*
          Estado final después de remover home-anim
        */

        .home-page:not(.home-anim) .strawberry-body-line,
        .home-page:not(.home-anim) .strawberry-leaf-line,
        .home-page:not(.home-anim) .strawberry-shine {
          stroke-dashoffset: 0;
        }

        .home-page:not(.home-anim) .strawberry-fill,
        .home-page:not(.home-anim) .strawberry-leaf-fill,
        .home-page:not(.home-anim) .strawberry-seeds ellipse {
          opacity: 1;
        }

        .home-page:not(.home-anim) .strawberry-seeds ellipse {
          transform: scale(1);
        }

        /*
          Tablet
        */

        @media (max-width: 1000px) and (min-width: 769px) {
          .home-brand {
            font-size: min(16vw, 27dvh);
          }

          .home-feature {
            left: 76%;
            width: min(27vw, 290px);
          }

          .home-strawberry {
            width: min(16vw, 170px);
          }
        }

        /*
          Móvil
        */

@media (max-width: 768px) {
  .home-page {
    display: flex;
    width: 100%;
    min-height: 100%;
    flex: 1 1 auto;
    overflow: hidden;

    background: none;
    background-color: #fef1e4;
  }
}

          .home-stage {
            display: flex;
            min-height: auto;
            padding: 28px 18px 24px;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
          }

          .home-brand {
            width: 100%;
            text-align: center;
            font-size: clamp(
              3.65rem,
              18.2vw,
              5.2rem
            );
            line-height: 0.79;
          }

          .home-brand-mask {
            max-width: 100%;
          }

          .home-feature {
            position: relative;
            top: auto;
            left: auto;
            width: 100%;
            margin: 30px auto 25px;
            transform: none;
          }

          .home-strawberry {
            width: min(34vw, 145px);
          }

          .home-center-message {
            margin-top: 10px;
            font-size: clamp(
              0.64rem,
              2.75vw,
              0.77rem
            );
            line-height: 1.4;
            letter-spacing: 0.11em;
          }

          .home-slogans {
            width: 100%;
            max-width: 520px;
            padding-top: 20px;
            grid-template-columns:
              minmax(0, 1fr)
              minmax(0, 1fr);
            gap: 14px;
            border-top:
              2px solid
              rgba(137, 20, 17, 0.13);
          }

          .home-support-copy {
            font-size: clamp(
              0.68rem,
              3.1vw,
              0.84rem
            );
            line-height: 1.13;
          }

          .home-support-copy-left {
            text-align: left;
          }

          .home-support-copy-right {
            text-align: right;
          }

          .home-anim .home-feature {
            animation:
              home-copy-enter
              850ms
              var(--home-reveal)
              450ms
              both;
          }
        }

        /*
          Teléfonos pequeños
        */

        @media (max-width: 420px) {
          .home-stage {
            padding: 22px 14px 20px;
          }

          .home-brand {
            font-size: clamp(
              3.25rem,
              17.4vw,
              4.35rem
            );
          }

          .home-feature {
            margin-top: 23px;
            margin-bottom: 20px;
          }

          .home-strawberry {
            width: min(31vw, 125px);
          }

          .home-center-message {
            margin-top: 7px;
            font-size: 0.61rem;
          }

          .home-slogans {
            padding-top: 17px;
            gap: 9px;
          }

          .home-support-copy {
            font-size: clamp(
              0.61rem,
              2.85vw,
              0.72rem
            );
          }
        }

        /*
          Móviles con poca altura
        */

        @media (max-width: 768px) and (max-height: 720px) {
          .home-stage {
            padding-top: 16px;
            padding-bottom: 16px;
          }

          .home-brand {
            font-size: clamp(
              3rem,
              15.5vw,
              4rem
            );
          }

          .home-feature {
            margin-top: 16px;
            margin-bottom: 15px;
          }

          .home-strawberry {
            width: min(27vw, 105px);
          }

          .home-center-message {
            font-size: 0.58rem;
          }

          .home-slogans {
            padding-top: 13px;
          }
        }

        /*
          Accesibilidad
        */

        @media (prefers-reduced-motion: reduce) {
          .home-page *,
          .home-brand-inner,
          .home-feature,
          .home-strawberry,
          .strawberry-line,
          .strawberry-fill,
          .strawberry-leaf-fill,
          .strawberry-seeds ellipse,
          .strawberry-shine,
          .home-support-copy-inner {
            animation: none !important;
            transition: none !important;
          }

          .strawberry-body-line,
          .strawberry-leaf-line,
          .strawberry-shine {
            stroke-dashoffset: 0;
          }

          .strawberry-fill,
          .strawberry-leaf-fill,
          .strawberry-seeds ellipse {
            opacity: 1;
          }

          .strawberry-seeds ellipse {
            transform: scale(1);
          }
        }
      `}</style>

      <main
        className={`home-page ${
          isAnimating ? "home-anim" : ""
        }`}
      >
        <section
          className="home-stage"
          aria-labelledby="home-brand-title"
        >
          <h1
            id="home-brand-title"
            className="home-brand"
            aria-label="Kiai Fresita"
          >
            <span className="home-brand-mask">
              <span className="home-brand-inner">
                <span className="home-brand-dark">
                  KIAI
                </span>

                <br />

                <span className="home-brand-primary">
                  FRESITA
                </span>
              </span>
            </span>
          </h1>

          <div className="home-feature">
            <AnimatedStrawberry />

            <p className="home-center-message">
              Sabor que transforma
              <br />
              cualquier momento
            </p>
          </div>

          <div className="home-slogans">
            <p className="home-support-copy home-support-copy-left">
              <span className="home-support-copy-inner">
                Energía, frescura
                <br />
                y diversión.
              </span>
            </p>

            <p className="home-support-copy home-support-copy-right">
              <span className="home-support-copy-inner">
                Un golpe
                <br />
                de sabor.
              </span>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
