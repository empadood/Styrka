import type { Overview } from "../../data/workout-session";
import { Button } from "../button/Button";
import { Section } from "../section/Section";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  session: Overview[];
  onViewAllSessions: () => void;
};
export const PreviousSession = ({ session, onViewAllSessions }: Props) => {
  const exercises = session.filter(({ lastSession }) => lastSession?.exercises);

  return (
    <Section>
      <div className="card__heading">
        <div>
          <Span text="Your latest results" size="small" />
          <Heading text="Previous session" level="2" />
        </div>
      </div>
      {exercises.length === 0 ? (
        <Span text="Complete a workout to see your previous performance." size="small" />
      ) : (
        <div className="previous-session__list">
        {exercises.map(({ label, unit, lastSession }) => {
          return (
            lastSession?.exercises && (
              <div className="previous-session__exercise" key={label}>
                <Span text={label} />
                <Span
                  text={`${lastSession.exercises.sets.map((set) => `${set.reps} × ${set.weight}`).join(", ")} ${unit}`}
                  size="small"
                />
              </div>
            )
          );
        })}
        </div>
      )}
      <div className="previous-session__footer">
        <Button
          label="View all sessions"
          onClick={onViewAllSessions}
          variant="secondary"
        />
      </div>
    </Section>
  );
};
