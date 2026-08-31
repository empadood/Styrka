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
import { TrendExplanation } from "../../components/hometrends/TrendExplanation";
import { PreviousSession } from "../../components/session/PreviousSession";
import { Summary } from "../../components/session/Summary";
import { UpcomingSession } from "../../components/session/UpcomingSession";
import { DEFAULT_STORE, type WorkoutStore } from "../../data/storage";
import { wasTrainedRecently } from "../../helpers/progression.helper";
import { STATUS_LABELS, STATUS_TONES } from "../../helpers/training-status-display.helper";
import type { ActiveWorkoutState } from "../../hooks/useActiveWorkout";
import type { DriveSyncState } from "../../hooks/useDriveSync";
import { useHomeDashboard } from "../../hooks/useHomeDashboard";
import { useWeightUnit } from "../../hooks/useWeightUnit";
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

export const Home = ({ store, update, workout, drive }: Props) => {
  const navigate = useNavigate();
  const { unit } = useWeightUnit();
  const [showProfile, setShowProfile] = useState(false);
  const [showBodyWeight, setShowBodyWeight] = useState(false);
  const [showTrendExplanation, setShowTrendExplanation] = useState(false);
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
          nextSubSession={workout.nextSubSession}
          subProgramName={workout.activeSubProgram?.name}
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
            <Badge
              tone={STATUS_TONES[dashboard.trainingStatus]}
              onClick={() => setShowTrendExplanation(true)}
              ariaLabel="How is this calculated?"
            >
              {STATUS_LABELS[dashboard.trainingStatus]}
            </Badge>
          </Row>
          <ChartComponent data={dashboard.trendData} unit={unit} />
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
            unit={unit}
            color="var(--warning)"
            domain={dashboard.bodyWeightChartDomain}
            secondary={
              dashboard.bodyWeightTrendData.some((entry) => entry.bodyFatPercent !== undefined)
                ? {
                    dataKey: "bodyFatPercent",
                    label: "Body fat",
                    unit: "%",
                    color: "var(--primary)",
                  }
                : undefined
            }
          />
        </Card>
      </div>
      <Dialog title="Profile" isOpen={showProfile} onClose={() => setShowProfile(false)}>
        <Profile
          store={store}
          update={update}
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

      <Dialog
        title="How your trend is calculated"
        isOpen={showTrendExplanation}
        onClose={() => setShowTrendExplanation(false)}
      >
        <TrendExplanation details={dashboard.trainingStatusDetails} />
      </Dialog>
    </PageContainer>
  );
};
