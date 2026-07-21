import "./SessionHistory.scss";

import { useState } from "react";

import { Button, Card, Heading, Row, Span, Stack } from "../../components";
import type { WorkoutHistoryEntry } from "../../types";

type Props = {
  sessions: WorkoutHistoryEntry[];
};

const formatDate = (date: string): string =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

export const SessionHistory = ({ sessions }: Props) => {
  const [selectedSession, setSelectedSession] =
    useState<WorkoutHistoryEntry | null>(null);

  if (selectedSession) {
    return (
      <Stack gap="lg" className="session-history">
        <Button
          label="Back to sessions"
          onClick={() => setSelectedSession(null)}
          variant="secondary"
        />
        <Row justify="between" className="session-history__detail-heading">
          <div>
            <Span text={selectedSession.sessionLabel} size="small" />
            <Heading text="Workout details" level="2" />
          </div>
          <time dateTime={selectedSession.date}>
            {formatDate(selectedSession.date)}
          </time>
        </Row>
        {selectedSession.checkIn && (
          <section className="session-history__checkin">
            <Span text={`RPE ${selectedSession.checkIn.rpe}/10`} size="small" />
            {selectedSession.checkIn.notes && (
              <Span text={selectedSession.checkIn.notes} size="small" />
            )}
          </section>
        )}
        <Stack gap="lg" className="session-history__exercise-list">
          {selectedSession.exercises.map((exercise, index) => (
            <Card padding="md" key={index}>
              <Row justify="between" className="session-history__exercise-heading">
                <Heading text={exercise.label} level="3" />
                <Span
                  text={exercise.completed ? "Completed" : "Incomplete"}
                  size="small"
                />
              </Row>
              <div className="session-history__sets">
                {exercise.sets.map((set, index) => (
                  <div className="session-history__set" key={index}>
                    <Span text={`Set ${index + 1}`} size="small" />
                    <Span text={`${set.reps} / ${set.targetReps} reps`} size="small" />
                    <Span text={`${set.weight} kg`} size="small" />
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <div className="session-history">
      {sessions.length === 0 ? (
        <Span text="No completed workouts yet." size="small" />
      ) : (
        <Stack gap="lg" as="ul" className="session-history__list">
          {[...sessions].reverse().map((session) => (
            <Card
              as="button"
              padding="md"
              className="session-history__item"
              key={session.id}
              onClick={() => setSelectedSession(session)}
            >
              <span>
                <strong>{session.sessionLabel}</strong>
                <small>{session.exercises.length} exercises</small>
              </span>
              <time dateTime={session.date}>{formatDate(session.date)}</time>
            </Card>
          ))}
        </Stack>
      )}
    </div>
  );
};
