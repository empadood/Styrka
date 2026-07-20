import type { TrackedLiftId } from "../types";

interface WorkingSet {
  reps: number;
  weight: number;
}
interface Session {
  exercises: {
    name: string;
    sets: WorkingSet[];
  };
  increase: number;
}

interface Overview {
  label: string;
  id: TrackedLiftId;
  value: number;
  unit: "kg";
  lastSession?: Session;
}
export type { Overview, Session, WorkingSet };
