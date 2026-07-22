import "./Home.scss";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Badge,
  Card,
  ChartComponent,
  Heading,
  PageContainer,
  Row,
  Span,
  Toolbar,
  WeeklyView,
} from "../../components";
import { SingleLineChart } from "../../components/chart/SingleLineChart";
import { Dialog } from "../../components/dialog/Dialog";
import { PreviousSession } from "../../components/session/PreviousSession";
import { Summary } from "../../components/session/Summary";
import { UpcomingSession } from "../../components/session/UpcomingSession";
import { DEFAULT_STORE, type WorkoutStore } from "../../data/storage";
import { wasTrainedRecently } from "../../helpers/progression.helper";
import { type TrainingStatus } from "../../helpers/status.helper";
import type { ActiveWorkoutState } from "../../hooks/useActiveWorkout";
import type { DriveSyncState } from "../../hooks/useDriveSync";
import { useHomeDashboard } from "../../hooks/useHomeDashboard";
import { BodyWeight } from "../bodyweight/BodyWeight";
import { Profile } from "../profile/Profile";
import { SetupOneRepMax } from "../setuponepmax/SetupOneRepMax";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

type Props = {
  store: WorkoutStore;
  update: UpdateFn;
  workout: ActiveWorkoutState;
  drive: DriveSyncState;
};

const STATUS_LABELS: Record<TrainingStatus | "insufficient-data", string> = {
  comeback: "Comeback",
  gaining: "Gaining",
  maintaining: "Maintaining",
  declining: "Declining",
  "insufficient-data": "Not enough data yet",
};

const STATUS_TONES: Record<
  TrainingStatus | "insufficient-data",
  "neutral" | "primary" | "success" | "danger"
> = {
  comeback: "primary",
  gaining: "success",
  maintaining: "neutral",
  declining: "danger",
  "insufficient-data": "neutral",
};

export const Home = ({ store, update, workout, drive }: Props) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showBodyWeight, setShowBodyWeight] = useState(false);
  const dashboard = useHomeDashboard(store, update, workout);

  if (!store.hasConfiguredOneRepMax) {
    return (
      <PageContainer>
        <SetupOneRepMax onComplete={dashboard.handleCompleteOneRepMaxSetup} />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="home">
      <Toolbar
        title="Good morning"
        onShowProfile={() => setShowProfile(true)}
        onShowBodyWeight={() => setShowBodyWeight(true)}
        onResumeWorkout={dashboard.resumeWorkout}
        onBrowsePrograms={() => navigate("/programs")}
        hasActiveWorkout={workout.workoutActive}
      />
      <div className="home__dashboard">
        <WeeklyView history={store.history} />
        <UpcomingSession
          session={dashboard.items}
          nextSession={workout.nextSession}
          onStartWorkout={workout.workoutActive ? dashboard.resumeWorkout : dashboard.startWorkout}
          onStartFreestanding={dashboard.startFreestandingWorkout}
          isWorkoutActive={workout.workoutActive}
          isUpcoming={wasTrainedRecently(store.history)}
        />
        <Summary items={dashboard.items} />
        <PreviousSession session={dashboard.items} onViewAllSessions={() => navigate("/sessions")} />
        <Card className="home__trends">
          <Row justify="between" align="start" mb="md">
            <div>
              <Heading text="Progress" level="2" />
              <Span text="Working weight by completed workout" size="small" tone="secondary" />
            </div>
            <Badge tone={STATUS_TONES[dashboard.trainingStatus]}>
              {STATUS_LABELS[dashboard.trainingStatus]}
            </Badge>
          </Row>
          <ChartComponent data={dashboard.trendData} />
        </Card>
        <Card className="home__trends">
          <Row justify="between" align="start" mb="md">
            <div>
              <Heading text="Body weight" level="2" />
              <Span text="Logged body weight over time" size="small" tone="secondary" />
            </div>
          </Row>
          <SingleLineChart
            data={dashboard.bodyWeightTrendData}
            dataKey="weight"
            label="Weight"
            unit="kg"
            color="var(--warning)"
          />
        </Card>
      </div>
      <Dialog title="Profile" isOpen={showProfile} onClose={() => setShowProfile(false)}>
        <Profile
          increments={store.increments}
          estimatedOneRepMax={store.estimatedOneRepMax}
          workingWeights={store.workingWeights}
          onOverrideWeight={dashboard.handleOverrideWorkingWeight}
          onClearHistory={() => update(() => DEFAULT_STORE)}
          drive={drive}
        />
      </Dialog>

      <Dialog title="Body weight" isOpen={showBodyWeight} onClose={() => setShowBodyWeight(false)}>
        <BodyWeight log={store.bodyWeightLog} onLog={dashboard.handleLogBodyWeight} />
      </Dialog>
    </PageContainer>
  );
};
