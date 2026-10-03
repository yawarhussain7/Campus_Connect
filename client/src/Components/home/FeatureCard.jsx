 import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/** Icon-tile palettes for the landing page category cards. */
const TONES = {
  blue: { tile: 'bg-blue-50 text-blue-600', arrow: 'text-blue-600' },
  emerald: { tile: 'bg-emerald-50 text-emerald-600', arrow: 'text-emerald-600' },
  violet: { tile: 'bg-violet-50 text-violet-600', arrow: 'text-violet-600' },
  amber: { tile: 'bg-amber-50 text-amber-600', arrow: 'text-amber-600' },
};

/**
 * Category card for the "browse by resource type" grid. The whole card is the
 * link, so the arrow is decorative and the tile/arrow share an accent colour.
 */
const FeatureCard = ({ icon: Icon, title, desc, to = '/auth/signIn', tone = 'blue' }) => {
  const palette = TONES[tone] ?? TONES.blue;

  return (
    <Link
      to={to}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
    >
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${palette.tile}`}>
        <Icon className="h-5 w-5" />
      </span>

      <h3 className="mt-5 text-[17px] font-semibold tracking-tight text-slate-900">
        {title}
      </h3>

      <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-500">{desc}</p>

      <ArrowRight
        className={`mt-5 h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5 ${palette.arrow}`}
      />
    </Link>
  );
};

export default FeatureCard;