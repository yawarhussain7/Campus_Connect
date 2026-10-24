import SiteNavbar from '../../Components/home/SiteNavbar';
import SiteFooter from '../../Components/home/SiteFooter';

import AboutHero from '../../Components/about/AboutHero.jsx';
import AboutMission from '../../Components/about/AboutMission.jsx';
import AboutHighlights from '../../Components/about/AboutHighlights.jsx';
import AboutValues from '../../Components/about/AboutValues.jsx';
import AboutCTA from '../../Components/about/AboutCTA.jsx';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <AboutHero />
        <AboutMission />
        <AboutHighlights />
        <AboutValues />
        <AboutCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
