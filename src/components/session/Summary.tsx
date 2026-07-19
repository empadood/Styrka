import { type Overview } from "../../data/workout-session";
import { Section } from "../section/Section";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";

type Props = {
  items: Overview[];
};
export const Summary = ({ items }: Props) => {
  return (
    <Section>
      <div className="card__heading">
        <div>
          <Span text="Working weights" size="small" />
          <Heading text="Current strength" level="2" />
        </div>
      </div>
      <div className="summary__grid">
        {items.map(({ label, unit, value }) => {
          return (
            <div className="summary__item" key={label}>
              <Span text={label} size="small" />
              <strong>{value} {unit}</strong>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
