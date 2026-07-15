export function ProgressRing({ value, size = 84 }: { value: number; size?: number }) {
  return <div className="progress-ring" style={{ width: size, height: size, background: `conic-gradient(var(--blue) ${value * 3.6}deg, var(--line) 0deg)` }}><div><strong>{value}%</strong></div></div>;
}
