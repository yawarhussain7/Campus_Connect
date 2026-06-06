const DataGrid = ({ title, items, type }) => (
  <div className="space-y-4">
    <h3 className="text-2xl font-bold text-slate-800 mb-6">{title}</h3>
    {items.map((item, idx) => (
      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
        <div>
          <p className="font-bold text-slate-900">{item.main}</p>
          <p className="text-xs text-slate-500">{item.sub}</p>
        </div>
        <div className={`px-3 py-1 rounded-lg text-sm font-bold ${type === 'rating' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {item.meta}
        </div>
      </div>
    ))}
  </div>
);

export default DataGrid;