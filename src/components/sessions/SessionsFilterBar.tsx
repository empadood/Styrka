import { PROGRAM_FILTER_ALL, PROGRAM_FILTER_FREESTANDING } from "../../hooks/useSessionsFilters";
import type { Program } from "../../types";
import { Button } from "../button/Button";
import { Field } from "../field/Field";
import { Row } from "../row/Row";
import { Select } from "../select/Select";
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
    <Select
      ariaLabel="Filter by program"
      size="small"
      value={programFilter}
      onChange={onProgramFilterChange}
    >
      <option value={PROGRAM_FILTER_ALL}>All programs</option>
      <option value={PROGRAM_FILTER_FREESTANDING}>Freestanding</option>
      {programs.map((program) => (
        <option key={program.id} value={program.id}>
          {program.name}
        </option>
      ))}
    </Select>
    <Field as="label" orientation="row" label="From" tone="secondary" className="sessions__filters-date">
      <input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} />
    </Field>
    <Field as="label" orientation="row" label="To" tone="secondary" className="sessions__filters-date">
      <input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} />
    </Field>
    {hasActiveFilters && <Button label="Clear filters" variant="secondary" onClick={onClearFilters} />}
  </Row>
);
