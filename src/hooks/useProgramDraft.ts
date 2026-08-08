import { useState } from "react";

import type { WorkoutStore } from "../data/storage";
import { resolveExerciseSelection } from "../helpers/exercise-catalog.helper";
import type {
  ExerciseCatalogEntry,
  Program,
  ProgramExercisePrescription,
  ProgramSession,
} from "../types";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

const buildEmptyProgram = (type: Program["type"]): Program => ({
  id: crypto.randomUUID(),
  name: "",
  sessions: [],
  isBuiltIn: false,
  createdAt: new Date().toISOString(),
  type,
});

const buildEmptySession = (index: number): ProgramSession => ({
  id: crypto.randomUUID(),
  name: `Day ${index + 1}`,
  exercises: [],
});

export const useProgramDraft = (
  existingProgram: Program | undefined,
  catalog: ExerciseCatalogEntry[],
  update: UpdateFn,
  newProgramType: Program["type"] = "main",
) => {
  const [draft, setDraft] = useState<Program>(
    () => existingProgram ?? buildEmptyProgram(newProgramType),
  );
  const [error, setError] = useState("");

  const setName = (name: string) => setDraft((prev) => ({ ...prev, name }));

  const updateSessionName = (sessionId: string, name: string) => {
    setDraft((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId ? { ...session, name } : session,
      ),
    }));
  };

  const addSession = () => {
    setDraft((prev) => ({
      ...prev,
      sessions: [...prev.sessions, buildEmptySession(prev.sessions.length)],
    }));
  };

  const removeSession = (sessionId: string) => {
    setDraft((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((session) => session.id !== sessionId),
    }));
  };

  const removeExercise = (sessionId: string, exerciseIndex: number) => {
    setDraft((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, exercises: session.exercises.filter((_, i) => i !== exerciseIndex) }
          : session,
      ),
    }));
  };

  const addExerciseToSession = (
    sessionId: string,
    input: {
      exerciseId?: string;
      customName?: string;
      sets: number;
      reps: number;
      showWeightIndicator: boolean;
      showWarmupSets: boolean;
      isBodyweight: boolean;
    },
  ) => {
    const entry = resolveExerciseSelection(catalog, input, (registered) =>
      update((prev) => ({
        ...prev,
        customExerciseCatalog: [...prev.customExerciseCatalog, registered],
      })),
    );

    if (!entry) {
      return;
    }

    const prescription: ProgramExercisePrescription = {
      exerciseId: entry.id,
      label: entry.label,
      sets: input.sets,
      reps: input.reps,
      showWeightIndicator: input.showWeightIndicator,
      showWarmupSets: input.showWarmupSets,
      isBodyweight: input.isBodyweight,
    };

    setDraft((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session) =>
        session.id === sessionId
          ? { ...session, exercises: [...session.exercises, prescription] }
          : session,
      ),
    }));
  };

  const save = (onSaved: (program: Program) => void) => {
    if (!draft.name.trim()) {
      setError("Give your program a name.");
      return;
    }
    if (draft.sessions.length === 0) {
      setError("Add at least one session.");
      return;
    }
    if (draft.sessions.some((session) => session.exercises.length === 0)) {
      setError("Every session needs at least one exercise.");
      return;
    }

    update((prev) => ({
      ...prev,
      programs: existingProgram
        ? prev.programs.map((program) => (program.id === existingProgram.id ? draft : program))
        : [...prev.programs, draft],
    }));
    onSaved(draft);
  };

  return {
    draft,
    error,
    setName,
    updateSessionName,
    addSession,
    removeSession,
    removeExercise,
    addExerciseToSession,
    save,
  };
};
