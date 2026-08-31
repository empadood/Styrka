import "./Summary.scss";

import { type Overview } from "../../data/workout-session";
import { Card } from "../card/Card";
import { CardHeader } from "../cardheader/CardHeader";
import { Span } from "../text/Span";

type Props = {
  items: Overview[];
};
export const Summary = ({ items }: Props) => {
  return (
    <Card>
      <CardHeader eyebrow="Working weights" title="Current strength" />
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
