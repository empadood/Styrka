import { Button } from "../button/Button";
import { Row } from "../row/Row";

type SegmentedControlOption<T extends string | number> = { value: T; label: string };

type Props<T extends string | number> = {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
};

export const SegmentedControl = <T extends string | number>({
  options,
  value,
  onChange,
  className = "",
}: Props<T>) => (
  <Row gap="sm" className={className}>
    {options.map((option) => (
      <Button
        key={option.value}
        label={option.label}
        variant={option.value === value ? "primary" : "secondary"}
        onClick={() => onChange(option.value)}
      />
    ))}
  </Row>
);
