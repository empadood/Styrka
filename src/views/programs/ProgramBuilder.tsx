import "./Programs.scss";

import { useNavigate, useParams, useSearchParams } from "react-router-dom";

import { BackHeadingRow, Button, Card, Field, PageContainer } from "../../components";
import { ProgramSessionCard } from "../../components/programbuilder/ProgramSessionCard";
import { TextField } from "../../components/textfield/TextField";
import type { WorkoutStore } from "../../data/storage";
import { getCombinedCatalog } from "../../helpers/exercise-catalog.helper";
import { useProgramDraft } from "../../hooks/useProgramDraft";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

type Props = {
  store: WorkoutStore;
  update: UpdateFn;
};

export const ProgramBuilder = ({ store, update }: Props) => {
  const navigate = useNavigate();
  const { programId } = useParams<{ programId?: string }>();
  const [searchParams] = useSearchParams();
  const newProgramType = searchParams.get("type") === "sub" ? "sub" : "main";
  const existingProgram = programId
    ? store.programs.find((program) => program.id === programId)
    : undefined;

  const catalog = getCombinedCatalog(store);
  const {
    draft,
    error,
    setName,
    updateSessionName,
    addSession,
    removeSession,
    removeExercise,
    addExerciseToSession,
    save,
  } = useProgramDraft(existingProgram, catalog, update, newProgramType);

  const isSubProgram = draft.type === "sub";

  return (
    <PageContainer className="programs">
      <BackHeadingRow
        title={
          programId
            ? isSubProgram
              ? "Edit sub-program"
              : "Edit program"
            : isSubProgram
              ? "New sub-program"
              : "New program"
        }
        onBack={() => navigate("/programs")}
      />

      <Card>
        <Field label="Program name" className="programs__field">
          <TextField
            value={draft.name}
            onChange={setName}
            placeholder="e.g. Upper/Lower split"
          />
        </Field>
      </Card>

      {draft.sessions.map((session) => (
        <ProgramSessionCard
          key={session.id}
          session={session}
          catalog={catalog}
          onNameChange={(name) => updateSessionName(session.id, name)}
          onRemoveSession={() => removeSession(session.id)}
          onRemoveExercise={(exerciseIndex) => removeExercise(session.id, exerciseIndex)}
          onAddExercise={(input) => addExerciseToSession(session.id, input)}
        />
      ))}

      <Button label="Add session" variant="secondary" onClick={addSession} />

      {error && <p className="programs__error">{error}</p>}

      <Button
        label={isSubProgram ? "Save sub-program" : "Save program"}
        onClick={() => save(() => navigate("/programs"))}
      />
    </PageContainer>
  );
};
