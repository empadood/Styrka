import { type Overview } from "../../data/workout-session";
import { Card } from "../card/Card";
import { Row } from "../row/Row";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  items: Overview[];
};
export const Summary = ({ items }: Props) => {
  return (
    <Card>
      <Row justify="between" align="start" mb="md">
        <div>
          <Span text="Working weights" size="small" tone="secondary" />
          <Heading text="Current strength" level="2" />
        </div>
      </Row>
      <div className="summary__grid">
        {items.map(({ label, unit, value }) => {
          return (
            <Card padding="sm" key={label}>
              <Span text={label} size="small" tone="secondary" />
              <strong>{value} {unit}</strong>
            </Card>
          );
        })}
      </div>
    </Card>
  );
};
