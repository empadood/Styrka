import { type Overview } from "../../data/workout-session";
import { Button } from "../button/Button";
import { Section } from "../section/Section";
import { Heading } from "../text/Heading";
import { Span } from "../text/Span";
type Props = {
  session: Overview[];
  onStartWorkout: () => void;
};
export const UpcomingSession = ({ session, onStartWorkout }: Props) => {
  return (
    <Section>
      <div className="home__overview__title">
        <Heading text={"Upcoming Session"} />
      </div>
      <div className="home__overview">
        {session.map(({ label, unit, lastSession }) => {
          return (
            lastSession?.exercises && (
              <>
                <div className="home__overview__exercise">
                  <Span text={label} />
                  {lastSession.exercises?.sets.map((set, index) => {
                    return (
                      <>
                        <div key={"exercise" + index}>
                          {set.reps} x {set.weight + lastSession.increase}
                          {unit}
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
      <div className="home_next-session_footer ">
        <Button label="Start now" onClick={onStartWorkout} />
      </div>
    </Section>
  );
};
