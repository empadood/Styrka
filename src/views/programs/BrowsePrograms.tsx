import "./Programs.scss";

import { useNavigate } from "react-router-dom";

import { Badge, Button, Card, Heading, PageContainer, Row, Span, Stack } from "../../components";
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
    <PageContainer className="programs">
      <Row justify="start" gap="md">
        <Button label="Back" variant="secondary" onClick={() => navigate("/")} />
        <Heading text="Programs" level="1" />
      </Row>

      <Card>
        <Row justify="between" align="start" mb="md">
          <Heading text="Your programs" level="2" />
          <Button label="New program" onClick={() => navigate("/programs/new")} />
        </Row>
        <Stack gap="sm" as="ul" className="programs__list">
          {sortPrograms(store.programs).map((program) => (
            <Card padding="sm" as="li" className="programs__item" key={program.id}>
              <div className="programs__item-info">
                <div className="programs__item-title">
                  <Span text={program.name} />
                  {program.isBuiltIn && <Badge size="sm">Built-in</Badge>}
                  {program.id === store.activeProgramId && (
                    <Badge tone="primary" size="sm">Active</Badge>
                  )}
                </div>
                <Span
                  text={`${program.sessions.length} ${program.sessions.length === 1 ? "session" : "sessions"}`}
                  size="small"
                  tone="secondary"
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
            </Card>
          ))}
        </Stack>
      </Card>
    </PageContainer>
  );
};
