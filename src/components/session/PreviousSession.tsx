import "./PreviousSession.scss";

import type { Overview } from "../../data/workout-session";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { Row } from "../row/Row";
import { Stack } from "../stack/Stack";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  session: Overview[];
  onViewAllSessions: () => void;
};
export const PreviousSession = ({ session, onViewAllSessions }: Props) => {
  const exercises = session.filter(({ lastSession }) => lastSession?.exercises);

  return (
    <Card>
      <Row justify="between" align="start" mb="md">
        <div>
          <Span text="Your latest results" size="small" tone="secondary" />
          <Heading text="Previous session" level="2" />
        </div>
      </Row>
      {exercises.length === 0 ? (
        <Span text="Complete a workout to see your previous performance." size="small" />
      ) : (
        <Stack gap="md" className="previous-session__list">
        {exercises.map(({ label, unit, lastSession }) => {
          return (
            lastSession?.exercises && (
              <div className="previous-session__exercise" key={label}>
                <Span text={label} />
                <Span
                  text={`${lastSession.exercises.sets.map((set) => `${set.reps} × ${set.weight}`).join(", ")} ${unit}`}
                  size="small"
                  tone="secondary"
                />
              </div>
            )
          );
        })}
        </Stack>
      )}
      <div className="previous-session__footer">
        <Button
          label="View all sessions"
          onClick={onViewAllSessions}
          variant="secondary"
        />
      </div>
    </Card>
  );
};
