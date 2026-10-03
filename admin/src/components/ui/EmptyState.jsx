import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon size={20} strokeWidth={1.8} />
      </span>

      <h3 className="mt-3 text-[13.5px] font-semibold text-slate-800">{title}</h3>

      {message ? (
        <p className="mt-1 max-w-sm text-[12.5px] leading-5 text-slate-500">{message}</p>
      ) : null}

      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
