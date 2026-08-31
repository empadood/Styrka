import { useMemo, useState } from "react";

import { findPersonalRecords } from "../helpers/personal-records.helper";
import type { Program, WorkoutHistoryEntry } from "../types";

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export const PROGRAM_FILTER_ALL = "all";
export const PROGRAM_FILTER_FREESTANDING = "freestanding";

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

type SessionsSortState = { key: SortKey; direction: SortDirection };
type SessionsFilterState = {
  searchText: string;
  programFilter: string;
  dateFrom: string;
  dateTo: string;
};
type SessionsPaginationState = { pageSize: number; currentPage: number };

export const useSessionsFilters = (sessions: WorkoutHistoryEntry[], programs: Program[]) => {
  const [sort, setSort] = useState<SessionsSortState>({ key: "date", direction: "desc" });
  const [filters, setFilters] = useState<SessionsFilterState>({
    searchText: "",
    programFilter: PROGRAM_FILTER_ALL,
    dateFrom: "",
    dateTo: "",
  });
  const [pagination, setPagination] = useState<SessionsPaginationState>({
    pageSize: PAGE_SIZE_OPTIONS[0],
    currentPage: 1,
  });

  const getProgramName = (programId: string | null): string =>
    programs.find((program) => program.id === programId)?.name ?? "Freestanding";

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      key === prev.key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const changePageSize = (size: number) => {
    setPagination({ pageSize: size, currentPage: 1 });
  };

  const changeSearchText = (value: string) => {
    setFilters((prev) => ({ ...prev, searchText: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const changeProgramFilter = (value: string) => {
    setFilters((prev) => ({ ...prev, programFilter: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const changeDateFrom = (value: string) => {
    setFilters((prev) => ({ ...prev, dateFrom: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const changeDateTo = (value: string) => {
    setFilters((prev) => ({ ...prev, dateTo: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      searchText: "",
      programFilter: PROGRAM_FILTER_ALL,
      dateFrom: "",
      dateTo: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const setCurrentPage = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const hasActiveFilters =
    filters.searchText.trim() !== "" ||
    filters.programFilter !== PROGRAM_FILTER_ALL ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  const personalRecords = useMemo(() => findPersonalRecords(sessions), [sessions]);

  const filteredSessions = useMemo(() => {
    const query = filters.searchText.trim().toLowerCase();

    return sessions.filter((session) => {
      const matchesProgram =
        filters.programFilter === PROGRAM_FILTER_ALL ||
        (filters.programFilter === PROGRAM_FILTER_FREESTANDING && session.programId === null) ||
        session.programId === filters.programFilter;

      const sessionDate = formatSessionDate(session.date);
      const matchesDate =
        (!filters.dateFrom || sessionDate >= filters.dateFrom) &&
        (!filters.dateTo || sessionDate <= filters.dateTo);

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
  }, [sessions, filters, programs]);

  const orderedSessions = useMemo(() => {
    const direction = sort.direction === "asc" ? 1 : -1;

    return [...filteredSessions].sort((a, b) => {
      switch (sort.key) {
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
  }, [filteredSessions, sort, programs]);

  const totalPages = Math.max(1, Math.ceil(orderedSessions.length / pagination.pageSize));
  const clampedPage = Math.min(pagination.currentPage, totalPages);
  const pageStart = (clampedPage - 1) * pagination.pageSize;
  const paginatedSessions = orderedSessions.slice(pageStart, pageStart + pagination.pageSize);

  return {
    searchText: filters.searchText,
    setSearchText: changeSearchText,
    programFilter: filters.programFilter,
    setProgramFilter: changeProgramFilter,
    dateFrom: filters.dateFrom,
    setDateFrom: changeDateFrom,
    dateTo: filters.dateTo,
    setDateTo: changeDateTo,
    clearFilters,
    hasActiveFilters,
    sortKey: sort.key,
    sortDirection: sort.direction,
    toggleSort,
    pageSize: pagination.pageSize,
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
