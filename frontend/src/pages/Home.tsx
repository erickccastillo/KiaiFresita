import { useEffect, useState } from "react";

export default function Home() {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const animationTimer = window.setTimeout(() => {
      setIsAnimating(false);
    }, 2200);

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
              circle at 68% 45%,
              rgba(198, 29, 15, 0.075),
              transparent 34%
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
          padding: clamp(36px, 7vh, 80px) 4.35vw 34px;
          flex-direction: column;
          justify-content: space-between;
          isolation: isolate;
        }

        .home-stage::before {
          position: absolute;
          z-index: -1;
          top: 50%;
          left: 58%;
          width: min(36vw, 480px);
          aspect-ratio: 1;
          content: "";
          background: rgba(198, 29, 15, 0.045);
          border: 1px solid rgba(137, 20, 17, 0.055);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .home-stage::after {
          position: absolute;
          z-index: -1;
          top: 50%;
          left: 58%;
          width: min(22vw, 290px);
          aspect-ratio: 1;
          content: "";
          border: 2px solid rgba(137, 20, 17, 0.06);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .home-brand {
          width: fit-content;
          margin: 0;
          font-family: "Fredoka", sans-serif;
          font-size: min(17.8125vw, 31dvh);
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

        .home-center-message {
          position: absolute;
          top: 51%;
          left: 66%;
          width: min(27vw, 390px);
          color: rgba(137, 20, 17, 0.78);
          font-size: clamp(0.75rem, 1vw, 1rem);
          font-weight: 900;
          line-height: 1.4;
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.16em;
          transform: translate(-50%, -50%);
        }

        .home-center-dot {
          display: block;
          width: 9px;
          height: 9px;
          margin: 0 auto 14px;
          background: var(--home-primary);
          border-radius: 50%;
          box-shadow:
            0 0 0 7px rgba(198, 29, 15, 0.075);
        }

        .home-slogans {
          display: grid;
          width: 100%;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
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

        .home-support-copy-right {
          text-align: right;
        }

        .home-support-copy-inner {
          display: inline-block;
        }

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

        @keyframes home-center-enter {
          from {
            opacity: 0;
            transform:
              translate(-50%, -45%)
              scale(0.96);
          }

          to {
            opacity: 1;
            transform:
              translate(-50%, -50%)
              scale(1);
          }
        }

        .home-anim .home-brand-inner {
          animation:
            home-word-enter
            1050ms
            var(--home-reveal)
            180ms
            both;
        }

        .home-anim .home-support-copy-inner {
          animation:
            home-copy-enter
            700ms
            var(--home-soft)
            760ms
            both;
        }

        .home-anim .home-center-message {
          animation:
            home-center-enter
            850ms
            var(--home-reveal)
            600ms
            both;
        }

        @media (max-width: 768px) {
          .home-page {
            min-height: auto;
            overflow: visible;
            background:
              radial-gradient(
                circle at 50% 48%,
                rgba(198, 29, 15, 0.08),
                transparent 45%
              ),
              var(--home-surface);
          }

          .home-stage {
            display: flex;
            min-height: auto;
            padding: 30px 18px 26px;
            justify-content: flex-start;
            align-items: center;
          }

          .home-stage::before {
            top: 55%;
            left: 50%;
            width: min(74vw, 320px);
            opacity: 0.8;
          }

          .home-stage::after {
            top: 55%;
            left: 50%;
            width: min(47vw, 205px);
          }

          .home-brand {
            width: 100%;
            text-align: center;
            font-size: clamp(3.7rem, 18.5vw, 5.3rem);
            line-height: 0.79;
          }

          .home-brand-mask {
            max-width: 100%;
          }

          .home-center-message {
            position: relative;
            top: auto;
            left: auto;
            width: min(80%, 310px);
            min-height: 135px;
            margin: 44px auto 36px;
            padding: 32px 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: clamp(0.67rem, 2.9vw, 0.82rem);
            line-height: 1.45;
            letter-spacing: 0.13em;
            transform: none;
          }

          .home-center-dot {
            width: 8px;
            height: 8px;
            margin-bottom: 13px;
          }

          .home-slogans {
            position: relative;
            width: 100%;
            max-width: 520px;
            padding-top: 22px;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
            gap: 14px;
            border-top: 2px solid rgba(137, 20, 17, 0.13);
          }

          .home-support-copy {
            font-size: clamp(0.7rem, 3.2vw, 0.88rem);
            line-height: 1.13;
          }

          .home-support-copy-left {
            text-align: left;
          }

          .home-support-copy-right {
            text-align: right;
          }

          .home-anim .home-center-message {
            animation:
              home-copy-enter
              800ms
              var(--home-reveal)
              520ms
              both;
          }
        }

        @media (max-width: 420px) {
          .home-stage {
            padding: 24px 14px 22px;
          }

          .home-brand {
            font-size: clamp(3.35rem, 17.8vw, 4.5rem);
          }

          .home-center-message {
            min-height: 120px;
            margin: 35px auto 28px;
            padding: 24px 12px;
            font-size: 0.67rem;
          }

          .home-slogans {
            padding-top: 18px;
            gap: 10px;
          }

          .home-support-copy {
            font-size: clamp(0.64rem, 3vw, 0.76rem);
          }
        }

        @media (max-width: 768px) and (max-height: 720px) {
          .home-stage {
            padding-top: 18px;
            padding-bottom: 18px;
          }

          .home-brand {
            font-size: clamp(3rem, 15.5vw, 4.1rem);
          }

          .home-center-message {
            min-height: 90px;
            margin: 24px auto 20px;
            padding: 18px 10px;
          }

          .home-slogans {
            padding-top: 15px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .home-anim *,
          .home-brand-inner,
          .home-support-copy-inner,
          .home-center-message {
            animation: none !important;
            transition: none !important;
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

          <div
            className="home-center-message"
            aria-label="Mensaje de la marca"
          >
            <span
              className="home-center-dot"
              aria-hidden="true"
            />

            Sabor que transforma
            <br />
            cualquier momento
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
