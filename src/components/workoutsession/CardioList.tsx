import type { CardioTimerApi } from "../../hooks/useCardioTimer";
import type { LoggedCardioSession } from "../../types";
import { CardioEntryCard } from "./CardioEntryCard";

type Props = {
  cardio: LoggedCardioSession[];
  cardioTimer: CardioTimerApi;
};

export const CardioList = ({ cardio, cardioTimer }: Props) => (
  <>
    {cardio.length > 0 && (
      <div className="session__divider">
        <span className="session__divider-label">Cardio</span>
      </div>
    )}
    {cardio.map((entry) => (
      <CardioEntryCard
        key={entry.id}
        entry={entry}
        onStart={() => cardioTimer.start(entry.id)}
        onPause={() => cardioTimer.pause(entry.id)}
        onStop={() => cardioTimer.stop(entry.id)}
        onSave={() => cardioTimer.save(entry.id)}
        onKcalChange={(value) => cardioTimer.setKcal(entry.id, value)}
        onRemove={() => cardioTimer.remove(entry.id)}
      />
    ))}
  </>
);
