
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Construction, ArrowLeft } from 'lucide-react';

import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';

/**
 * Light placeholder used by sidebar entries that do not have a dedicated
 * screen yet (Messages / Calendar / Resources / About), so the navigation
 * never lands on the 404 route.
 */
export default function ComingSoon({ title, description }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#f6f8fc] font-sans text-slate-800 antialiased">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col xl:pl-64">
        <Header />

        <main className="flex flex-1 items-center justify-center p-6">
          <div className="surface-card max-w-md p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Construction className="h-6 w-6" />
            </div>

            <h1 className="mt-5 text-[15px] font-semibold text-slate-900">{title}</h1>

            <p className="mt-2 text-[13px] leading-6 text-slate-500">
              {description || 'This section is being crafted. Check back soon.'}
            </p>

            <button
              type="button"
              onClick={() => navigate('/student/dashboard')}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-blue-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
