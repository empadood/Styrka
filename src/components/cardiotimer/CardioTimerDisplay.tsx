import { useEffect, useState } from "react";

import { formatDuration, getElapsedSeconds } from "../../helpers/cardio.helper";
import type { LoggedCardioSession } from "../../types";

type Props = {
  entry: LoggedCardioSession;
};

export const CardioTimerDisplay = ({ entry }: Props) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!entry.isRunning) {
      return;
    }
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [entry.isRunning]);

  return (
    <span className="session__cardio-timer">
      {formatDuration(getElapsedSeconds(entry, now))}
    </span>
  );
};
