"use client";

import React, { useEffect, useState } from "react";
import { AddTransactionDialog } from "@/components/dashboard/AddTransactionDialog";

export function CommandMenu() {
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowAddDialog((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <AddTransactionDialog
      open={showAddDialog}
      onOpenChange={setShowAddDialog}
    />
  );
}
