"use client";

const WIDTH = 1440;
const HEIGHT = 150;
const STEP = 12;

type Point = {
  x: number;
  y: number;
};

/**
 * Produces a smooth curve from periodically sampled points.
 * This geometry is calculated once and remains identical during SSR and hydration.
 */

function formatCoordinate(value: number): string {
  return Number(value.toFixed(3)).toString();
}

function smoothPath(points: Point[]): string {
  if (points.length < 2) return "";

  let d = `M ${formatCoordinate(points[0].x)} ${formatCoordinate(points[0].y)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${formatCoordinate(cp1x)} ${formatCoordinate(cp1y)}, ${formatCoordinate(cp2x)} ${formatCoordinate(cp2y)}, ${formatCoordinate(p2.x)} ${formatCoordinate(p2.y)}`;
  }

  return d;
}



function getWavePath(): string {
  const points: Point[] = [];

  for (let x = 0; x <= WIDTH; x += STEP) {
    const t = (x / WIDTH) * Math.PI * 2;
    const y = Number((67 + Math.sin(t) * 29 + Math.sin(t * 2) * 5).toFixed(3));

    points.push({ x, y });
  }

  if (points[points.length - 1].x !== WIDTH) {
    points.push({ x: WIDTH, y: 67 });
  }

  return smoothPath(points);
}


function getCoverPath(wave: string): string {
  return `${wave} L ${WIDTH} 0 L 0 0 Z`;
}

// Static path data: the server and client render exactly the same SVG attributes.
const INITIAL_WAVE = getWavePath();
const INITIAL_COVER = getCoverPath(INITIAL_WAVE);

export default function FooterWave() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[150px] overflow-hidden"
    >
      <svg
        className="block h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          {`
            .footer-wave-track {
  animation: footer-wave-scroll 4s linear infinite;
  will-change: transform;
}

@keyframes footer-wave-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-1440px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-wave-track {
    animation-duration: 8s;
  }
}
          `}
        </style>

        <g className="footer-wave-track">
          {/* Shaded lower edge */}
          <path
            d={INITIAL_WAVE}
            fill="none"
            stroke="#B9A8C8"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <path
            d={INITIAL_WAVE}
            transform={`translate(${WIDTH} 0)`}
            fill="none"
            stroke="#B9A8C8"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Upper section color */}
          <path d={INITIAL_COVER} fill="#FFFFFF" />
          <path d={INITIAL_COVER} transform={`translate(${WIDTH} 0)`} fill="#FFFFFF" />

          {/* Fine highlight along the wave */}
          <path
            d={INITIAL_WAVE}
            fill="none"
            stroke="#E6D8F4"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d={INITIAL_WAVE}
            transform={`translate(${WIDTH} 0)`}
            fill="none"
            stroke="#E6D8F4"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
