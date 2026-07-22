import { useMemo, useState } from "react";

import { findPersonalRecords } from "../helpers/personal-records.helper";
import type { Program, WorkoutHistoryEntry } from "../types";

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export type SortKey = "sessionLabel" | "programName" | "date" | "exercises" | "cardio";
export type SortDirection = "asc" | "desc";

export const formatSessionDate = (date: string): string => {
  const parts = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(date));
  const lookup = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
};

export const useSessionsFilters = (sessions: WorkoutHistoryEntry[], programs: Program[]) => {
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

  const changeSearchText = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const changeProgramFilter = (value: string) => {
    setProgramFilter(value);
    setCurrentPage(1);
  };

  const changeDateFrom = (value: string) => {
    setDateFrom(value);
    setCurrentPage(1);
  };

  const changeDateTo = (value: string) => {
    setDateTo(value);
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

      const sessionDate = formatSessionDate(session.date);
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

  return {
    searchText,
    setSearchText: changeSearchText,
    programFilter,
    setProgramFilter: changeProgramFilter,
    dateFrom,
    setDateFrom: changeDateFrom,
    dateTo,
    setDateTo: changeDateTo,
    clearFilters,
    hasActiveFilters,
    sortKey,
    sortDirection,
    toggleSort,
    pageSize,
    setPageSize: changePageSize,
    currentPage: clampedPage,
    setCurrentPage,
    totalPages,
    pageStart,
    getProgramName,
    personalRecords,
    orderedSessions,
    paginatedSessions,
  };
};

export type SessionsFilters = ReturnType<typeof useSessionsFilters>;
