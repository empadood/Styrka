import type { Overview } from "../../data/workout-session";
import { Section } from "../section/Section";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";
type Props = {
  session: Overview[];
};
export const PreviousSession = ({ session }: Props) => {
  return (
    <Section>
      <div className="home__overview__title">
        <Heading text={"Previous Session"} />
      </div>
      <div className="home__overview">
        {session.map(({ label, unit, lastSession }) => {
          return (
            lastSession?.exercises && (
              <>
                <div
                  className="home__overview__exercise"
                  key={label + ":" + lastSession.increase}
                >
                  <Span text={label} />
                  {lastSession.exercises?.sets.map((set, index) => {
                    return (
                      <>
                        <div key={"prevous-session" + index}>
                          {set.reps} x {set.weight} {unit}
                        </div>
                      </>
                    );
                  })}
                </div>
              </>
            )
          );
        })}
      </div>
    </Section>
  );
};
