import { useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

export function AccordionItem({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border/70">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-ivory-dim transition-colors hover:text-ivory"
      >
        {title}
        {open ? <Minus size={15} className="shrink-0 text-bronze" /> : <Plus size={15} className="shrink-0" />}
      </button>
      {open && (
        <div className="animate-fade-in pb-5 text-sm leading-relaxed text-ivory-faint">{children}</div>
      )}
    </div>
  );
}
