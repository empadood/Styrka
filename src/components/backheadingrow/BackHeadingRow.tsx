import { Button } from "../button/Button";
import { Row } from "../row/Row";
import { Heading } from "../text/Heading";

type Props = {
  title: string;
  onBack: () => void;
  className?: string;
};

export const BackHeadingRow = ({ title, onBack, className = "" }: Props) => (
  <Row justify="start" gap="md" className={className}>
    <Button label="Back" variant="secondary" onClick={onBack} />
    <Heading text={title} level="1" />
  </Row>
);
