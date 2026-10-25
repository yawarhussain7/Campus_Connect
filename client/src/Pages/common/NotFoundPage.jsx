import { useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Home, Search } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import uniMateLogo from '../../assets/uniMat.png';

const LOST_BOT_IMAGE =
  'https://api.dicebear.com/9.x/bottts/svg?seed=UniMate404&backgroundColor=dbeafe';

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#f5f9ff] text-slate-800">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-36 -right-20 h-96 w-96 rounded-full bg-indigo-100/70 blur-3xl"
      />

      <header className="relative z-10 flex h-[72px] items-center justify-between border-b border-blue-100/80 bg-white/80 px-5 sm:px-9">
        <Link to="/" className="flex items-center gap-2.5" aria-label="UniMate home">
          <img src={uniMateLogo} alt="" className="h-11 w-11 object-contain" />
          <span className="text-lg font-extrabold tracking-tight text-blue-700">
            UniMate
          </span>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-blue-50 hover:text-blue-700"
        >
          <Home className="h-4 w-4" />
          Home
        </Link>
      </header>

      <section className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-5 py-10 sm:px-9 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700">
            <Search className="h-3.5 w-3.5" />
            Lost in the campus?
          </span>

          <p className="mt-5 text-[84px] font-black leading-[0.9] tracking-[-0.08em] text-blue-600 sm:text-[112px]">
            404
          </p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Oops! This page skipped class.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500 lg:mx-0">
            Our little campus bot took a wrong turn looking for this page.
            Let’s get you back somewhere useful before it misses the whole semester.
          </p>

          <p className="mx-auto mt-4 max-w-full truncate rounded-lg border border-slate-200 bg-white/80 px-3 py-2 font-mono text-[11px] text-slate-400 lg:mx-0 lg:max-w-md">
            Lost page: {location.pathname}
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              to="/"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
            >
              <Home className="h-4 w-4" />
              Take me home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Go back
            </button>
          </div>

          <Link
            to="/student/dashboard"
            className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-blue-700 hover:text-blue-900"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Or head to your student dashboard
          </Link>
        </div>

        <div className="relative order-1 mx-auto flex aspect-square w-full max-w-[390px] items-center justify-center lg:order-2">
          <div
            aria-hidden="true"
            className="absolute inset-[9%] rounded-full border border-dashed border-blue-200"
          />
          <div
            aria-hidden="true"
            className="absolute inset-[19%] rounded-full border border-blue-100/80"
          />

          <div
            aria-hidden="true"
            className="absolute left-[17%] top-[22%] animate-[not-found-orbit_7s_ease-in-out_infinite] text-2xl"
          >
            ✦
          </div>
          <div
            aria-hidden="true"
            className="absolute right-[15%] top-[35%] animate-[not-found-orbit_5s_ease-in-out_infinite_reverse] text-xl text-amber-400"
          >
            ★
          </div>
          <div
            aria-hidden="true"
            className="absolute bottom-[18%] left-[25%] animate-[not-found-orbit_6s_ease-in-out_infinite_reverse] text-lg text-blue-400"
          >
            ✦
          </div>

          <div className="relative flex h-[68%] w-[68%] animate-[not-found-float_4s_ease-in-out_infinite] items-center justify-center rounded-full border border-blue-100 bg-white/80 p-5 shadow-[0_24px_70px_rgba(37,99,235,0.14)]">
            {!imageFailed ? (
              <img
                src={LOST_BOT_IMAGE}
                alt="A friendly cartoon robot looking for the missing page"
                onError={() => setImageFailed(true)}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <span className="text-8xl" role="img" aria-label="Friendly robot">
                🤖
              </span>
            )}
            <span
              aria-hidden="true"
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-blue-100 bg-white px-4 py-2 text-[10px] font-semibold text-blue-700 shadow-md"
            >
              Beep boop... where am I?
            </span>
          </div>

          <div className="absolute right-[5%] top-[16%] rotate-6 rounded-xl border border-slate-100 bg-white px-3 py-2 text-center shadow-lg">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
              Status
            </span>
            <span className="mt-0.5 block text-xs font-bold text-rose-500">
              Not found
            </span>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-blue-100/80 px-5 py-4 text-center text-[10px] text-slate-400">
        UniMate · Your campus companion · Even the best explorers take a wrong turn sometimes.
      </footer>
    </main>
  );
}
