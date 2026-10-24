import SiteNavbar from '../../Components/home/SiteNavbar';
import SiteFooter from '../../Components/home/SiteFooter';

import AcademicModules from '../../Components/home/AcademicModules';
import FeatureGrid from '../../Components/home/FeatureGrid';
import HowItWorks from '../../Components/home/HowItWorks';
import CTASection from '../../Components/home/CTASection';

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      <main>
        <section className="bg-[#f8fafc] border-b border-slate-200/80 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-700">
              Our Services
            </span>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Everything you need for <span className="text-blue-600">semester success</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-slate-500">
              Explore the academic services UniMate offers to students — from past papers and projects to smart timetables and teacher reviews.
            </p>
          </div>
        </section>
        <AcademicModules />
        <FeatureGrid />
        <HowItWorks />
        <CTASection />
      </main>
      <SiteFooter />
    </div>
  );
}
