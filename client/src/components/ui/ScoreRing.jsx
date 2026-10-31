import { useEffect, useState } from "react";

export function ScoreRing({ percent }) {
  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(Math.max(percent, 0), 100);
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setOffset(circumference * (1 - clamped / 100));
    });
    return () => cancelAnimationFrame(frame);
  }, [clamped, circumference]);

  return (
    <div className="score-ring" role="img" aria-label={`Score: ${Math.round(clamped)} percent`}>
      <svg viewBox="0 0 200 200">
        <circle className="ring-track" cx="100" cy="100" r={radius} />
        <circle
          className="ring-fill"
          cx="100"
          cy="100"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 100 100)"
        />
      </svg>
      <div className="ring-label">
        <strong>{Number(clamped.toFixed(1))}%</strong>
        <span>Your score</span>
      </div>
    </div>
  );
}
