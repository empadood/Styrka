import { ChevronLeft, ChevronRight } from "lucide-react";

import { PAGE_SIZE_OPTIONS } from "../../hooks/useSessionsFilters";
import { Button } from "../button/Button";
import { Field } from "../field/Field";
import { Row } from "../row/Row";
import { Select } from "../select/Select";
import { Span } from "../text/Span";

type Props = {
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageStart: number;
  totalItems: number;
};

export const SessionsPagination = ({
  pageSize,
  onPageSizeChange,
  currentPage,
  totalPages,
  onPageChange,
  pageStart,
  totalItems,
}: Props) => (
  <Row justify="between" className="sessions__footer">
    <div className="sessions__page-size">
      <Field as="label" htmlFor="sessions-page-size" wrap={false} label="Rows per page" tone="secondary" />
      <Select
        id="sessions-page-size"
        size="small"
        value={String(pageSize)}
        onChange={(value) => onPageSizeChange(Number(value))}
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </Select>
    </div>
    <Span
      text={`${pageStart + 1}–${Math.min(pageStart + pageSize, totalItems)} of ${totalItems}`}
      size="small"
      tone="secondary"
    />
    <div className="sessions__pagination">
      <Button
        icon={ChevronLeft}
        variant="secondary"
        size="icon"
        ariaLabel="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      />
      <Span text={`Page ${currentPage} of ${totalPages}`} size="small" />
      <Button
        icon={ChevronRight}
        variant="secondary"
        size="icon"
        ariaLabel="Next page"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      />
    </div>
  </Row>
);
