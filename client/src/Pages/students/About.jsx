// src/Pages/students/About.jsx
import Sidebar from '../../Components/common/Sidebar';
import Header from '../../Components/common/Header';
import AboutHero from '../../Components/about/AboutHero.jsx';
import AboutMission from '../../Components/about/AboutMission.jsx';
import AboutHighlights from '../../Components/about/AboutHighlights.jsx';
import AboutValues from '../../Components/about/AboutValues.jsx';
import AboutCTA from '../../Components/about/AboutCTA.jsx';

/**
 * About screen: a short, polished tour of what CampusConnect is, why it exists
 * and where each part of it lives. Composed from the same shell as the other
 * student pages (fixed sidebar + sticky header) so it reads as part of the app.
 */
export default function About() {
  return (
    <div className="flex min-h-screen bg-[#f7f9fc] font-sans text-slate-800 antialiased">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col xl:pl-64">
        <Header hideSearch />

        <main className="mx-auto w-full max-w-[1150px] flex-1 space-y-5 p-4 sm:p-6">
          <AboutHero />
          <AboutMission />
          <AboutHighlights />
          <AboutValues />
          <AboutCTA />
        </main>
      </div>
    </div>
  );
}