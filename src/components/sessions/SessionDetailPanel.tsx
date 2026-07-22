import { formatDuration } from "../../helpers/cardio.helper";
import { isPersonalRecordSet, type PersonalRecord } from "../../helpers/personal-records.helper";
import { CARDIO_ACTIVITY_LABELS, type ExerciseId, type WorkoutHistoryEntry } from "../../types";
import { Badge } from "../badge/Badge";
import { Row } from "../row/Row";
import { Stack } from "../stack/Stack";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  session: WorkoutHistoryEntry;
  personalRecords: Map<ExerciseId, PersonalRecord>;
};

export const SessionDetailPanel = ({ session, personalRecords }: Props) => (
  <Stack gap="md" className="sessions__detail">
    {session.checkIn && (
      <section className="sessions__checkin">
        <Span text={`RPE ${session.checkIn.rpe}/10`} size="small" />
        {session.checkIn.notes && <Span text={session.checkIn.notes} size="small" />}
      </section>
    )}
    {session.cardio.length > 0 && (
      <Stack gap="md" className="sessions__cardio-list">
        {session.cardio.map((entry) => (
          <div className="sessions__exercise" key={entry.id}>
            <Row justify="between" className="sessions__exercise-heading">
              <Heading text={CARDIO_ACTIVITY_LABELS[entry.activityId]} level="3" />
              <Span text={formatDuration(entry.durationSeconds)} size="small" />
            </Row>
            <Span text={`${entry.kcal} kcal`} size="small" />
          </div>
        ))}
      </Stack>
    )}
    <Stack gap="md" className="sessions__exercise-list">
      {session.exercises.map((exercise, index) => (
        <div className="sessions__exercise" key={index}>
          <Row justify="between" className="sessions__exercise-heading">
            <Row gap="sm" align="center">
              <Heading text={exercise.label} level="3" />
              {exercise.sourceLabel && <Badge size="sm">{exercise.sourceLabel}</Badge>}
            </Row>
            <Span text={exercise.completed ? "Completed" : "Incomplete"} size="small" />
          </Row>
          <div className="sessions__sets">
            {exercise.sets.map((set, setIndex) => (
              <div className="sessions__set" key={setIndex}>
                <Span text={`Set ${setIndex + 1}`} size="small" />
                <Row gap="sm" align="center">
                  <Span text={`${set.reps} / ${set.targetReps} reps`} size="small" />
                  {isPersonalRecordSet(
                    personalRecords,
                    session,
                    exercise.exerciseId,
                    set.weight,
                    set.reps,
                  ) && (
                    <Badge tone="success" size="sm">
                      PR
                    </Badge>
                  )}
                </Row>
                <Span text={`${set.weight} kg`} size="small" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </Stack>
  </Stack>
);
