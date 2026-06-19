export const STORAGE_KEY = "workout-tracker-state-v1";
export const VIEWS = ["home", "workout", "history", "export", "settings"];
export const LIFTS = ["Bench Press", "Squat", "Press", "Deadlift"];

const MAIN_REP_RANGE = "3-5";
const BACKOFF_REP_RANGE = "5-8+";
const ACCESSORY_REP_RANGE = "8-10";
const ACCESSORY_PLUS_RANGE = "8-10+";

export const WORKOUT_TEMPLATES = {
  A: {
    id: "A",
    title: "Workout A",
    blocks: [
      {
        name: "Bench Press",
        type: "main",
        liftKey: "Bench Press",
        sets: [
          { kind: "bar", reps: "10" },
          { kind: "percent", percent: 45, reps: "5" },
          { kind: "percent", percent: 65, reps: "3" },
          { kind: "percent", percent: 85, reps: "2" },
          { kind: "percent", percent: 100, reps: MAIN_REP_RANGE, isTopSet: true },
          { kind: "percent", percent: 85, reps: BACKOFF_REP_RANGE }
        ]
      },
      {
        name: "Light Press",
        type: "light",
        liftKey: "Press",
        referenceMainLift: "Press",
        sets: [
          { kind: "bar", reps: "10" },
          { kind: "percent", percent: 45, reps: "5" },
          { kind: "percent", percent: 65, reps: "3" },
          { kind: "percent", percent: 85, reps: "2" },
          { kind: "percent", percent: 100, reps: "5-8" },
          { kind: "percent", percent: 85, reps: BACKOFF_REP_RANGE }
        ]
      },
      {
        name: "LTEs",
        type: "accessory",
        variant: "default",
        sets: [
          { kind: "fixed", reps: ACCESSORY_REP_RANGE },
          { kind: "percentOfPrevious", percent: 85, reps: ACCESSORY_PLUS_RANGE }
        ]
      }
    ]
  },
  B: {
    id: "B",
    title: "Workout B",
    blocks: [
      {
        name: "Squat",
        type: "main",
        liftKey: "Squat",
        sets: [
          { kind: "bar", reps: "10" },
          { kind: "percent", percent: 45, reps: "5" },
          { kind: "percent", percent: 65, reps: "3" },
          { kind: "percent", percent: 85, reps: "2" },
          { kind: "percent", percent: 100, reps: MAIN_REP_RANGE, isTopSet: true },
          { kind: "percent", percent: 85, reps: BACKOFF_REP_RANGE }
        ]
      },
      {
        name: "Light Deadlift",
        type: "light",
        liftKey: "Deadlift",
        referenceMainLift: "Deadlift",
        sets: [
          { kind: "percent", percent: 45, reps: "5" },
          { kind: "percent", percent: 65, reps: "3" },
          { kind: "percent", percent: 85, reps: "2" },
          { kind: "percent", percent: 100, reps: "5 x 3" }
        ]
      },
      {
        name: "Vertical Pull",
        type: "accessoryChoice",
        choices: {
          "Chin-ups": [
            { kind: "fixed", reps: ACCESSORY_REP_RANGE },
            { kind: "bodyweight", reps: "AMRAP" }
          ],
          "Lat Pulldowns": [
            { kind: "fixed", reps: ACCESSORY_REP_RANGE },
            { kind: "percentOfPrevious", percent: 85, reps: ACCESSORY_PLUS_RANGE }
          ]
        }
      }
    ]
  },
  C: {
    id: "C",
    title: "Workout C",
    blocks: [
      {
        name: "Press",
        type: "main",
        liftKey: "Press",
        sets: [
          { kind: "bar", reps: "10" },
          { kind: "percent", percent: 45, reps: "5" },
          { kind: "percent", percent: 65, reps: "3" },
          { kind: "percent", percent: 85, reps: "2" },
          { kind: "percent", percent: 100, reps: MAIN_REP_RANGE, isTopSet: true },
          { kind: "percent", percent: 85, reps: BACKOFF_REP_RANGE }
        ]
      },
      {
        name: "Light Bench",
        type: "light",
        liftKey: "Bench Press",
        referenceMainLift: "Bench Press",
        sets: [
          { kind: "bar", reps: "10" },
          { kind: "percent", percent: 45, reps: "5" },
          { kind: "percent", percent: 65, reps: "3" },
          { kind: "percent", percent: 85, reps: "2" },
          { kind: "percent", percent: 100, reps: "5-8" },
          { kind: "percent", percent: 85, reps: BACKOFF_REP_RANGE }
        ]
      },
      {
        name: "Curls",
        type: "accessory",
        variant: "default",
        sets: [
          { kind: "fixed", reps: ACCESSORY_REP_RANGE },
          { kind: "percentOfPrevious", percent: 85, reps: ACCESSORY_PLUS_RANGE }
        ]
      },
      {
        name: "Lateral Raises",
        type: "accessory",
        variant: "default",
        sets: [
          { kind: "range", reps: "2-3 x 10-15" }
        ]
      }
    ]
  },
  D: {
    id: "D",
    title: "Workout D",
    blocks: [
      {
        name: "Deadlift",
        type: "main",
        liftKey: "Deadlift",
        sets: [
          { kind: "percent", percent: 45, reps: "5" },
          { kind: "percent", percent: 65, reps: "3" },
          { kind: "percent", percent: 85, reps: "2" },
          { kind: "percent", percent: 100, reps: MAIN_REP_RANGE, isTopSet: true },
          { kind: "percent", percent: 85, reps: BACKOFF_REP_RANGE, optional: true }
        ]
      },
      {
        name: "Light Squat",
        type: "light",
        liftKey: "Squat",
        referenceMainLift: "Squat",
        sets: [
          { kind: "bar", reps: "10" },
          { kind: "percent", percent: 45, reps: "5" },
          { kind: "percent", percent: 65, reps: "3" },
          { kind: "percent", percent: 85, reps: "2" },
          { kind: "percent", percent: 100, reps: "5 x 3" }
        ]
      },
      {
        name: "Rows",
        type: "accessory",
        variant: "default",
        sets: [
          { kind: "fixed", reps: ACCESSORY_REP_RANGE },
          { kind: "percentOfPrevious", percent: 85, reps: ACCESSORY_PLUS_RANGE }
        ]
      }
    ]
  }
};

