import { useState } from "react";
import {
  Button,
  ChartComponent,
  Heading,
  Section,
  Span,
  Toolbar,
} from "../../components";
import { workoutData } from "../../data";
import "./Home.css";
import { Dialog } from "../../components/dialog/Dialog";
import { Profile } from "../profile/Profile";

interface WorkingSet {
  reps: number;
  weight: number;
}
interface Session {
  exercises: {
    name: string;
    sets: WorkingSet[];
  };
  increase: number;
}

interface Overview {
  label: string;
  value: number;
  unit: "kg";
  lastSession?: Session;
}

export const Home = () => {
  const [showProfile, setShowProfile] = useState(false);
  const items: Overview[] = [
    {
      label: "Press",
      unit: "kg",
      value: 56,
      lastSession: {
        increase: 2.5,
        exercises: {
          name: "Press",
          sets: [
            {
              reps: 5,
              weight: 65,
            },
            {
              reps: 5,
              weight: 65,
            },
            {
              reps: 5,
              weight: 65,
            },
          ],
        },
      },
    },
    {
      label: "Squat",
      unit: "kg",
      value: 85,
      lastSession: {
        increase: 5,
        exercises: {
          name: "Press",
          sets: [
            {
              reps: 5,
              weight: 85,
            },
            {
              reps: 5,
              weight: 85,
            },
            {
              reps: 5,
              weight: 85,
            },
          ],
        },
      },
    },

    {
      label: "Bench Press",
      unit: "kg",
      value: 68,
      lastSession: {
        increase: 2.5,
        exercises: {
          name: "Press",
          sets: [
            {
              reps: 5,
              weight: 65,
            },
            {
              reps: 5,
              weight: 65,
            },
            {
              reps: 5,
              weight: 65,
            },
          ],
        },
      },
    },

    {
      label: "Deadlift",
      unit: "kg",
      value: 115,
      lastSession: {
        increase: 5,
        exercises: {
          name: "Press",
          sets: [
            {
              reps: 5,
              weight: 115,
            },
            {
              reps: 5,
              weight: 115,
            },
            {
              reps: 5,
              weight: 115,
            },
          ],
        },
      },
    },
  ];

  return (
    <div className="home">
      <Toolbar title="Hey" onShowProfile={() => setShowProfile(true)} />
      <Dialog
        title="Profile"
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      >
        <Profile />
      </Dialog>
      <Section>
        <div className="home__overview__title">
          <Heading text={"Overview"} />
          <div>
            <Span text="Estimated one rep max" />
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

      <Section>
        <div className="home__overview__title">
          <Heading text={"Previous Session"} />
        </div>
        <div className="home__overview">
          {items.map(({ label, unit, lastSession }) => {
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

      <Section>
        <div className="home__overview__title">
          <Heading text={"Upcoming Session"} />
        </div>
        <div className="home__overview">
          {items.map(({ label, unit, lastSession }) => {
            return (
              lastSession?.exercises && (
                <>
                  <div className="home__overview__exercise">
                    <Span text={label} />
                    {lastSession.exercises?.sets.map((set, index) => {
                      return (
                        <>
                          <div key={"exercise" + index}>
                            {set.reps} x {set.weight + lastSession.increase}{" "}
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
          <Button label="Start now" onClick={() => undefined} />
        </div>
      </Section>

      <Section>
        <div className="home__overview__title">
          <Heading text={"Trends"} />
        </div>
        <ChartComponent data={workoutData} />
      </Section>
    </div>
  );
};
