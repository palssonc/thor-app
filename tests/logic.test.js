import test from "node:test";
import assert from "node:assert/strict";

import {
  canCompleteWorkout,
  completeWorkout,
  createInitialState,
  createSession,
  exportRows,
  getLastAccessoryWeight,
  missingBaselinesForWorkout,
  rowsToCsv,
  seedBaselines,
  selectTopSet,
  toggleSet,
  updateAccessoryWeight
} from "../logic.js";

test("first workout can be created after baselines are seeded", () => {
  let state = createInitialState();
  state = seedBaselines(state, {
    "Bench Press": 200,
    Squat: 275,
    Press: 135,
    Deadlift: 315
  });

  const session = createSession(state, "A");

  assert.equal(session.workoutId, "A");
  assert.deepEqual(session.blocks[0].topSetOptions, [200, 202.5, 205]);
  assert.equal(session.blocks[1].selectedTopSet, 115);
});

test("missing baseline detection only returns lifts needed for a workout", () => {
  let state = createInitialState();
  state = seedBaselines(state, {
    "Bench Press": 200,
    Squat: 275,
    Press: 135
  });

  assert.deepEqual(missingBaselinesForWorkout(state, "B"), ["Deadlift"]);
});

test("top set selection fills percentage weights and workout completion advances cycle", () => {
  let state = createInitialState();
  state = seedBaselines(state, {
    "Bench Press": 200,
    Squat: 275,
    Press: 135,
    Deadlift: 315
  });

  let session = createSession(state, "A");
  assert.equal(canCompleteWorkout(session), false);
  session = selectTopSet(state, session, 0, 205);
  session = updateAccessoryWeight(state, session, 2, 30);
  assert.equal(session.blocks[0].sets[4].weight, 205);
  assert.equal(session.blocks[0].sets[5].weight, 175);

  session.blocks.forEach((block, blockIndex) => {
    block.sets.forEach((_, setIndex) => {
      session = toggleSet(session, blockIndex, setIndex);
    });
  });

  assert.equal(canCompleteWorkout(session), true);

  state.programState.inProgressSession = session;
  state = completeWorkout(state, session, "");

  assert.equal(state.programState.nextWorkout, "B");
  assert.equal(state.liftHistory["Bench Press"].at(-1).weight, 205);
});

test("export creates spreadsheet-friendly csv", () => {
  let state = createInitialState();
  state = seedBaselines(state, {
    "Bench Press": 200,
    Squat: 275,
    Press: 135,
    Deadlift: 315
  });

  let session = createSession(state, "A");
  session = selectTopSet(state, session, 0, 202.5);
  session = updateAccessoryWeight(state, session, 2, 30);
  session.blocks.forEach((block, blockIndex) => {
    block.sets.forEach((_, setIndex) => {
      session = toggleSet(session, blockIndex, setIndex);
    });
  });
  state = completeWorkout(state, session, "Solid day");

  const rows = exportRows(state);
  const csv = rowsToCsv(rows);

  assert.ok(rows.length > 0);
  assert.match(csv, /Solid day/);
  assert.match(csv, /Bench Press/);
});

test("accessory weights can be tracked, reused, and exported", () => {
  let state = createInitialState();
  state = seedBaselines(state, {
    "Bench Press": 200,
    Squat: 275,
    Press: 135,
    Deadlift: 315
  });

  let session = createSession(state, "A");
  session = selectTopSet(state, session, 0, 202.5);
  session = updateAccessoryWeight(state, session, 2, 30);

  assert.equal(session.blocks[2].sets[0].weight, 30);
  assert.equal(session.blocks[2].sets[1].weight, 25);

  session.blocks.forEach((block, blockIndex) => {
    block.sets.forEach((_, setIndex) => {
      session = toggleSet(session, blockIndex, setIndex);
    });
  });

  state = completeWorkout(state, session, "");

  assert.equal(getLastAccessoryWeight(state, "LTEs").weight, 30);

  const rows = exportRows(state);
  const accessoryRow = rows.find((row) => row.exercise === "LTEs" && row.prescribedWeight === 30);
  assert.ok(accessoryRow);
});