export const DEFAULT_STATE = {
  settings: {
    barWeight: 45,
    roundingIncrement: 2.5,
    workoutBAccessory: "Chin-ups"
  },
  accessoryHistory: {
    LTEs: [],
    Curls: [],
    Rows: [],
    "Lateral Raises": [],
    "Lat Pulldowns": []
  },
  liftHistory: {
    "Bench Press": [],
    Squat: [],
    Press: [],
    Deadlift: []
  },
  workouts: [],
  programState: {
    nextWorkout: "A",
    inProgressSession: null
  },
  ui: {
    currentView: "home"
  }
};

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function roundToIncrement(value, increment) {
  return Math.round(value / increment) * increment;
}

export function formatWeight(weight) {
  if (weight == null || Number.isNaN(weight)) {
    return "--";
  }

  return Number.isInteger(weight) ? `${weight}` : `${weight.toFixed(1)}`;
}

export function nextWorkoutId(current) {
  const cycle = ["A", "B", "C", "D"];
  const index = cycle.indexOf(current);
  return cycle[(index + 1) % cycle.length];
}

export function getLastMainTopSet(state, liftKey) {
  const entries = state.liftHistory[liftKey] || [];
  if (!entries.length) {
    return null;
  }

  return entries[entries.length - 1];
}

export function getLastAccessoryWeight(state, accessoryKey) {
  const entries = state.accessoryHistory[accessoryKey] || [];
  if (!entries.length) {
    return null;
  }

  return entries[entries.length - 1];
}

