import type { ExerciseCatalogEntry, ProgramSession } from "../../types";
import { AddExerciseForm } from "../addexercise/AddExerciseForm";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Row } from "../row/Row";
import { Span } from "../text/Span";
import { TextField } from "../textfield/TextField";

type Props = {
  session: ProgramSession;
  catalog: ExerciseCatalogEntry[];
  onNameChange: (name: string) => void;
  onRemoveSession: () => void;
  onRemoveExercise: (exerciseIndex: number) => void;
  onAddExercise: (input: {
    exerciseId?: string;
    customName?: string;
    sets: number;
    reps: number;
  }) => void;
};

export const ProgramSessionCard = ({
  session,
  catalog,
  onNameChange,
  onRemoveSession,
  onRemoveExercise,
  onAddExercise,
}: Props) => (
  <Card>
    <Row justify="between" align="start" mb="md">
      <label className="programs__field">
        <Span text="Session name" size="small" />
        <TextField value={session.name} onChange={onNameChange} />
      </label>
      <Button label="Remove session" variant="danger" onClick={onRemoveSession} />
    </Row>
    <div className="programs__exercise-list">
      {session.exercises.map((exercise, index) => (
        <div className="programs__exercise-row" key={index}>
          <Span text={exercise.label} />
          <Span text={`${exercise.sets} × ${exercise.reps} reps`} size="small" tone="secondary" />
          <Button label="Remove" variant="secondary" onClick={() => onRemoveExercise(index)} />
        </div>
      ))}
    </div>
    <AddExerciseForm catalog={catalog} onSubmit={onAddExercise} submitLabel="Add to session" />
  </Card>
);
