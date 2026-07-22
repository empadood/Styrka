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
  Stack,
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
import { type TrainingStatus, type TrainingStatusDetails } from "../../helpers/status.helper";
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

const formatWeight = (value: number): string => `${value.toFixed(1)} kg`;
const formatPercent = (value: number): string =>
  `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

const TrendExplanation = ({ details }: { details: TrainingStatusDetails }) => {
  if (details.status === "insufficient-data") {
    return (
      <Span
        text={`Not enough completed workouts in the last ${details.windowDays} days — at least 2 are needed to calculate a trend.`}
        tone="secondary"
      />
    );
  }

  const {
    windowDays,
    sessionCount,
    earlyWeightAvg,
    lateWeightAvg,
    weightChangePercent,
    rpeTrend,
    earlyRpeAvg,
    lateRpeAvg,
    dipDetected,
    status,
  } = details;

  const summary: Record<TrainingStatus, string> = {
    gaining: "Your average working weight increased across your recent workouts.",
    declining:
      details.weightTrend === "down"
        ? "Your average working weight dropped across your recent workouts."
        : "Your working weight held steady, but your effort (RPE) has been climbing — a sign of declining recovery.",
    maintaining: "Your average working weight has stayed roughly the same.",
    comeback:
      "Your working weight dipped and has since recovered back above where it started.",
  };

  return (
    <Stack gap="md">
      <Span text={summary[status as TrainingStatus]} />
      <Stack gap="xs">
        <Span
          text={`Based on ${sessionCount} workouts in the last ${windowDays} days, compared across the earlier and later half of that window.`}
          size="small"
          tone="secondary"
        />
        {earlyWeightAvg !== null && lateWeightAvg !== null && weightChangePercent !== null && (
          <Span
            text={`Average working weight: ${formatWeight(earlyWeightAvg)} → ${formatWeight(lateWeightAvg)} (${formatPercent(weightChangePercent)}). Changes beyond ±1.5% count as a trend.`}
            size="small"
            tone="secondary"
          />
        )}
        {rpeTrend && rpeTrend !== "unknown" && earlyRpeAvg !== null && lateRpeAvg !== null && (
          <Span
            text={`Average RPE: ${earlyRpeAvg.toFixed(1)} → ${lateRpeAvg.toFixed(1)}. Changes beyond ±0.5 count as a trend.`}
            size="small"
            tone="secondary"
          />
        )}
        {status === "comeback" && dipDetected && (
          <Span
            text="A dip below your starting weight was detected before the recovery, which is why this is labeled a comeback rather than a plain gain."
            size="small"
            tone="secondary"
          />
        )}
      </Stack>
    </Stack>
  );
};

export const Home = ({ store, update, workout, drive }: Props) => {
  const navigate = useNavigate();
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
