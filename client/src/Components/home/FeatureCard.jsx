 const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
    <div className="text-3xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </div>
);

export default FeatureCard;