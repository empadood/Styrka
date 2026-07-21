import "./WeeklyView.scss";

import { buildWeekDays } from "../../helpers/weekly-view.helper";
import type { WorkoutHistoryEntry } from "../../types";
import { Badge } from "../badge/Badge";
import { Card } from "../card/Card";
import { Row } from "../row/Row";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  history: WorkoutHistoryEntry[];
};

export const WeeklyView = ({ history }: Props) => {
  const days = buildWeekDays(history);

  return (
    <Card className="weekly-view">
      <Heading text="This week" level="2" />
      <Row justify="between" className="weekly-view__grid">
        {days.map((day) => (
          <div
            key={day.date}
            className={`weekly-view__day ${day.hasSession ? "weekly-view__day--done" : ""}`}
          >
            <Span text={day.weekdayLabel} size="small" tone="secondary" />
            {day.hasSession ? (
              <Badge tone="success" size="sm">
                {day.sessionLabel}
              </Badge>
            ) : (
              <span className="weekly-view__dot" aria-hidden="true" />
            )}
          </div>
        ))}
      </Row>
    </Card>
  );
};
