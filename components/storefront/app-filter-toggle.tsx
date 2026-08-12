"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { FilterPanel, useFilterState } from "./filter-panel";

export function AppFilterToggle() {
  const [open, setOpen] = useState(false);
  const f = useFilterState();
  const activeCount = [f.category, f.platform, f.price, f.promoOnly ? "promo" : ""].filter(Boolean).length;

  return (
    <>
      <Button variant="secondary" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Buka filter">
        <SlidersHorizontal size={16} />
        Filter
        {activeCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-accent-fg">
            {activeCount}
          </span>
        )}
      </Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Filter">
        <FilterPanel onApplied={() => setOpen(false)} />
      </Drawer>
    </>
  );
}
