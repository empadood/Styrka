import "./Sessions.scss";

import { useNavigate } from "react-router-dom";

import { Button, Card, Heading, PageContainer, Row, Span } from "../../components";
import { SessionsFilterBar } from "../../components/sessions/SessionsFilterBar";
import { SessionsPagination } from "../../components/sessions/SessionsPagination";
import { SessionsTable } from "../../components/sessions/SessionsTable";
import { useSessionsFilters } from "../../hooks/useSessionsFilters";
import type { Program, WorkoutHistoryEntry } from "../../types";

type Props = {
  sessions: WorkoutHistoryEntry[];
  programs: Program[];
};

export const Sessions = ({ sessions, programs }: Props) => {
  const navigate = useNavigate();
  const filters = useSessionsFilters(sessions, programs);

  return (
    <PageContainer className="sessions">
      <Row justify="start" gap="md">
        <Button label="Back" variant="secondary" onClick={() => navigate("/")} />
        <Heading text="Sessions" level="1" />
      </Row>

      <Card padding="sm">
        <SessionsFilterBar
          programs={programs}
          searchText={filters.searchText}
          onSearchTextChange={filters.setSearchText}
          programFilter={filters.programFilter}
          onProgramFilterChange={filters.setProgramFilter}
          dateFrom={filters.dateFrom}
          onDateFromChange={filters.setDateFrom}
          dateTo={filters.dateTo}
          onDateToChange={filters.setDateTo}
          hasActiveFilters={filters.hasActiveFilters}
          onClearFilters={filters.clearFilters}
        />
      </Card>

      <Card padding="sm">
        {filters.orderedSessions.length === 0 ? (
          <Span
            text={
              sessions.length === 0
                ? "No completed workouts yet."
                : "No sessions match your filters."
            }
            size="small"
          />
        ) : (
          <SessionsTable
            sessions={filters.paginatedSessions}
            getProgramName={filters.getProgramName}
            personalRecords={filters.personalRecords}
            sortKey={filters.sortKey}
            sortDirection={filters.sortDirection}
            onToggleSort={filters.toggleSort}
          />
        )}
        {filters.orderedSessions.length > 0 && (
          <SessionsPagination
            pageSize={filters.pageSize}
            onPageSizeChange={filters.setPageSize}
            currentPage={filters.currentPage}
            totalPages={filters.totalPages}
            onPageChange={filters.setCurrentPage}
            pageStart={filters.pageStart}
            totalItems={filters.orderedSessions.length}
          />
        )}
      </Card>
    </PageContainer>
  );
};
