import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { QuestionPack, PackState, ALL_PACKS, DEFAULT_PACK } from "@/types/pack";

const STORAGE_KEY = "party-king-packs";

function loadPackState(): PackState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PackState;
      // Ensure starter pack is always owned
      if (!parsed.ownedPackIds.includes(DEFAULT_PACK.id)) {
        parsed.ownedPackIds.push(DEFAULT_PACK.id);
      }
      // Ensure at least starter pack is selected if nothing is
      if (parsed.selectedPackIds.length === 0) {
        parsed.selectedPackIds = [DEFAULT_PACK.id];
      }
      return parsed;
    }
  } catch {
    // ignore
  }
  return {
    ownedPackIds: [DEFAULT_PACK.id],
    selectedPackIds: [DEFAULT_PACK.id],
  };
}

function savePackState(state: PackState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

interface PackContextType {
  packs: QuestionPack[];
  ownedPackIds: string[];
  selectedPackIds: string[];
  isOwned: (packId: string) => boolean;
  isSelected: (packId: string) => boolean;
  purchasePack: (packId: string) => void;
  togglePackSelection: (packId: string) => void;
  /** True if no packs are selected — game should not start */
  noPacksSelected: boolean;
}

const PackContext = createContext<PackContextType | null>(null);

export function PackProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PackState>(loadPackState);

  useEffect(() => {
    savePackState(state);
  }, [state]);

  const isOwned = useCallback(
    (packId: string) => state.ownedPackIds.includes(packId),
    [state.ownedPackIds]
  );

  const isSelected = useCallback(
    (packId: string) => state.selectedPackIds.includes(packId),
    [state.selectedPackIds]
  );

  const purchasePack = useCallback((packId: string) => {
    setState((s) => {
      if (s.ownedPackIds.includes(packId)) return s; // prevent duplicate
      return {
        ...s,
        ownedPackIds: [...s.ownedPackIds, packId],
        selectedPackIds: [...s.selectedPackIds, packId],
      };
    });
  }, []);

  const togglePackSelection = useCallback((packId: string) => {
    setState((s) => {
      if (!s.ownedPackIds.includes(packId)) return s; // can't select unowned
      const isCurrentlySelected = s.selectedPackIds.includes(packId);
      let next: string[];
      if (isCurrentlySelected) {
        next = s.selectedPackIds.filter((id) => id !== packId);
        // Prevent deselecting all packs
        if (next.length === 0) return s;
      } else {
        next = [...s.selectedPackIds, packId];
      }
      return { ...s, selectedPackIds: next };
    });
  }, []);

  const noPacksSelected = state.selectedPackIds.length === 0;

  return (
    <PackContext.Provider
      value={{
        packs: ALL_PACKS,
        ownedPackIds: state.ownedPackIds,
        selectedPackIds: state.selectedPackIds,
        isOwned,
        isSelected,
        purchasePack,
        togglePackSelection,
        noPacksSelected,
      }}
    >
      {children}
    </PackContext.Provider>
  );
}

export function usePacks() {
  const ctx = useContext(PackContext);
  if (!ctx) throw new Error("usePacks must be used within PackProvider");
  return ctx;
}
