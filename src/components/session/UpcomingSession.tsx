import { type Overview } from "../../data/workout-session";
import type { ProgramSession } from "../../types";
import { Button } from "../button/Button";
import { Section } from "../section/Section";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  session: Overview[];
  nextSession: ProgramSession | null;
  onStartWorkout: () => void;
  isWorkoutActive?: boolean;
  isUpcoming?: boolean;
};

export const UpcomingSession = ({
  session,
  nextSession,
  onStartWorkout,
  isWorkoutActive = false,
  isUpcoming = false,
}: Props) => {
  const exercises = (nextSession?.exercises ?? []).map((definition) => ({
    definition,
    overview: session.find(({ id }) => id === definition.exerciseId),
  }));

  return (
    <Section className="upcoming-session">
      <div className="card__heading">
        <div>
          <Span text="Ready when you are" size="small" />
          <Heading
            text={isUpcoming && !isWorkoutActive ? "Upcoming workout" : "Today's workout"}
            level="2"
          />
        </div>
        <Span text={`${exercises.length} exercises`} size="small" />
      </div>
      {nextSession ? (
        <div className="upcoming-session__exercises">
          {exercises.map(({ definition, overview }) => (
            <div className="upcoming-session__exercise" key={definition.exerciseId}>
              <div>
                <Span text={definition.label} />
                <Span
                  text={`${definition.sets} × ${definition.reps} reps`}
                  size="small"
                />
              </div>
              {overview && (
                <Span text={`${overview.value} ${overview.unit}`} size="small" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <Span text="No program enrolled — browse programs to get started." size="small" />
      )}
      <div className="upcoming-session__footer">
        <Button
          label={isWorkoutActive ? "Resume workout" : "Start workout"}
          onClick={onStartWorkout}
        />
      </div>
    </Section>
  );
};
