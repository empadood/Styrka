import type { Program } from "../../types";
import { Button } from "../button/Button";
import { Row } from "../row/Row";
import { TextField } from "../textfield/TextField";

type Props = {
  programs: Program[];
  searchText: string;
  onSearchTextChange: (value: string) => void;
  programFilter: string;
  onProgramFilterChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export const SessionsFilterBar = ({
  programs,
  searchText,
  onSearchTextChange,
  programFilter,
  onProgramFilterChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  hasActiveFilters,
  onClearFilters,
}: Props) => (
  <Row justify="start" gap="md" className="sessions__filters">
    <TextField
      value={searchText}
      onChange={onSearchTextChange}
      placeholder="Search sessions or exercises…"
    />
    <select
      aria-label="Filter by program"
      value={programFilter}
      onChange={(e) => onProgramFilterChange(e.target.value)}
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
      <input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
    </label>
    <label>
      To
      <input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
    </label>
    {hasActiveFilters && <Button label="Clear filters" variant="secondary" onClick={onClearFilters} />}
  </Row>
);