export function createInitialState() {
  return clone(DEFAULT_STATE);
}

export function loadState(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return createInitialState();
    }

    return mergeState(DEFAULT_STATE, JSON.parse(raw));
  } catch {
    return createInitialState();
  }
}

export function saveState(storage, state) {
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function mergeState(base, override) {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base;
  }

  if (base && typeof base === "object") {
    const result = { ...base };
    for (const [key, value] of Object.entries(override || {})) {
      result[key] = key in base ? mergeState(base[key], value) : value;
    }
    return result;
  }

  return override ?? base;
}

function buildMainRecommendations(lastTopSet) {
  return [lastTopSet, lastTopSet + 2.5, lastTopSet + 5];
}

function getBaseWeightForBlock(state, block) {
  if (block.type === "main") {
    const lastTopSet = getLastMainTopSet(state, block.liftKey)?.weight;
    if (lastTopSet == null) {
      throw new Error(`Missing baseline for ${block.liftKey}.`);
    }

    return {
      source: "main",
      lastTopSet,
      recommendations: buildMainRecommendations(lastTopSet)
    };
  }

  if (block.type === "light") {
    const lastTopSet = getLastMainTopSet(state, block.referenceMainLift)?.weight;
    if (lastTopSet == null) {
      throw new Error(`Missing baseline for ${block.referenceMainLift}.`);
    }

    return {
      source: "light",
      derivedTopSet: roundToIncrement(lastTopSet * 0.85, state.settings.roundingIncrement)
    };
  }

  return { source: "accessory" };
}

function buildSet(setDef, baseWeight, settings) {
  if (setDef.kind === "bar") {
    return {
      ...setDef,
      label: `${formatWeight(settings.barWeight)} lb`,
      weight: settings.barWeight
    };
  }

  if (setDef.kind === "percent") {
    if (baseWeight == null) {
      return {
        ...setDef,
        label: "Select top set",
        weight: null
      };
    }

    const weight = roundToIncrement((baseWeight * setDef.percent) / 100, settings.roundingIncrement);
    return {
      ...setDef,
      label: `${formatWeight(weight)} lb`,
      weight
    };
  }

  if (setDef.kind === "percentOfPrevious") {
    return {
      ...setDef,
      label: `${setDef.percent}% of prior set`,
      weight: null
    };
  }

  if (setDef.kind === "bodyweight") {
    return {
      ...setDef,
      label: "Bodyweight",
      weight: null
    };
  }

  if (setDef.kind === "range") {
    return {
      ...setDef,
      label: "Choose weight",
      weight: null
    };
  }

  return {
    ...setDef,
    label: "Choose weight",
    weight: null
  };
}

function buildAccessorySet(setDef, accessoryWeight, settings) {
  if (setDef.kind === "fixed" || setDef.kind === "range") {
    if (accessoryWeight == null) {
      return {
        ...setDef,
        label: "Enter weight",
        weight: null
      };
    }

    return {
      ...setDef,
      label: `${formatWeight(accessoryWeight)} lb`,
      weight: accessoryWeight
    };
  }

  if (setDef.kind === "percentOfPrevious") {
    if (accessoryWeight == null) {
      return {
        ...setDef,
        label: "Enter weight",
        weight: null
      };
    }

    const weight = roundToIncrement((accessoryWeight * setDef.percent) / 100, settings.roundingIncrement);
    return {
      ...setDef,
      label: `${formatWeight(weight)} lb`,
      weight
    };
  }

  return buildSet(setDef, null, settings);
}

