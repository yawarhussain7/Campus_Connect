import React from 'react';
import {
  Braces,
  CalendarDays,
  Clock,
  Code2,
  Cpu,
  Database,
  Download,
  Eye,
  FileText,
  Settings,
  Share2,
} from 'lucide-react';

import { formatMediumDate } from '../../utils/date.js';
import { courseCode, examLabel, examTone, formatFileSize } from '../../utils/paper.js';

const COLUMNS = [
  'Course code',
  'Course name',
  'Semester / year',
  'Exam type',
  'File',
  'Actions',
  'Posted on',
];

// Small icon set the course column cycles through, picked from the course name
// so a given course always keeps the same icon.
const ROW_ICONS = [Code2, Share2, Database, Settings, Braces, Cpu];

const iconSeed = (value) =>
  [...String(value || '')].reduce((total, char) => total + char.charCodeAt(0), 0);

export default function PastPaperTable({ papers = [], onDownload, onPreview }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1040px] border-collapse text-left">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-[11.5px] font-medium text-slate-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {papers.map((paper) => {
            const Icon = ROW_ICONS[iconSeed(paper.subject) % ROW_ICONS.length];

            return (
              <tr
                key={paper.id}
                className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60"
              >
                {/* Course code */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] border border-blue-100 bg-blue-50 text-blue-600">
                      <Icon className="h-4 w-4" />
                    </span>

                    <span className="text-[12.5px] font-medium text-slate-800">
                      {courseCode(paper)}
                    </span>
                  </div>
                </td>

                {/* Course name */}
                <td className="px-4 py-3 align-middle">
                  <p className="text-[12.5px] font-semibold text-slate-900">
                    {paper.subject}
                  </p>

                  <p className="mt-0.5 text-[11.5px] text-slate-400">
                    {paper.department || 'Department not listed'}
                  </p>
                </td>

                {/* Semester / year */}
                <td className="px-4 py-3 align-middle">
                  <span className="flex items-center gap-2 text-[12px] text-slate-600">
                    <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="whitespace-nowrap tabular-nums">
                      {[paper.semester, paper.year].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                </td>

                {/* Exam type */}
                <td className="px-4 py-3 align-middle">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-md px-2 py-[3px] text-[11px] font-medium ${examTone(
                      paper.exam
                    )}`}
                  >
                    {examLabel(paper.exam)}
                  </span>
                </td>

                {/* File */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-rose-50 text-rose-600">
                      <FileText className="h-4 w-4" />
                    </span>

                    <div>
                      <p className="text-[12px] font-medium text-slate-700">PDF</p>

                      <p className="text-[11px] text-slate-400 tabular-nums">
                        {formatFileSize(paper.fileSize)}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDownload?.(paper)}
                      className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[8px] bg-blue-600 px-3 text-[12px] font-medium text-white transition hover:bg-blue-700"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>

                    <button
                      type="button"
                      onClick={() => onPreview?.(paper)}
                      className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-[8px] border border-blue-100 bg-blue-50 px-3 text-[12px] font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </div>
                </td>

                {/* Posted on */}
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                    <div className="text-[11.5px] leading-5">
                      <p className="whitespace-nowrap text-slate-600 tabular-nums">
                        {formatMediumDate(paper.createdAt)}
                      </p>

                      <p className="truncate text-slate-400">
                        by {paper.instructor || 'Unknown uploader'}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
