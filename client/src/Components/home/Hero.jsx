const Hero = () => (
  <section className="bg-slate-900 text-white py-24 px-6 text-center">
    <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
      Your Academic Journey, <span className="text-blue-400">Simplified.</span>
    </h1>
    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
      Access COMSATS past papers, read authentic teacher reviews, and help your fellow students by sharing resources.
    </p>
    <div className="flex justify-center gap-4">
      <button className="bg-blue-500 px-8 py-3 rounded-xl font-bold hover:scale-105 transition">Find Papers</button>
      <button className="bg-slate-800 px-8 py-3 rounded-xl font-bold border border-slate-700 hover:bg-slate-700">Review Teachers</button>
    </div>
  </section>
);

export default Hero;