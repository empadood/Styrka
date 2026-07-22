import "./Sessions.scss";

import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react";
import { Fragment, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Button,
  Card,
  Heading,
  PageContainer,
  Row,
  Span,
  Stack,
  TextField,
} from "../../components";
import { formatDuration } from "../../helpers/cardio.helper";
import { findPersonalRecords, isPersonalRecordSet } from "../../helpers/personal-records.helper";
import { CARDIO_ACTIVITY_LABELS, type Program, type WorkoutHistoryEntry } from "../../types";

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

type SortKey = "sessionLabel" | "programName" | "date" | "exercises" | "cardio";
type SortDirection = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "sessionLabel", label: "Session" },
  { key: "programName", label: "Program" },
  { key: "date", label: "Date" },
  { key: "exercises", label: "Exercises" },
  { key: "cardio", label: "Cardio" },
];

export const Sessions = ({ sessions, programs }: Props) => {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

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

  const clearFilters = () => {
    setSearchText("");
    setProgramFilter("all");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchText.trim() !== "" || programFilter !== "all" || dateFrom !== "" || dateTo !== "";

  const personalRecords = useMemo(() => findPersonalRecords(sessions), [sessions]);

  const filteredSessions = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesProgram =
        programFilter === "all" ||
        (programFilter === "freestanding" && session.programId === null) ||
        session.programId === programFilter;

      const sessionDate = formatDate(session.date);
      const matchesDate =
        (!dateFrom || sessionDate >= dateFrom) && (!dateTo || sessionDate <= dateTo);

      const haystack = [
        session.sessionLabel,
        getProgramName(session.programId),
        ...session.exercises.map((exercise) => exercise.label),
        ...session.cardio.map((entry) => entry.label),
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = query === "" || haystack.includes(query);

      return matchesProgram && matchesDate && matchesSearch;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions, programFilter, dateFrom, dateTo, searchText, programs]);

  const orderedSessions = useMemo(() => {
    const direction = sortDirection === "asc" ? 1 : -1;

    return [...filteredSessions].sort((a, b) => {
      switch (sortKey) {
        case "sessionLabel":
          return a.sessionLabel.localeCompare(b.sessionLabel) * direction;
        case "programName":
          return getProgramName(a.programId).localeCompare(getProgramName(b.programId)) * direction;
        case "exercises":
          return (a.exercises.length - b.exercises.length) * direction;
        case "cardio":
          return (a.cardio.length - b.cardio.length) * direction;
        case "date":
        default:
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredSessions, sortKey, sortDirection, programs]);

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
        <Row justify="start" gap="md" className="sessions__filters">
          <TextField
            value={searchText}
            onChange={(value) => {
              setSearchText(value);
              setCurrentPage(1);
            }}
            placeholder="Search sessions or exercises…"
          />
          <select
            aria-label="Filter by program"
            value={programFilter}
            onChange={(e) => {
              setProgramFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All programs</option>
            <option value="freestanding">Freestanding</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
          <label>
            From
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>
          <label>
            To
            <input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setCurrentPage(1);
              }}
            />
          </label>
          {hasActiveFilters && (
            <Button label="Clear filters" variant="secondary" onClick={clearFilters} />
          )}
        </Row>
      </Card>

      <Card padding="sm">
        {orderedSessions.length === 0 ? (
          <Span
            text={
              sessions.length === 0
                ? "No completed workouts yet."
                : "No sessions match your filters."
            }
            size="small"
          />
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
                          <Stack gap="md" className="sessions__detail">
                            {session.checkIn && (
                              <section className="sessions__checkin">
                                <Span text={`RPE ${session.checkIn.rpe}/10`} size="small" />
                                {session.checkIn.notes && (
                                  <Span text={session.checkIn.notes} size="small" />
                                )}
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
                                        <Row gap="sm" align="center">
                                          <Span
                                            text={`${set.reps} / ${set.targetReps} reps`}
                                            size="small"
                                          />
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
