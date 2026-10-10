import { useEffect, useRef, useState } from 'react';
import { BookOpen, MessagesSquare, School, Layers } from 'lucide-react';

/**
 * Fallback figures shown until the landing page has read the API (or when it
 * cannot be reached). The real numbers arrive through the `stats` prop.
 */
const FALLBACK_STATS = [
  { icon: Layers, value: 4, decimals: 0, suffix: '', label: 'Academic modules' },
  { icon: BookOpen, value: 0, decimals: 0, suffix: '+', label: 'Resources shared' },
  { icon: MessagesSquare, value: 0, decimals: 0, suffix: '+', label: 'Teacher reviews' },
  { icon: School, value: 0, decimals: 0, suffix: '+', label: 'Faculty profiles' },
];

const formatValue = (value, decimals) =>
  value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Whether the count-up can run: the browser must support IntersectionObserver
 * and the visitor must not have asked for reduced motion.
 */
const canAnimate = () =>
  typeof window !== 'undefined' &&
  typeof IntersectionObserver !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Counts up to `value` the first time it scrolls into view. Shows the final
 * figure immediately when motion is reduced or the observer is unavailable.
 */
const Counter = ({ value, decimals = 0, suffix = '', duration = 1400 }) => {
  const ref = useRef(null);
  // Non-animated visitors start on the final figure so nothing ever flashes a 0.
  const [display, setDisplay] = useState(() => (canAnimate() ? 0 : value));

  useEffect(() => {
    const node = ref.current;

    if (!node || !canAnimate()) return undefined;

    let frame = 0;
    let start = 0;

    const step = (timestamp) => {
      if (!start) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3; // easeOutCubic

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

/**
 * Slim trust band under the hero: four animated figures separated by hairlines.
 * The figures are the real library totals the landing page fetched from the
 * API (see `stats`); until they arrive the zeroed fallbacks keep the layout.
 */
export default function StatsBand({ stats = FALLBACK_STATS }) {
  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
          {stats.map(({ icon: Icon, value, decimals, suffix, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 px-2 text-center sm:border-r sm:border-slate-100 sm:last:border-r-0"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </span>

              <dd className="text-[26px] font-extrabold leading-none tracking-tight text-slate-900">
                <Counter value={value} decimals={decimals} suffix={suffix} />
              </dd>

              <dt className="text-[12.5px] font-medium text-slate-500">{label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
