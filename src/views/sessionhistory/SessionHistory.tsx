import "./SessionHistory.css";

import { useState } from "react";

import { Button, Heading, Span } from "../../components";
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
      <div className="session-history">
        <Button
          label="Back to sessions"
          onClick={() => setSelectedSession(null)}
          variant="secondary"
        />
        <div className="session-history__detail-heading">
          <div>
            <Span text={selectedSession.sessionLabel} size="small" />
            <Heading text="Workout details" level="2" />
          </div>
          <time dateTime={selectedSession.date}>
            {formatDate(selectedSession.date)}
          </time>
        </div>
        {selectedSession.checkIn && (
          <section className="session-history__checkin">
            <Span text={`RPE ${selectedSession.checkIn.rpe}/10`} size="small" />
            {selectedSession.checkIn.notes && (
              <Span text={selectedSession.checkIn.notes} size="small" />
            )}
          </section>
        )}
        <div className="session-history__exercise-list">
          {selectedSession.exercises.map((exercise, index) => (
            <section className="session-history__exercise" key={index}>
              <div className="session-history__exercise-heading">
                <Heading text={exercise.label} level="3" />
                <Span
                  text={exercise.completed ? "Completed" : "Incomplete"}
                  size="small"
                />
              </div>
              <div className="session-history__sets">
                {exercise.sets.map((set, index) => (
                  <div className="session-history__set" key={index}>
                    <Span text={`Set ${index + 1}`} size="small" />
                    <Span text={`${set.reps} / ${set.targetReps} reps`} size="small" />
                    <Span text={`${set.weight} kg`} size="small" />
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="session-history">
      {sessions.length === 0 ? (
        <Span text="No completed workouts yet." size="small" />
      ) : (
        <div className="session-history__list">
          {[...sessions].reverse().map((session) => (
            <button
              className="session-history__item"
              key={session.id}
              onClick={() => setSelectedSession(session)}
            >
              <span>
                <strong>{session.sessionLabel}</strong>
                <small>{session.exercises.length} exercises</small>
              </span>
              <time dateTime={session.date}>{formatDate(session.date)}</time>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
