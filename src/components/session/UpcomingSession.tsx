import "./UpcomingSession.scss";

import { type Overview } from "../../data/workout-session";
import type { ProgramSession } from "../../types";
import { Badge } from "../badge/Badge";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Row } from "../row/Row";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  session: Overview[];
  nextSession: ProgramSession | null;
  nextSubSession?: ProgramSession | null;
  subProgramName?: string;
  onStartWorkout: () => void;
  onStartFreestanding: () => void;
  isWorkoutActive?: boolean;
  isUpcoming?: boolean;
};

export const UpcomingSession = ({
  session,
  nextSession,
  nextSubSession = null,
  subProgramName,
  onStartWorkout,
  onStartFreestanding,
  isWorkoutActive = false,
  isUpcoming = false,
}: Props) => {
  const exercises = (nextSession?.exercises ?? []).map((definition) => ({
    definition,
    overview: session.find(({ id }) => id === definition.exerciseId),
  }));
  const subExercises = (nextSubSession?.exercises ?? []).map((definition) => ({
    definition,
    overview: session.find(({ id }) => id === definition.exerciseId),
  }));
  const totalExerciseCount = exercises.length + subExercises.length;

  return (
    <Card tone="primary" className="upcoming-session">
      <Row justify="between" align="start" mb="md">
        <div>
          <Span text="Ready when you are" size="small" tone="secondary" />
          <Heading
            text={
              isUpcoming && !isWorkoutActive
                ? "Upcoming workout"
                : "Today's workout"
            }
            level="2"
          />
        </div>
        <Span
          text={`${totalExerciseCount} exercises`}
          size="small"
          tone="secondary"
        />
      </Row>
      {nextSession ? (
        <div className="upcoming-session__exercises">
          {exercises.map(({ definition, overview }) => (
            <Card padding="sm" key={definition.exerciseId}>
              <Row gap="sm">
                <Span text={definition.label} />
                <Span
                  text={`${definition.sets} × ${definition.reps} reps`}
                  size="small"
                  tone="secondary"
                />
              </Row>
              {overview && (
                <Span
                  text={`${overview.value} ${overview.unit}`}
                  size="small"
                  tone="secondary"
                />
              )}
            </Card>
          ))}
          {subExercises.map(({ definition, overview }) => (
            <Card padding="sm" key={definition.exerciseId}>
              <Row gap="sm">
                <Span text={definition.label} />
                {subProgramName && <Badge size="sm">{subProgramName}</Badge>}
                <Span
                  text={`${definition.sets} × ${definition.reps} reps`}
                  size="small"
                  tone="secondary"
                />
              </Row>
              {overview && (
                <Span
                  text={`${overview.value} ${overview.unit}`}
                  size="small"
                  tone="secondary"
                />
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Span
          text="No program enrolled — browse programs to get started."
          size="small"
        />
      )}
      <div className="upcoming-session__footer">
        {!isWorkoutActive && (
          <Button
            label="Start free-standing workout"
            variant="secondary"
            onClick={onStartFreestanding}
          />
        )}
        <Button
          label={isWorkoutActive ? "Resume workout" : "Start workout"}
          onClick={onStartWorkout}
        />
      </div>
    </Card>
  );
};
