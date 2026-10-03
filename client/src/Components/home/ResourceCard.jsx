import { Clock, CodeXml, Download, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * "Popular Resources" card. The leading tile summarises the file type (code
 * uploads show a glyph instead of a label), followed by the title, the
 * resource category and the download / recency row.
 */

const FILE_KINDS = {
  pdf: { tile: 'bg-rose-500', label: 'PDF' },
  code: { tile: 'bg-violet-500', label: null },
  doc: { tile: 'bg-blue-500', label: 'DOC' },
};

const CATEGORY_TONES = {
  Notes: 'bg-blue-50 text-blue-700',
  Projects: 'bg-emerald-50 text-emerald-700',
  'Past Papers': 'bg-violet-50 text-violet-700',
  Assignments: 'bg-amber-50 text-amber-700',
};

const ResourceCard = ({ resource }) => {
  const kind = FILE_KINDS[resource.kind] ?? FILE_KINDS.pdf;
  const KindIcon = resource.kind === 'code' ? CodeXml : FileText;

  return (
    <Link
      to={resource.to}
      className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <span
          className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl text-white ${kind.tile}`}
        >
          <KindIcon className="h-[18px] w-[18px]" />

          {kind.label && (
            <span className="text-[9.5px] font-bold tracking-wide">{kind.label}</span>
          )}
        </span>

        <div className="min-w-0">
          <p className="text-[14.5px] font-semibold leading-snug text-slate-900 transition-colors group-hover:text-blue-700">
            {resource.title}
          </p>

          <span
            className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              CATEGORY_TONES[resource.category] ?? 'bg-slate-100 text-slate-600'
            }`}
          >
            {resource.category}
          </span>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-5 text-[12px] text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <Download className="h-3.5 w-3.5" />
          {resource.downloads}
        </span>

        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {resource.age}
        </span>
      </div>
    </Link>
  );
};

export default ResourceCard;
