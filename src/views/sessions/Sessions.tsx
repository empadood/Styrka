import "./Sessions.scss";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Card, Heading, PageContainer, Row, Span, Stack } from "../../components";
import type { Program, WorkoutHistoryEntry } from "../../types";

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

type Props = {
  sessions: WorkoutHistoryEntry[];
  programs: Program[];
};

const formatDate = (date: string): string => {
  const parts = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(date));
  const lookup = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
};

type SortKey = "sessionLabel" | "programName" | "date" | "exercises";
type SortDirection = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "sessionLabel", label: "Session" },
  { key: "programName", label: "Program" },
  { key: "date", label: "Date" },
  { key: "exercises", label: "Exercises" },
];

export const Sessions = ({ sessions, programs }: Props) => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);

  const getProgramName = (programId: string | null): string =>
    programs.find((program) => program.id === programId)?.name ?? "Freestanding";

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const orderedSessions = useMemo(() => {
    const direction = sortDirection === "asc" ? 1 : -1;

    return [...sessions].sort((a, b) => {
      switch (sortKey) {
        case "sessionLabel":
          return a.sessionLabel.localeCompare(b.sessionLabel) * direction;
        case "programName":
          return getProgramName(a.programId).localeCompare(getProgramName(b.programId)) * direction;
        case "exercises":
          return (a.exercises.length - b.exercises.length) * direction;
        case "date":
        default:
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, sortKey, sortDirection, programs]);

  const totalPages = Math.max(1, Math.ceil(orderedSessions.length / pageSize));
  const clampedPage = Math.min(currentPage, totalPages);
  const pageStart = (clampedPage - 1) * pageSize;
  const paginatedSessions = orderedSessions.slice(pageStart, pageStart + pageSize);

  return (
    <PageContainer className="sessions">
      <Row justify="start" gap="md">
        <Button label="Back" variant="secondary" onClick={() => navigate("/")} />
        <Heading text="Sessions" level="1" />
      </Row>

      <Card padding="sm">
        {orderedSessions.length === 0 ? (
          <Span text="No completed workouts yet." size="small" />
        ) : (
          <table className="sessions__table">
            <thead>
              <tr>
                {COLUMNS.map(({ key, label }) => (
                  <th key={key}>
                    <button
                      type="button"
                      className="sessions__sort-button"
                      onClick={() => toggleSort(key)}
                    >
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
              {paginatedSessions.map((session) => {
                const isExpanded = expandedId === session.id;

                return (
                  <Fragment key={session.id}>
                    <tr
                      className="sessions__row"
                      onClick={() =>
                        setExpandedId(isExpanded ? null : session.id)
                      }
                      aria-expanded={isExpanded}
                    >
                      <td>
                        <strong>{session.sessionLabel}</strong>
                      </td>
                      <td>{getProgramName(session.programId)}</td>
                      <td>
                        <time dateTime={session.date}>{formatDate(session.date)}</time>
                      </td>
                      <td>{session.exercises.length}</td>
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
                        <td colSpan={5}>
                          <Stack gap="md" className="sessions__detail">
                            {session.checkIn && (
                              <section className="sessions__checkin">
                                <Span text={`RPE ${session.checkIn.rpe}/10`} size="small" />
                                {session.checkIn.notes && (
                                  <Span text={session.checkIn.notes} size="small" />
                                )}
                              </section>
                            )}
                            <Stack gap="md" className="sessions__exercise-list">
                              {session.exercises.map((exercise, index) => (
                                <div className="sessions__exercise" key={index}>
                                  <Row justify="between" className="sessions__exercise-heading">
                                    <Heading text={exercise.label} level="3" />
                                    <Span
                                      text={exercise.completed ? "Completed" : "Incomplete"}
                                      size="small"
                                    />
                                  </Row>
                                  <div className="sessions__sets">
                                    {exercise.sets.map((set, setIndex) => (
                                      <div className="sessions__set" key={setIndex}>
                                        <Span text={`Set ${setIndex + 1}`} size="small" />
                                        <Span
                                          text={`${set.reps} / ${set.targetReps} reps`}
                                          size="small"
                                        />
                                        <Span text={`${set.weight} kg`} size="small" />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </Stack>
                          </Stack>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}
        {orderedSessions.length > 0 && (
          <Row justify="between" className="sessions__footer">
            <div className="sessions__page-size">
              <label htmlFor="sessions-page-size">Rows per page</label>
              <select
                id="sessions-page-size"
                value={pageSize}
                onChange={(e) => changePageSize(Number(e.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <Span
              text={`${pageStart + 1}–${Math.min(pageStart + pageSize, orderedSessions.length)} of ${orderedSessions.length}`}
              size="small"
              tone="secondary"
            />
            <div className="sessions__pagination">
              <Button
                icon={ChevronLeft}
                variant="secondary"
                size="icon"
                ariaLabel="Previous page"
                disabled={clampedPage <= 1}
                onClick={() => setCurrentPage(Math.max(1, clampedPage - 1))}
              />
              <Span text={`Page ${clampedPage} of ${totalPages}`} size="small" />
              <Button
                icon={ChevronRight}
                variant="secondary"
                size="icon"
                ariaLabel="Next page"
                disabled={clampedPage >= totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, clampedPage + 1))}
              />
            </div>
          </Row>
        )}
      </Card>
    </PageContainer>
  );
};
