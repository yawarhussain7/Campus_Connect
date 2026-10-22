import { useEffect, useRef, useState } from 'react';
import { BookOpen, MessagesSquare, School, Layers, Calendar } from 'lucide-react';

const FALLBACK_STATS = [
  { icon: Layers, value: 5, decimals: 0, suffix: '', label: 'Academic Modules' },
  { icon: BookOpen, value: 1200, decimals: 0, suffix: '+', label: 'Study Resources' },
  { icon: Calendar, value: 100, decimals: 0, suffix: '%', label: 'Custom Schedules' },
  { icon: School, value: 45, decimals: 0, suffix: '+', label: 'Faculty Profiles' },
];

const formatValue = (value, decimals) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

const canAnimate = () =>
  typeof window !== 'undefined' &&
  typeof IntersectionObserver !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Counter = ({ value, decimals = 0, suffix = '', duration = 1400 }) => {
  const ref = useRef(null);
  const [display, setDisplay] = useState(() => (canAnimate() ? 0 : value));

  useEffect(() => {
    const node = ref.current;
    if (!node || !canAnimate()) return undefined;

    let frame = 0;
    let start = 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(value * eased);

      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            frame = requestAnimationFrame(step);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref}>
      {formatValue(display, decimals)}
      {suffix}
    </span>
  );
};

export default function StatsBand({ stats = FALLBACK_STATS }) {
  return (
    <section className="border-b border-slate-200/80 bg-white py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ icon: Icon, value, decimals, suffix, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-100 bg-[#f8fafc] text-center hover:border-slate-200 transition"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 mb-2.5">
                <Icon className="h-5 w-5" />
              </span>

              <dd className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                <Counter value={value} decimals={decimals} suffix={suffix} />
              </dd>

              <dt className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
                {label}
              </dt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
