import { HashRouter, Route, Routes } from "react-router-dom";

import { useActiveWorkout } from "./hooks/useActiveWorkout";
import { useWorkoutStore } from "./hooks/useWorkoutStore";
import { ActiveWorkoutOverlay } from "./views/activeworkout/ActiveWorkoutOverlay";
import { Home } from "./views/home/Home";
import { BrowsePrograms } from "./views/programs/BrowsePrograms";
import { ProgramBuilder } from "./views/programs/ProgramBuilder";
import { Sessions } from "./views/sessions/Sessions";

export const App = () => {
  const { store, update } = useWorkoutStore();
  const workout = useActiveWorkout(store, update);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={<Home store={store} update={update} workout={workout} />}
        />
        <Route
          path="/programs"
          element={<BrowsePrograms store={store} update={update} />}
        />
        <Route
          path="/programs/new"
          element={<ProgramBuilder store={store} update={update} />}
        />
        <Route
          path="/programs/:programId/edit"
          element={<ProgramBuilder store={store} update={update} />}
        />
        <Route
          path="/sessions"
          element={<Sessions sessions={store.history} programs={store.programs} />}
        />
      </Routes>
      <ActiveWorkoutOverlay store={store} workout={workout} />
    </HashRouter>
  );
};
