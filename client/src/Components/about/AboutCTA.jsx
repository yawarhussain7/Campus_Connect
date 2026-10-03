import { ArrowRight, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

import SmartImage from './SmartImage.jsx';

const CTA_IMAGE =
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=80';

/**
 * Closing call to action: a tinted photo band with the two routes a reader is
 * most likely to want, plus the honest "student project" disclaimer.
 */
export default function AboutCTA() {
  return (
    <section className="animate-fadeInUp">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <SmartImage
          src={CTA_IMAGE}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          fallbackClassName="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-700 opacity-40"
        />

        <div className="relative px-6 py-10 text-center sm:px-10 sm:py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11.5px] font-semibold text-white ring-1 ring-inset ring-white/25">
            <HeartHandshake className="h-3.5 w-3.5" />
            Made for students
          </span>

          <h2 className="mx-auto mt-5 max-w-2xl text-[24px] font-extrabold leading-tight tracking-tight text-white sm:text-[30px]">
            Ready to make this semester easier?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-[13.5px] leading-relaxed text-blue-50/90">
            Jump back into your dashboard, or add the first resource your batch will thank
            you for.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/student/dashboard"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[13px] font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Go to dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/student/assignment/upload"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/30 px-4 text-[13px] font-semibold text-white transition hover:bg-white/10"
            >
              Share an assignment
            </Link>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[11.5px] text-slate-400">
        CampusConnect is a student project and is not an official COMSATS website.
      </p>
    </section>
  );
}