import { SESSION_DEFINITION } from "../../data/session-definition";
import { type Overview } from "../../data/workout-session";
import type { SessionType } from "../../types";
import { Button } from "../button/Button";
import { Section } from "../section/Section";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  session: Overview[];
  sessionType: SessionType;
  onStartWorkout: () => void;
  isWorkoutActive?: boolean;
  isUpcoming?: boolean;
};

export const UpcomingSession = ({
  session,
  sessionType,
  onStartWorkout,
  isWorkoutActive = false,
  isUpcoming = false,
}: Props) => {
  const exercises = SESSION_DEFINITION[sessionType].flatMap((definition) =>
    session
      .filter(({ id }) => id === definition.name)
      .map((overview) => ({ definition, overview })),
  );

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
      <div className="upcoming-session__exercises">
        {exercises.map(({ definition, overview }) => (
          <div className="upcoming-session__exercise" key={overview.label}>
            <div>
              <Span text={overview.label} />
              <Span
                text={`${definition.sets} × ${definition.reps} reps`}
                size="small"
              />
            </div>
            <Span text={`${overview.value} ${overview.unit}`} size="small" />
          </div>
        ))}
      </div>
      <div className="upcoming-session__footer">
        <Button
          label={isWorkoutActive ? "Resume workout" : "Start workout"}
          onClick={onStartWorkout}
        />
      </div>
    </Section>
  );
};
