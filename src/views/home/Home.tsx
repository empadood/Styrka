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
} from "../../components";
import { SingleLineChart } from "../../components/chart/SingleLineChart";
import { Dialog } from "../../components/dialog/Dialog";
import { PreviousSession } from "../../components/session/PreviousSession";
import { Summary } from "../../components/session/Summary";
import { UpcomingSession } from "../../components/session/UpcomingSession";
import type { WorkoutStore } from "../../data/storage";
import { trackAnalyticsEvent } from "../../helpers/analytics.helper";
import {
  buildBodyWeightTrendData,
  upsertBodyWeightEntry,
} from "../../helpers/bodyweight.helper";
import { buildOverviewFromStore } from "../../helpers/overview.helper";
import { wasTrainedRecently } from "../../helpers/progression.helper";
import { buildStartingWeights } from "../../helpers/starting-weight.helper";
import { computeTrainingStatus, type TrainingStatus } from "../../helpers/status.helper";
import { buildTrendData } from "../../helpers/trends.helper";
import type { ActiveWorkoutState } from "../../hooks/useActiveWorkout";
import type { TrackedLiftId } from "../../types";
import { BodyWeight } from "../bodyweight/BodyWeight";
import { Profile } from "../profile/Profile";
import { SessionHistory } from "../sessionhistory/SessionHistory";
import { SetupOneRepMax } from "../setuponepmax/SetupOneRepMax";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

type Props = {
  store: WorkoutStore;
  update: UpdateFn;
  workout: ActiveWorkoutState;
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

export const Home = ({ store, update, workout }: Props) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showBodyWeight, setShowBodyWeight] = useState(false);
  const [showSessionHistory, setShowSessionHistory] = useState(false);

  const items = buildOverviewFromStore(store);
  const trendData = buildTrendData(store.history);
  const bodyWeightTrendData = buildBodyWeightTrendData(store.bodyWeightLog);
  const trainingStatus = computeTrainingStatus(store.history);

  const handleLogBodyWeight = (weight: number) => {
    update((previousStore) => ({
      ...previousStore,
      bodyWeightLog: upsertBodyWeightEntry(
        previousStore.bodyWeightLog,
        new Date().toISOString(),
        weight,
      ),
    }));
  };

  const handleOverrideWorkingWeight = (
    exercise: TrackedLiftId,
    weight: number,
  ) => {
    update((previousStore) => ({
      ...previousStore,
      workingWeights: { ...previousStore.workingWeights, [exercise]: weight },
    }));
  };

  const handleCompleteOneRepMaxSetup = (
    estimatedOneRepMax: Record<TrackedLiftId, number>,
  ) => {
    update((previousStore) => ({
      ...previousStore,
      estimatedOneRepMax,
      hasConfiguredOneRepMax: true,
      workingWeights: buildStartingWeights(estimatedOneRepMax),
    }));
    trackAnalyticsEvent("Onboarding completed");
  };

  const startWorkout = () => {
    workout.startWorkout("program");
    trackAnalyticsEvent("Workout started");
  };

  const startFreestandingWorkout = () => {
    workout.startWorkout("freestanding");
    trackAnalyticsEvent("Freestanding workout started");
  };

  const resumeWorkout = () => {
    trackAnalyticsEvent("Workout resumed");
    workout.resumeWorkout();
  };

  if (!store.hasConfiguredOneRepMax) {
    return (
      <PageContainer>
        <SetupOneRepMax onComplete={handleCompleteOneRepMaxSetup} />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="home">
      <Toolbar
        title="Good morning"
        onShowProfile={() => setShowProfile(true)}
        onShowBodyWeight={() => setShowBodyWeight(true)}
        onResumeWorkout={resumeWorkout}
        onBrowsePrograms={() => navigate("/programs")}
        hasActiveWorkout={workout.workoutActive}
      />
      <div className="home__dashboard">
        <UpcomingSession
          session={items}
          nextSession={workout.nextSession}
          onStartWorkout={workout.workoutActive ? resumeWorkout : startWorkout}
          onStartFreestanding={startFreestandingWorkout}
          isWorkoutActive={workout.workoutActive}
          isUpcoming={wasTrainedRecently(store.history)}
        />
        <Summary items={items} />
        <PreviousSession
          session={items}
          onViewAllSessions={() => setShowSessionHistory(true)}
        />
        <Card className="home__trends">
          <Row justify="between" align="start" mb="md">
            <div>
              <Heading text="Progress" level="2" />
              <Span text="Working weight by completed workout" size="small" tone="secondary" />
            </div>
            <Badge tone={STATUS_TONES[trainingStatus]}>{STATUS_LABELS[trainingStatus]}</Badge>
          </Row>
          <ChartComponent data={trendData} />
        </Card>
        <Card className="home__trends">
          <Row justify="between" align="start" mb="md">
            <div>
              <Heading text="Body weight" level="2" />
              <Span text="Logged body weight over time" size="small" tone="secondary" />
            </div>
          </Row>
          <SingleLineChart
            data={bodyWeightTrendData}
            dataKey="weight"
            label="Weight"
            unit="kg"
            color="var(--warning)"
          />
        </Card>
      </div>
      <Dialog
        title="Profile"
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      >
        <Profile
          increments={store.increments}
          estimatedOneRepMax={store.estimatedOneRepMax}
          workingWeights={store.workingWeights}
          onOverrideWeight={handleOverrideWorkingWeight}
        />
      </Dialog>

      <Dialog
        title="Body weight"
        isOpen={showBodyWeight}
        onClose={() => setShowBodyWeight(false)}
      >
        <BodyWeight log={store.bodyWeightLog} onLog={handleLogBodyWeight} />
      </Dialog>

      <Dialog
        title="Sessions"
        isOpen={showSessionHistory}
        onClose={() => setShowSessionHistory(false)}
      >
        <SessionHistory sessions={store.history} />
      </Dialog>
    </PageContainer>
  );
};
