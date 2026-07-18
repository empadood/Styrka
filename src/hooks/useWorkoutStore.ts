import { useState } from "react";

import { loadStore, saveStore, type WorkoutStore } from "../data/storage";

export const useWorkoutStore = () => {
  const [store, setStore] = useState<WorkoutStore>(() => loadStore());

  const update = (updater: (prev: WorkoutStore) => WorkoutStore) => {
    setStore((prev) => {
      const next = updater(prev);
      saveStore(next);
      return next;
    });
  };

  return { store, update };
};