function buildBlockSession(state, block) {
  if (block.type === "accessoryChoice") {
    const choice = state.settings.workoutBAccessory;
    const sets = block.choices[choice];
    const accessoryWeight = choice === "Lat Pulldowns"
      ? getLastAccessoryWeight(state, choice)?.weight ?? null
      : null;
    return {
      name: choice,
      originalName: block.name,
      type: "accessory",
      liftKey: choice,
      chosenOption: choice,
      trackWeight: choice === "Lat Pulldowns",
      accessoryWeight,
      topSetOptions: [],
      selectedTopSet: null,
      sets: sets.map((setDef, index) => ({
        id: `${choice}-${index}`,
        completed: false,
        skipped: Boolean(setDef.optional),
        ...(choice === "Lat Pulldowns"
          ? buildAccessorySet(setDef, accessoryWeight, state.settings)
          : buildSet(setDef, null, state.settings))
      }))
    };
  }

  const base = getBaseWeightForBlock(state, block);
  const accessoryWeight = block.type === "accessory"
    ? getLastAccessoryWeight(state, block.name)?.weight ?? null
    : null;
  const selectedTopSet = block.type === "light" ? base.derivedTopSet : null;
  const topSetOptions = block.type === "main" ? base.recommendations : [];
  const plannedNextTopSet = block.type === "main" ? base.lastTopSet : null;
  const sets = block.sets.map((setDef, index) => ({
    id: `${block.name}-${index}`,
    completed: false,
    skipped: Boolean(setDef.optional),
    ...(block.type === "accessory"
      ? buildAccessorySet(setDef, accessoryWeight, state.settings)
      : buildSet(setDef, block.type === "main" ? base.lastTopSet : selectedTopSet, state.settings))
  }));

  return {
    name: block.name,
    type: block.type,
    liftKey: block.liftKey || block.name,
    trackWeight: block.type === "accessory",
    accessoryWeight,
    topSetOptions,
    selectedTopSet: block.type === "main" ? base.lastTopSet : selectedTopSet,
    plannedNextTopSet,
    sets
  };
}

export function createSession(state, workoutId) {
  const template = WORKOUT_TEMPLATES[workoutId];
  if (!template) {
    throw new Error(`Unknown workout ${workoutId}`);
  }

  return {
    id: `session-${Date.now()}`,
    workoutId,
    startedAt: new Date().toISOString(),
    completedAt: null,
    blockIndex: 0,
    blocks: template.blocks.map((block) => buildBlockSession(state, block))
  };
}

export function selectNextTopSet(state, session, blockIndex, weight) {
  const nextSession = clone(session);
  const block = nextSession.blocks[blockIndex];
  block.plannedNextTopSet = weight;
  return nextSession;
}

export const selectTopSet = selectNextTopSet;

export function updateAccessoryWeight(state, session, blockIndex, weight) {
  const nextSession = clone(session);
  const block = nextSession.blocks[blockIndex];
  block.accessoryWeight = weight;
  block.sets = block.sets.map((set) => buildAccessorySet(set, weight, state.settings));
  return nextSession;
}

export function toggleSet(session, blockIndex, setIndex, mode = "completed") {
  const nextSession = clone(session);
  const target = nextSession.blocks[blockIndex].sets[setIndex];
  if (mode === "skipped") {
    target.skipped = !target.skipped;
    if (target.skipped) {
      target.completed = false;
    }
  } else {
    target.completed = !target.completed;
    if (target.completed) {
      target.skipped = false;
    }
  }
  return nextSession;
}

export function canCompleteWorkout(session) {
  return session.blocks.every((block) => {
    const hasRequiredTopSet = block.type !== "main" || block.selectedTopSet != null;
    const hasAccessoryWeight = !block.trackWeight || block.accessoryWeight != null;
    return hasRequiredTopSet && hasAccessoryWeight && block.sets.every((set) => set.optional || set.completed || set.skipped);
  });
}

