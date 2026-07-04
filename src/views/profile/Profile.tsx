import { Heading, Span } from "../../components";
import "./Profile.css";

const data = {
  ohp: 50,
  squat: 80,
  deadlift: 90,
  benchPress: 66,
};
const UNIT = "kg";

export const Profile = () => {
  return (
    <>
      <Heading text="Current Estimated One Rep Max" />
      <div className="profile__configure">
        <div className="profile__configure--gap">
          <Span text="Overhead Press" />
          <Span text={data.ohp + UNIT} />
        </div>

        <div className="profile__configure--gap">
          <Span text="Squat" />
          <Span text={data.squat + UNIT} />
        </div>

        <div className="profile__configure--gap">
          <Span text="Deadlift" />
          <Span text={data.deadlift + UNIT} />
        </div>

        <div className="profile__configure--gap">
          <Span text="Bench press" />
          <Span text={data.benchPress + UNIT} />
        </div>
      </div>
    </>
  );
};
