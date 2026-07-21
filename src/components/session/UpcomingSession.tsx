import { type Overview } from "../../data/workout-session";
import type { ProgramSession } from "../../types";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Row } from "../row/Row";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  session: Overview[];
  nextSession: ProgramSession | null;
  onStartWorkout: () => void;
  onStartFreestanding: () => void;
  isWorkoutActive?: boolean;
  isUpcoming?: boolean;
};

export const UpcomingSession = ({
  session,
  nextSession,
  onStartWorkout,
  onStartFreestanding,
  isWorkoutActive = false,
  isUpcoming = false,
}: Props) => {
  const exercises = (nextSession?.exercises ?? []).map((definition) => ({
    definition,
    overview: session.find(({ id }) => id === definition.exerciseId),
  }));

  return (
    <Card tone="primary" className="upcoming-session">
      <Row justify="between" align="start" mb="md">
        <div>
          <Span text="Ready when you are" size="small" tone="secondary" />
          <Heading
            text={isUpcoming && !isWorkoutActive ? "Upcoming workout" : "Today's workout"}
            level="2"
          />
        </div>
        <Span text={`${exercises.length} exercises`} size="small" tone="secondary" />
      </Row>
      {nextSession ? (
        <div className="upcoming-session__exercises">
          {exercises.map(({ definition, overview }) => (
            <Card padding="sm" key={definition.exerciseId}>
              <div>
                <Span text={definition.label} />
                <Span
                  text={`${definition.sets} × ${definition.reps} reps`}
                  size="small"
                  tone="secondary"
                />
              </div>
              {overview && (
                <Span text={`${overview.value} ${overview.unit}`} size="small" tone="secondary" />
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Span text="No program enrolled — browse programs to get started." size="small" />
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
