import "./Programs.scss";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button, Card, Heading, PageContainer, Row, Span } from "../../components";
import { AddExerciseForm } from "../../components/addexercise/AddExerciseForm";
import { TextField } from "../../components/textfield/TextField";
import type { WorkoutStore } from "../../data/storage";
import {
  findCatalogEntry,
  getCombinedCatalog,
  resolveCustomExercise,
} from "../../helpers/exercise-catalog.helper";
import type { Program, ProgramExercisePrescription, ProgramSession } from "../../types";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

type Props = {
  store: WorkoutStore;
  update: UpdateFn;
};

const buildEmptyProgram = (): Program => ({
  id: crypto.randomUUID(),
  name: "",
  sessions: [],
  isBuiltIn: false,
  createdAt: new Date().toISOString(),
});

const buildEmptySession = (index: number): ProgramSession => ({
  id: crypto.randomUUID(),
  name: `Day ${index + 1}`,
  exercises: [],
});

export const ProgramBuilder = ({ store, update }: Props) => {
  const navigate = useNavigate();
  const { programId } = useParams<{ programId?: string }>();
  const existingProgram = programId
    ? store.programs.find((program) => program.id === programId)
    : undefined;

  const [draft, setDraft] = useState<Program>(
    () => existingProgram ?? buildEmptyProgram(),
  );
  const [error, setError] = useState("");
  const catalog = getCombinedCatalog(store);

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
          ? {
              ...session,
              exercises: session.exercises.filter((_, i) => i !== exerciseIndex),
            }
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
    },
  ) => {
    const entry = input.exerciseId
      ? findCatalogEntry(catalog, input.exerciseId)
      : resolveCustomExercise(catalog, input.customName ?? "");

    if (!entry) {
      return;
    }

    if (entry.custom && !catalog.some((c) => c.id === entry.id)) {
      update((prev) => ({
        ...prev,
        customExerciseCatalog: [...prev.customExerciseCatalog, entry],
      }));
    }

    const prescription: ProgramExercisePrescription = {
      exerciseId: entry.id,
      label: entry.label,
      sets: input.sets,
      reps: input.reps,
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

  const save = () => {
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
      programs: programId
        ? prev.programs.map((program) => (program.id === programId ? draft : program))
        : [...prev.programs, draft],
    }));
    navigate("/programs");
  };

  return (
    <PageContainer className="programs">
      <Row justify="start" gap="md">
        <Button label="Back" variant="secondary" onClick={() => navigate("/programs")} />
        <Heading text={programId ? "Edit program" : "New program"} level="1" />
      </Row>

      <Card>
        <label className="programs__field">
          <Span text="Program name" size="small" />
          <TextField
            value={draft.name}
            onChange={(name) => setDraft((prev) => ({ ...prev, name }))}
            placeholder="e.g. Upper/Lower split"
          />
        </label>
      </Card>

      {draft.sessions.map((session) => (
        <Card key={session.id}>
          <Row justify="between" align="start" mb="md">
            <label className="programs__field">
              <Span text="Session name" size="small" />
              <TextField
                value={session.name}
                onChange={(name) => updateSessionName(session.id, name)}
              />
            </label>
            <Button
              label="Remove session"
              variant="danger"
              onClick={() => removeSession(session.id)}
            />
          </Row>
          <div className="programs__exercise-list">
            {session.exercises.map((exercise, index) => (
              <div className="programs__exercise-row" key={index}>
                <Span text={exercise.label} />
                <Span text={`${exercise.sets} × ${exercise.reps} reps`} size="small" tone="secondary" />
                <Button
                  label="Remove"
                  variant="secondary"
                  onClick={() => removeExercise(session.id, index)}
                />
              </div>
            ))}
          </div>
          <AddExerciseForm
            catalog={catalog}
            onSubmit={(input) => addExerciseToSession(session.id, input)}
            submitLabel="Add to session"
          />
        </Card>
      ))}

      <Button label="Add session" variant="secondary" onClick={addSession} />

      {error && <p className="programs__error">{error}</p>}

      <Button label="Save program" onClick={save} />
    </PageContainer>
  );
};
