import "./Home.css";

import { useState } from "react";

import { ChartComponent, Heading, Section, Toolbar } from "../../components";
import { Dialog } from "../../components/dialog/Dialog";
import { PreviousSession } from "../../components/session/PreviousSession";
import { Summary } from "../../components/session/Summary";
import { UpcomingSession } from "../../components/session/UpcomingSession";
import { workoutData } from "../../data";
import { items } from "../../data/workout-session";
import { Profile } from "../profile/Profile";

export const Home = () => {
  const [showProfile, setShowProfile] = useState(false);

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
      <Summary items={items} />
      <PreviousSession session={items} />
      <UpcomingSession session={items} />

      <Section>
        <div className="home__overview__title">
          <Heading text={"Trends"} />
        </div>
        <ChartComponent data={workoutData} />
      </Section>
    </div>
  );
};
