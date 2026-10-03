import React from 'react';
import {
  CircleAlert,
  CircleCheck,
  CircleX,
  Inbox,
  Info,
} from 'lucide-react';

import { formatRelativeTime } from '../../utils/date';

const TYPE_META = {
  info: { icon: Info, className: 'text-slate-500' },
  success: { icon: CircleCheck, className: 'text-emerald-600' },
  warning: { icon: CircleAlert, className: 'text-amber-600' },
  error: { icon: CircleX, className: 'text-rose-600' },
};

/**
 * Real notification stream from AppContext. Unread entries are marked in
 * place; clicking one opens its target link.
 */
export default function ActivityFeed({ items = [], onSelect }) {
  const unreadCount = items.filter((item) => !item.isRead).length;

  return (
    <section className="surface-card flex flex-col overflow-hidden">
      <div className="surface-card-header">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">Activity</h2>

          <p className="mt-0.5 text-[11.5px] text-slate-400">
            {unreadCount > 0
              ? `${unreadCount} unread`
              : 'Everything is read'}
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10.5px] font-semibold text-white tabular-nums">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center px-5 py-9 text-center">
          <Inbox className="h-5 w-5 text-slate-300" />

          <p className="mt-3 text-[12.5px] font-medium text-slate-600">
            No activity yet
          </p>

          <p className="mt-1 text-[11.5px] text-slate-400">
            Grades, uploads and announcements land here.
          </p>
        </div>
      ) : (
        <ul className="max-h-[352px] overflow-y-auto">
          {items.map((item) => {
            const meta = TYPE_META[item.type] || TYPE_META.info;
            const Icon = meta.icon;

            return (
              <li key={item._id || item.id}>
                <button
                  type="button"
                  onClick={() => onSelect?.(item)}
                  className="flex w-full items-start gap-3 border-t border-slate-100 px-4 py-3 text-left transition first:border-t-0 hover:bg-slate-50/60"
                >
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${meta.className}`} />

                  <span className="min-w-0 flex-1">
                    <span className="flex items-start justify-between gap-2">
                      <span
                        className={`truncate text-[12.5px] ${
                          item.isRead
                            ? 'font-medium text-slate-600'
                            : 'font-semibold text-slate-800'
                        }`}
                      >
                        {item.title}
                      </span>

                      <span className="shrink-0 text-[10.5px] text-slate-400">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </span>

                    <span className="mt-0.5 line-clamp-2 block text-[11.5px] leading-5 text-slate-500">
                      {item.message}
                    </span>
                  </span>

                  {!item.isRead && (
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
