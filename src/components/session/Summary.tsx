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
      <div className="home__overview__title">
        <Heading text={"Overview"} />
        <div>
          <Span text="Estimated one rep max" size="small" />
        </div>
      </div>
      <div className="home__overview">
        {items.map(({ label, unit, value }) => {
          return (
            <div className="home__overview__exercise">
              <Span text={label} />
              <div>
                {value} {unit}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
};
