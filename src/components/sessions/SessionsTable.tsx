import { ChevronDown, ChevronsUpDown } from "lucide-react";
import { Fragment, useState } from "react";

import type { PersonalRecord } from "../../helpers/personal-records.helper";
import { formatSessionDate, type SortDirection, type SortKey } from "../../hooks/useSessionsFilters";
import type { ExerciseId, WorkoutHistoryEntry } from "../../types";
import { Badge } from "../badge/Badge";
import { Span } from "../text/Span";
import { SessionDetailPanel } from "./SessionDetailPanel";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "sessionLabel", label: "Session" },
  { key: "programName", label: "Program" },
  { key: "date", label: "Date" },
  { key: "exercises", label: "Exercises" },
  { key: "cardio", label: "Cardio" },
];

type Props = {
  sessions: WorkoutHistoryEntry[];
  getProgramName: (programId: string | null) => string;
  personalRecords: Map<ExerciseId, PersonalRecord>;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onToggleSort: (key: SortKey) => void;
};

export const SessionsTable = ({
  sessions,
  getProgramName,
  personalRecords,
  sortKey,
  sortDirection,
  onToggleSort,
}: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <table className="sessions__table">
      <thead>
        <tr>
          {COLUMNS.map(({ key, label }) => (
            <th key={key}>
              <button type="button" className="sessions__sort-button" onClick={() => onToggleSort(key)}>
                {label}
                {sortKey === key ? (
                  <ChevronDown
                    aria-hidden="true"
                    size={14}
                    strokeWidth={2}
                    className={`sessions__sort-icon ${sortDirection === "asc" ? "sessions__sort-icon--asc" : ""}`}
                  />
                ) : (
                  <ChevronsUpDown
                    aria-hidden="true"
                    size={14}
                    strokeWidth={2}
                    className="sessions__sort-icon sessions__sort-icon--inactive"
                  />
                )}
              </button>
            </th>
          ))}
          <th aria-hidden="true"></th>
        </tr>
      </thead>
      <tbody>
        {sessions.map((session) => {
          const isExpanded = expandedId === session.id;

          return (
            <Fragment key={session.id}>
              <tr
                className="sessions__row"
                onClick={() => setExpandedId(isExpanded ? null : session.id)}
                aria-expanded={isExpanded}
              >
                <td>
                  <strong>{session.sessionLabel}</strong>
                </td>
                <td>{getProgramName(session.programId)}</td>
                <td>
                  <time dateTime={session.date}>{formatSessionDate(session.date)}</time>
                </td>
                <td>{session.exercises.length}</td>
                <td>
                  {session.cardio.length > 0 ? (
                    <Badge tone="primary" size="sm">
                      {session.cardio.length}
                    </Badge>
                  ) : (
                    <Span text="—" size="small" tone="secondary" />
                  )}
                </td>
                <td className="sessions__chevron-cell">
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    strokeWidth={2}
                    className={`sessions__chevron ${isExpanded ? "sessions__chevron--open" : ""}`}
                  />
                </td>
              </tr>
              {isExpanded && (
                <tr className="sessions__detail-row">
                  <td colSpan={6}>
                    <SessionDetailPanel session={session} personalRecords={personalRecords} />
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};
