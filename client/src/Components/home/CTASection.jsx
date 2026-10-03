import { ArrowRight, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

import Reveal from './Reveal';

/**
 * Closing call to action: a tinted gradient band with the two routes a visitor
 * is most likely to want, plus the honest "student project" disclaimer.
 */
export default function CTASection() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-6 py-14 text-center shadow-[0_30px_70px_-30px_rgba(37,99,235,0.65)] sm:px-12 sm:py-16">
            {/* Soft light blooms add depth without any image dependency. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute -left-10 -top-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-16 right-0 h-64 w-64 rounded-full bg-sky-300/20 blur-3xl" />
            </div>

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[11.5px] font-semibold text-white ring-1 ring-inset ring-white/25">
                <HeartHandshake className="h-3.5 w-3.5" />
                Made for students
              </span>

              <h2 className="mx-auto mt-5 max-w-2xl text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[34px]">
                Ready to make this semester easier?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-relaxed text-blue-50/90">
                Join the students sharing notes, projects and past papers — or jump straight
                back into your dashboard.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  to="/auth/signUp"
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-[13.5px] font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
                >
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/auth/signIn"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/30 px-5 text-[13.5px] font-semibold text-white transition hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
