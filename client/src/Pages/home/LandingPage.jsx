import Navbar from '../../Components/common/Navbar';
import Hero from '../../Components/home/Hero';
import FeatureCard from '../../Components/home/FeatureCard';
import DataGrid from '../../Components/home/DataGrid';

const LandingPage = () => {
  const teachers = [
    { main: "Dr. Nadeem Ahmed", sub: "Computer Science", meta: "⭐ 4.9" },
    { main: "Ms. Sarah Khan", sub: "Humanities", meta: "⭐ 4.7" }
  ];

  const papers = [
    { main: "Data Structures", sub: "CSC211 - FA23", meta: "PDF" },
    { main: "Linear Algebra", sub: "MTH231 - SP24", meta: "PDF" }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      
      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-3 gap-8">
        <FeatureCard icon="📂" title="Past Papers" desc="Organized by semester and teacher." />
        <FeatureCard icon="✍️" title="Teacher Reviews" desc="Honest feedback from actual students." />
        <FeatureCard icon="🤝" title="Community" desc="Built by students, for students." />
      </section>

      <section className="max-w-7xl mx-auto py-20 px-6 grid lg:grid-cols-2 gap-16 border-t border-slate-200">
        <DataGrid title="Top Rated Teachers" items={teachers} type="rating" />
        <DataGrid title="Recent Past Papers" items={papers} type="download" />
      </section>

      <footer className="bg-slate-900 py-10 text-center text-slate-500 text-sm">
        © 2026 CUI Student Hub. Not an official COMSATS website.
      </footer>
    </div>
  );
};

export default LandingPage;