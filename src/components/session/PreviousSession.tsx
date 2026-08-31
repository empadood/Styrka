import "./PreviousSession.scss";

import type { Overview } from "../../data/workout-session";
import { Button } from "../button/Button";
import { Card } from "../card/Card";
import { CardHeader } from "../cardheader/CardHeader";
import { Stack } from "../stack/Stack";
import { Span } from "../text/Span";

type Props = {
  session: Overview[];
  onViewAllSessions: () => void;
};
export const PreviousSession = ({ session, onViewAllSessions }: Props) => {
  const exercises = session.filter(({ lastSession }) => lastSession?.exercises);

  return (
    <Card>
      <CardHeader eyebrow="Your latest results" title="Previous session" />
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
