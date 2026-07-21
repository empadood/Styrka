import "./Programs.css";

import { useNavigate } from "react-router-dom";

import { Button, Heading, Section, Span } from "../../components";
import type { WorkoutStore } from "../../data/storage";
import type { Program } from "../../types";

type UpdateFn = (updater: (prev: WorkoutStore) => WorkoutStore) => void;

type Props = {
  store: WorkoutStore;
  update: UpdateFn;
};

const sortPrograms = (programs: Program[]): Program[] =>
  [...programs].sort((a, b) => {
    if (a.isBuiltIn !== b.isBuiltIn) {
      return a.isBuiltIn ? -1 : 1;
    }
    return a.createdAt.localeCompare(b.createdAt);
  });

export const BrowsePrograms = ({ store, update }: Props) => {
  const navigate = useNavigate();

  const enroll = (programId: string) => {
    update((prev) => ({
      ...prev,
      activeProgramId: programId,
      lastCompletedSessionId: null,
    }));
  };

  return (
    <main className="programs">
      <div className="programs__header">
        <Button label="Back" variant="secondary" onClick={() => navigate("/")} />
        <Heading text="Programs" level="1" />
      </div>

      <Section>
        <div className="card__heading">
          <Heading text="Your programs" level="2" />
          <Button label="New program" onClick={() => navigate("/programs/new")} />
        </div>
        <div className="programs__list">
          {sortPrograms(store.programs).map((program) => (
            <div className="programs__item" key={program.id}>
              <div className="programs__item-info">
                <div className="programs__item-title">
                  <Span text={program.name} />
                  {program.isBuiltIn && <span className="programs__badge">Built-in</span>}
                  {program.id === store.activeProgramId && (
                    <span className="programs__badge programs__badge--active">Active</span>
                  )}
                </div>
                <Span
                  text={`${program.sessions.length} ${program.sessions.length === 1 ? "session" : "sessions"}`}
                  size="small"
                />
              </div>
              <div className="programs__item-actions">
                {program.id !== store.activeProgramId && (
                  <Button
                    label="Enroll"
                    variant="secondary"
                    onClick={() => enroll(program.id)}
                  />
                )}
                {!program.isBuiltIn && (
                  <Button
                    label="Edit"
                    variant="secondary"
                    onClick={() => navigate(`/programs/${program.id}/edit`)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
};
