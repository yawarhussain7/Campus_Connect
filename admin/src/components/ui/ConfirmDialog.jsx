import { TriangleAlert } from "lucide-react";

import Button from "./Button";
import Modal from "./Modal";

export default function ConfirmDialog({
  open,
  title = "Delete this record?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      size="sm"
      title={title}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>

          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <TriangleAlert size={17} strokeWidth={1.9} />
        </span>

        <p className="pt-1.5 text-[13px] leading-5 text-slate-600">{message}</p>
      </div>
    </Modal>
  );
}