export function completeWorkout(state, session, note = "") {
  const finalized = clone(session);
  finalized.completedAt = new Date().toISOString();

  const nextState = clone(state);
  nextState.workouts.push({
    id: finalized.id,
    workoutId: finalized.workoutId,
    startedAt: finalized.startedAt,
    completedAt: finalized.completedAt,
    note,
    blocks: finalized.blocks
  });

  for (const block of finalized.blocks) {
    if (block.type === "main" && block.selectedTopSet != null) {
      nextState.liftHistory[block.liftKey].push({
        weight: block.plannedNextTopSet ?? block.selectedTopSet,
        date: finalized.completedAt,
        workoutId: finalized.workoutId
      });
    }

    if (block.trackWeight && block.accessoryWeight != null) {
      const historyKey = block.chosenOption || block.name;
      if (!nextState.accessoryHistory[historyKey]) {
        nextState.accessoryHistory[historyKey] = [];
      }

      nextState.accessoryHistory[historyKey].push({
        weight: block.accessoryWeight,
        date: finalized.completedAt,
        workoutId: finalized.workoutId
      });
    }
  }

  nextState.programState.inProgressSession = null;
  nextState.programState.nextWorkout = nextWorkoutId(finalized.workoutId);
  return nextState;
}

export function updateSettings(state, patch) {
  return {
    ...state,
    settings: {
      ...state.settings,
      ...patch
    }
  };
}

export function seedBaselines(state, baselines) {
  const nextState = clone(state);
  for (const [liftKey, weight] of Object.entries(baselines)) {
    nextState.liftHistory[liftKey] = [
      {
        weight: Number(weight),
        date: new Date().toISOString(),
        workoutId: "Baseline"
      }
    ];
  }
  return nextState;
}

export function updateMainLiftMaxes(state, maxes) {
  const nextState = clone(state);
  const now = new Date().toISOString();

  for (const [liftKey, weight] of Object.entries(maxes)) {
    if (!LIFTS.includes(liftKey)) {
      continue;
    }

    const nextWeight = Number(weight);
    if (!Number.isFinite(nextWeight) || nextWeight <= 0) {
      continue;
    }

    const current = getLastMainTopSet(nextState, liftKey)?.weight;
    if (current === nextWeight) {
      continue;
    }

    if (!nextState.liftHistory[liftKey]) {
      nextState.liftHistory[liftKey] = [];
    }

    nextState.liftHistory[liftKey].push({
      weight: nextWeight,
      date: now,
      workoutId: "Settings"
    });
  }

  return nextState;
}

export function needsOnboarding(state) {
  return LIFTS.some((lift) => !state.liftHistory[lift]?.length);
}

export function missingBaselinesForWorkout(state, workoutId) {
  const template = WORKOUT_TEMPLATES[workoutId];
  const missing = new Set();

  for (const block of template.blocks) {
    const liftKey = block.type === "light" ? block.referenceMainLift : block.liftKey;
    if ((block.type === "main" || block.type === "light") && !getLastMainTopSet(state, liftKey)) {
      missing.add(liftKey);
    }
  }

  return [...missing];
}

export function getWorkoutSummary(state, workoutId) {
  const template = WORKOUT_TEMPLATES[workoutId];
  return {
    id: workoutId,
    title: template.title,
    mainLift: template.blocks[0].name,
    blocks: template.blocks.map((block) => block.name)
  };
}

export function exportRows(state) {
  const rows = [];

  for (const workout of state.workouts) {
    for (const block of workout.blocks) {
      for (const set of block.sets) {
        rows.push({
          date: workout.completedAt,
          workout: workout.workoutId,
          exercise: block.name,
          category: block.type,
          prescribedWeight: set.weight == null ? "" : set.weight,
          prescribedReps: set.reps,
          completed: set.completed ? "yes" : "no",
          selectedTopSet: block.selectedTopSet === set.weight ? "yes" : "no",
          notes: workout.note || ""
        });
      }
    }
  }

  return rows;
}

export function rowsToCsv(rows) {
  const headers = [
    "date",
    "workout",
    "exercise",
    "category",
    "prescribedWeight",
    "prescribedReps",
    "completed",
    "selectedTopSet",
    "notes"
  ];

  const escaped = (value) => `"${String(value ?? "").replaceAll("\"", "\"\"")}"`;
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escaped(row[header])).join(","))
  ].join("\n");
}
