import {
  useEffect,
  useRef,
  useState,
} from "react";
import vaso from "../images/vaso.png";

const TRAIL_MAX_POINTS = 60;
const TRAIL_HEAD_R = 140;
const TRAIL_NOISE_AMP = 44;
const TRAIL_BLOB_PTS = 24;
const TRAIL_FADE_SPEED = 0.92;
const TRAIL_SAMPLE_DIST = 8;

interface TrailPoint {
  x: number;
  y: number;
  r: number;
  alpha: number;
  seed: number;
}

export default function Home() {
  const [isAnimating, setIsAnimating] =
    useState(true);

  const stageRef = useRef<HTMLElement>(null);
  const productRef =
    useRef<HTMLDivElement>(null);
  const bgLayerRef =
    useRef<HTMLDivElement>(null);
  const topLayerRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animationTimer = window.setTimeout(
      () => {
        setIsAnimating(false);
      },
      6000
    );

    const stage = stageRef.current;
    const product = productRef.current;
    const bgLayer = bgLayerRef.current;
    const topLayer = topLayerRef.current;

    if (
      !stage ||
      !product ||
      !bgLayer ||
      !topLayer
    ) {
      window.clearTimeout(animationTimer);
      return;
    }

    const canvasBG =
      document.createElement("canvas");

    const contextBG = canvasBG.getContext(
      "2d",
      {
        willReadFrequently: true,
      }
    );

    const canvasTop =
      document.createElement("canvas");

    const contextTop = canvasTop.getContext(
      "2d",
      {
        willReadFrequently: true,
      }
    );

    if (!contextBG || !contextTop) {
      window.clearTimeout(animationTimer);
      return;
    }

    let width = 0;
    let height = 0;
    let interacting = false;
    let headRadius = 0;
    let points: TrailPoint[] = [];
    let pointerX = 0;
    let pointerY = 0;
    let time = 0;
    let lastSampleX = -999;
    let lastSampleY = -999;
    let isDrawing = false;
    let animationFrameId = 0;

    const updatePointerPosition = (
      event: PointerEvent
    ) => {
      const rect =
        product.getBoundingClientRect();

      pointerX = event.clientX - rect.left;
      pointerY = event.clientY - rect.top;
    };

    const resizeCanvases = () => {
      const rect =
        product.getBoundingClientRect();

      const newWidth = Math.max(
        1,
        Math.round(rect.width)
      );

      const newHeight = Math.max(
        1,
        Math.round(rect.height)
      );

      if (
        newWidth === width &&
        newHeight === height
      ) {
        return;
      }

      width = newWidth;
      height = newHeight;

      canvasBG.width = width;
      canvasBG.height = height;

      canvasTop.width = width;
      canvasTop.height = height;
    };

    const drawMorphBlob = (
      context: CanvasRenderingContext2D,
      centerX: number,
      centerY: number,
      radius: number,
      currentTime: number,
      seed: number
    ) => {
      if (radius < 2) {
        return;
      }

      const blobPoints: Array<{
        x: number;
        y: number;
      }> = [];

      context.beginPath();

      for (
        let index = 0;
        index < TRAIL_BLOB_PTS;
        index += 1
      ) {
        const angle =
          (index / TRAIL_BLOB_PTS) *
          Math.PI *
          2;

        const noiseA =
          Math.sin(
            angle * 3 +
              currentTime * 1.4 +
              seed
          ) * 0.45;

        const noiseB =
          Math.sin(
            angle * 5 -
              currentTime * 0.9 +
              seed * 2.3
          ) * 0.3;

        const noiseC =
          Math.cos(
            angle * 2 +
              currentTime * 1.8 +
              seed * 0.7
          ) * 0.25;

        const noise =
          (noiseA + noiseB + noiseC) *
          TRAIL_NOISE_AMP *
          (radius / TRAIL_HEAD_R);

        const finalRadius = Math.max(
          0,
          radius + noise
        );

        blobPoints.push({
          x:
            centerX +
            Math.cos(angle) * finalRadius,
          y:
            centerY +
            Math.sin(angle) * finalRadius,
        });
      }

      const firstPoint = blobPoints[0];
      const lastPoint =
        blobPoints[blobPoints.length - 1];

      context.moveTo(
        (firstPoint.x + lastPoint.x) / 2,
        (firstPoint.y + lastPoint.y) / 2
      );

      for (
        let index = 0;
        index < blobPoints.length;
        index += 1
      ) {
        const currentPoint =
          blobPoints[index];

        const nextPoint =
          blobPoints[
            (index + 1) %
              blobPoints.length
          ];

        context.quadraticCurveTo(
          currentPoint.x,
          currentPoint.y,
          (currentPoint.x + nextPoint.x) / 2,
          (currentPoint.y + nextPoint.y) / 2
        );
      }

      context.closePath();
      context.fill();
    };

    const stopDrawingIfFinished = () => {
      if (
        interacting ||
        headRadius >= 1 ||
        points.length > 0
      ) {
        return false;
      }

      bgLayer.style.maskImage = "none";
      bgLayer.style.webkitMaskImage = "none";

      topLayer.style.maskImage =
        "linear-gradient(transparent, transparent)";

      topLayer.style.webkitMaskImage =
        "linear-gradient(transparent, transparent)";

      isDrawing = false;

      return true;
    };

    const renderFrame = () => {
      resizeCanvases();

      const targetRadius = interacting
        ? TRAIL_HEAD_R
        : 0;

      headRadius +=
        (targetRadius - headRadius) *
        (interacting ? 0.14 : 0.04);

      time += 0.016;

      if (
        interacting &&
        headRadius > 5
      ) {
        const distance = Math.hypot(
          pointerX - lastSampleX,
          pointerY - lastSampleY
        );

        if (
          distance > TRAIL_SAMPLE_DIST
        ) {
          points.unshift({
            x: pointerX,
            y: pointerY,
            r: headRadius,
            alpha: 1,
            seed: Math.random() * 100,
          });

          if (
            points.length >
            TRAIL_MAX_POINTS
          ) {
            points.pop();
          }

          lastSampleX = pointerX;
          lastSampleY = pointerY;
        }
      }

      for (
        let index = points.length - 1;
        index >= 0;
        index -= 1
      ) {
        const point = points[index];

        point.alpha *= TRAIL_FADE_SPEED;
        point.r *= 0.995;

        if (point.alpha < 0.01) {
          points.splice(index, 1);
        }
      }

      if (stopDrawingIfFinished()) {
        return;
      }

      contextBG.globalCompositeOperation =
        "source-over";

      contextBG.globalAlpha = 1;
      contextBG.fillStyle = "#ffffff";
      contextBG.fillRect(
        0,
        0,
        width,
        height
      );

      contextBG.globalCompositeOperation =
        "destination-out";

      contextBG.fillStyle = "#000000";

      points.forEach((point) => {
        contextBG.globalAlpha =
          point.alpha;

        drawMorphBlob(
          contextBG,
          point.x,
          point.y,
          point.r,
          time,
          point.seed
        );
      });

      contextBG.globalAlpha = 1;

      contextTop.globalCompositeOperation =
        "source-over";

      contextTop.globalAlpha = 1;
      contextTop.clearRect(
        0,
        0,
        width,
        height
      );

      contextTop.fillStyle = "#ffffff";

      points.forEach((point) => {
        contextTop.globalAlpha =
          point.alpha;

        drawMorphBlob(
          contextTop,
          point.x,
          point.y,
          point.r,
          time,
          point.seed
        );
      });

      contextTop.globalAlpha = 1;

      const backgroundMask =
        canvasBG.toDataURL();

      const topMask =
        canvasTop.toDataURL();

      bgLayer.style.maskImage =
        `url("${backgroundMask}")`;

      bgLayer.style.webkitMaskImage =
        `url("${backgroundMask}")`;

      topLayer.style.maskImage =
        `url("${topMask}")`;

      topLayer.style.webkitMaskImage =
        `url("${topMask}")`;

      animationFrameId =
        window.requestAnimationFrame(
          renderFrame
        );
    };

    const startLoop = () => {
      if (isDrawing) {
        return;
      }

      isDrawing = true;
      time = performance.now() / 1000;

      animationFrameId =
        window.requestAnimationFrame(
          renderFrame
        );
    };

    const handlePointerEnter = (
      event: PointerEvent
    ) => {
      interacting = true;
      updatePointerPosition(event);
      startLoop();
    };

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      updatePointerPosition(event);

      if (
        event.pointerType === "touch"
      ) {
        interacting = true;
        startLoop();
      }
    };

    const handlePointerLeave = () => {
      interacting = false;
    };

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      interacting = true;
      updatePointerPosition(event);
      startLoop();
    };

    const handlePointerUp = () => {
      interacting = false;
    };

    stage.addEventListener(
      "pointerenter",
      handlePointerEnter
    );

    stage.addEventListener(
      "pointermove",
      handlePointerMove
    );

    stage.addEventListener(
      "pointerleave",
      handlePointerLeave
    );

    stage.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    stage.addEventListener(
      "pointerup",
      handlePointerUp
    );

    stage.addEventListener(
      "pointercancel",
      handlePointerUp
    );

    return () => {
      window.clearTimeout(animationTimer);

      window.cancelAnimationFrame(
        animationFrameId
      );

      stage.removeEventListener(
        "pointerenter",
        handlePointerEnter
      );

      stage.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      stage.removeEventListener(
        "pointerleave",
        handlePointerLeave
      );

      stage.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      stage.removeEventListener(
        "pointerup",
        handlePointerUp
      );

      stage.removeEventListener(
        "pointercancel",
        handlePointerUp
      );
    };
  }, []);

  return (
    <>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@700;800;900&display=swap");

        :root {
          --ink: #891411;
          --primary: #c61d0f;
          --surface: #fef1e4;
          --anim-reveal: cubic-bezier(
            0.16,
            1,
            0.3,
            1
          );
          --anim-soft: cubic-bezier(
            0.25,
            0.8,
            0.28,
            1
          );
        }

        .home-viewport,
        .home-viewport * {
          box-sizing: border-box;
        }

        .home-viewport {
          position: relative;
          width: 100%;
          min-height: calc(100svh - 90px);
          overflow: hidden;
          background:
            radial-gradient(
              circle at 58% 43%,
              rgba(198, 29, 15, 0.055),
              transparent 28%
            ),
            var(--surface);
          color: var(--ink);
          font-family:
            "Nunito",
            Arial,
            Helvetica,
            sans-serif;
          -webkit-font-smoothing:
            antialiased;
          -moz-osx-font-smoothing:
            grayscale;
        }

        .home-stage {
          position: relative;
          width: 100%;
          min-height: calc(100svh - 90px);
          overflow: hidden;
          isolation: isolate;
          touch-action: pan-y;
        }

        .home-brand {
          position: absolute;
          z-index: 1;
          top: clamp(35px, 8vh, 90px);
          left: 4.35vw;
          margin: 0;
          font-family:
            "Fredoka",
            sans-serif;
          font-size: min(
            17.8125vw,
            32dvh
          );
          font-weight: 700;
          letter-spacing: -0.035em;
          line-height: 0.82;
          white-space: nowrap;
        }

        .home-brand-mask {
          display: inline-block;
          padding: 0.04em 0.04em 0.16em;
          margin: -0.04em -0.04em -0.16em;
          overflow: hidden;
        }

        .home-brand-inner {
          display: inline-block;
        }

        .home-brand-dark {
          color: var(--ink);
        }

        .home-brand-primary {
          background:
            linear-gradient(
              135deg,
              var(--primary) 0%,
              var(--ink) 100%
            );
          color: transparent;
          background-clip: text;
          -webkit-background-clip: text;
        }

        .home-product {
          position: absolute;
          z-index: 2;
          top: 18dvh;
          left: 56%;
          height: min(60dvh, 670px);
          transform: translateX(-50%);
          pointer-events: none;
        }

        .home-product-sizer {
          display: block;
          width: auto;
          height: 100%;
          visibility: hidden;
        }

        .home-product-layer {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 40px;
          box-shadow:
            0 30px 60px
            rgba(137, 20, 17, 0.15);
          mask-size: 100% 100%;
          mask-repeat: no-repeat;
          -webkit-mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat;
        }

        .home-product-layer-top {
          mask-image:
            linear-gradient(
              transparent,
              transparent
            );
          -webkit-mask-image:
            linear-gradient(
              transparent,
              transparent
            );
        }

        .home-product-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .home-slogans {
          position: static;
        }

        .home-support-copy {
          position: absolute;
          z-index: 3;
          bottom: 5dvh;
          margin: 0;
          color: var(--primary);
          font-size: clamp(
            16px,
            min(1.6vw, 2.5dvh),
            32px
          );
          font-weight: 800;
          line-height: 1.08;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .home-support-copy-left {
          left: 4.35vw;
        }

        .home-support-copy-right {
          right: 5vw;
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

        @keyframes home-product-enter {
          from {
            opacity: 0;
            transform:
              translateX(-50%)
              translateY(5dvh);
          }

          to {
            opacity: 1;
            transform:
              translateX(-50%)
              translateY(0);
          }
        }

        @keyframes home-copy-enter {
          from {
            opacity: 0;
            transform: translateY(2dvh);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes home-mobile-product-enter {
          from {
            opacity: 0;
            transform:
              translateY(18px)
              scale(0.97);
          }

          to {
            opacity: 1;
            transform:
              translateY(0)
              scale(1);
          }
        }

        .home-anim
        .home-brand-inner {
          animation:
            home-word-enter
            1150ms
            var(--anim-reveal)
            300ms
            both;
        }

        .home-anim
        .home-product {
          animation:
            home-product-enter
            1150ms
            var(--anim-reveal)
            660ms
            both;
        }

        .home-anim
        .home-support-copy-inner {
          animation:
            home-copy-enter
            720ms
            var(--anim-soft)
            980ms
            both;
        }

        @media (max-width: 768px) {
          .home-viewport {
            min-height: auto;
            overflow: visible;
            background:
              radial-gradient(
                circle at 50% 52%,
                rgba(198, 29, 15, 0.07),
                transparent 37%
              ),
              var(--surface);
          }

          .home-stage {
            display: flex;
            min-height: auto;
            padding:
              clamp(24px, 6vw, 42px)
              16px
              24px;
            overflow: visible;
            flex-direction: column;
            align-items: center;
            gap: 0;
          }

          .home-brand {
            position: relative;
            top: auto;
            left: auto;
            z-index: 3;
            width: 100%;
            margin: 0;
            text-align: center;
            font-size: clamp(
              3.8rem,
              18.5vw,
              5.5rem
            );
            line-height: 0.8;
          }

          .home-brand-mask {
            max-width: 100%;
          }

          .home-product {
            position: relative;
            top: auto;
            left: auto;
            z-index: 2;
            width: min(68vw, 290px);
            height: auto;
            aspect-ratio: 4 / 5;
            margin:
              clamp(18px, 5vw, 28px)
              auto
              0;
            transform: none;
          }

          .home-product-sizer {
            width: 100%;
            height: 100%;
          }

          .home-product-layer {
            border-radius: 26px;
            box-shadow:
              0 18px 38px
              rgba(137, 20, 17, 0.16);
          }

          .home-product-image {
            object-fit: cover;
          }

          .home-slogans {
            display: grid;
            width: 100%;
            max-width: 520px;
            margin-top:
              clamp(20px, 6vw, 32px);
            grid-template-columns:
              minmax(0, 1fr)
              minmax(0, 1fr);
            gap: 16px;
          }

          .home-support-copy {
            position: relative;
            inset: auto;
            width: auto;
            margin: 0;
            font-size: clamp(
              0.72rem,
              3.4vw,
              0.92rem
            );
            line-height: 1.12;
          }

          .home-support-copy-left {
            text-align: left;
          }

          .home-support-copy-right {
            text-align: right;
          }

          .home-anim
          .home-product {
            animation:
              home-mobile-product-enter
              900ms
              var(--anim-reveal)
              600ms
              both;
          }
        }

        @media (max-width: 420px) {
          .home-stage {
            padding:
              20px
              14px
              20px;
          }

          .home-brand {
            font-size: clamp(
              3.55rem,
              18vw,
              4.7rem
            );
          }

          .home-product {
            width: min(64vw, 250px);
            margin-top: 18px;
          }

          .home-slogans {
            margin-top: 20px;
            gap: 10px;
          }

          .home-support-copy {
            font-size: clamp(
              0.68rem,
              3.2vw,
              0.82rem
            );
          }
        }

        @media (
          max-width: 768px
        ) and (
          max-height: 720px
        ) {
          .home-stage {
            padding-top: 16px;
            padding-bottom: 16px;
          }

          .home-brand {
            font-size: clamp(
              3.2rem,
              16vw,
              4.3rem
            );
          }

          .home-product {
            width: min(52vw, 215px);
            margin-top: 14px;
          }

          .home-slogans {
            margin-top: 16px;
          }
        }

        @media (
          min-width: 769px
        ) and (
          max-height: 700px
        ) {
          .home-brand {
            top: 5dvh;
            font-size: min(
              15vw,
              27dvh
            );
          }

          .home-product {
            top: 14dvh;
            height: 58dvh;
          }

          .home-support-copy {
            bottom: 3dvh;
          }
        }

        @media (
          prefers-reduced-motion:
          reduce
        ) {
          .home-anim *,
          .home-product,
          .home-brand-inner,
          .home-support-copy-inner {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <main
        className={`home-viewport ${
          isAnimating
            ? "home-anim"
            : ""
        }`}
      >
        <section
          ref={stageRef}
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
            ref={productRef}
            className="home-product"
            aria-label="Producto Kiai Fresita"
          >
            {vaso}

            <div
              ref={bgLayerRef}
              className="
                home-product-layer
                home-product-layer-background
              "
            >
              {vaso}
            </div>

            <div
              ref={topLayerRef}
              className="
                home-product-layer
                home-product-layer-top
              "
              aria-hidden="true"
            >
              {vaso}
            </div>
          </div>

          <div className="home-slogans">
            <p
              className="
                home-support-copy
                home-support-copy-left
              "
            >
              <span className="home-support-copy-inner">
                Energía, frescura
                <br />
                y diversión.
              </span>
            </p>

            <p
              className="
                home-support-copy
                home-support-copy-right
              "
            >
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
