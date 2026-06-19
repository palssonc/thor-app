import {
  LIFTS,
  VIEWS,
  WORKOUT_TEMPLATES,
  canCompleteWorkout,
  completeWorkout,
  createSession,
  exportRows,
  formatWeight,
  getLastAccessoryWeight,
  getLastMainTopSet,
  getWorkoutSummary,
  loadState,
  missingBaselinesForWorkout,
  needsOnboarding,
  rowsToCsv,
  saveState,
  seedBaselines,
  selectNextTopSet,
  toggleSet,
  updateAccessoryWeight,
  updateMainLiftMaxes,
  updateSettings
} from "./logic.js";

const storage = window.localStorage;
let state = loadState(storage);
let deferredInstallPrompt = null;

const elements = {
  home: document.querySelector("#homeView"),
  workout: document.querySelector("#workoutView"),
  history: document.querySelector("#historyView"),
  export: document.querySelector("#exportView"),
  settings: document.querySelector("#settingsView"),
  navButtons: [...document.querySelectorAll(".nav-button")],
  installButton: document.querySelector("#installButton"),
  onboardingDialog: document.querySelector("#onboardingDialog"),
  baselineDialog: document.querySelector("#baselineDialog")
};

function persist() {
  saveState(storage, state);
}

function setView(view) {
  state.ui.currentView = view;
  persist();
  render();
}

function render() {
  renderHome();
  renderWorkout();
  renderHistory();
  renderExport();
  renderSettings();
  syncViewVisibility();
}

function syncViewVisibility() {
  for (const view of VIEWS) {
    const active = state.ui.currentView === view;
    elements[view].classList.toggle("hidden", !active);
    elements[view].classList.toggle("active", active);
  }

  for (const button of elements.navButtons) {
    button.classList.toggle("active", button.dataset.view === state.ui.currentView);
  }
}

function renderHome() {
  const workout = getWorkoutSummary(state, state.programState.nextWorkout);
  const inProgress = state.programState.inProgressSession;
  const mainHistory = getLastMainTopSet(state, workout.mainLift.replace("Light ", "")) || getLastMainTopSet(state, workout.mainLift);

  elements.home.innerHTML = `
    <section class="hero-card">
      <p class="eyebrow">Next up</p>
      <h2>${workout.title}</h2>
      <p class="main-lift">${workout.mainLift}</p>
      <p class="muted">Blocks: ${workout.blocks.join(" • ")}</p>
      <div class="hero-actions">
        <button id="readyButton" class="primary" type="button">${inProgress ? "Resume Workout" : "Ready"}</button>
        <button id="homeExportButton" class="ghost" type="button">Export CSV</button>
      </div>
      <p class="statline">Last top set for ${workout.mainLift}: ${mainHistory ? `${formatWeight(mainHistory.weight)} lb` : "not set yet"}</p>
    </section>

    <section class="panel-grid">
      <article class="panel">
        <h3>Session Rules</h3>
        <p>The cycle only advances when you finish all required work and tap <strong>Complete Workout</strong>.</p>
      </article>
      <article class="panel">
        <h3>Quick Actions</h3>
        <div class="stack">
          <button data-jump="history" class="ghost wide" type="button">View History</button>
          <button data-jump="settings" class="ghost wide" type="button">Settings</button>
        </div>
      </article>
    </section>
  `;

  elements.home.querySelector("#readyButton").addEventListener("click", startOrResumeWorkout);
  elements.home.querySelector("#homeExportButton").addEventListener("click", () => setView("export"));
  for (const button of elements.home.querySelectorAll("[data-jump]")) {
    button.addEventListener("click", () => setView(button.dataset.jump));
  }
}

function renderWorkout() {
  const session = state.programState.inProgressSession;
  if (!session) {
    elements.workout.innerHTML = `
      <section class="empty-state">
        <h2>No workout in progress</h2>
        <p>Start from Home when you’re ready. Your next session is ${WORKOUT_TEMPLATES[state.programState.nextWorkout].title}.</p>
      </section>
    `;
    return;
  }

  const block = session.blocks[session.blockIndex];
  const nextTopSetPicker = block.type === "main"
    ? `
      <section class="panel">
        <h3>Next Time</h3>
        <p class="muted">Today is based on ${formatWeight(block.selectedTopSet)} lb. Choose the max to use for this lift next time.</p>
        <div class="option-row">
          ${block.topSetOptions.map((option) => `
            <button class="chip ${block.plannedNextTopSet === option ? "selected" : ""}" data-next-top-set="${option}" type="button">
              ${formatWeight(option)} lb
            </button>
          `).join("")}
        </div>
      </section>
    `
    : "";
  const accessoryWeightEditor = block.trackWeight
    ? `
      <section class="panel">
        <h3>Accessory Weight</h3>
        <p class="muted">Track the working weight for this lift so it is ready next time.</p>
        <div class="weight-editor">
          <input id="accessoryWeightInput" type="number" min="0" step="2.5" value="${block.accessoryWeight ?? ""}" placeholder="Enter weight in lb">
          <button id="saveAccessoryWeight" class="primary" type="button">Use Weight</button>
        </div>
      </section>
    `
    : "";

  elements.workout.innerHTML = `
    <section class="hero-card compact">
      <div class="progress-row">
        <p class="eyebrow">${WORKOUT_TEMPLATES[session.workoutId].title}</p>
        <p class="muted">${session.blockIndex + 1} / ${session.blocks.length}</p>
      </div>
      <h2>${block.name}</h2>
      <p class="muted">${block.type === "main" ? "Main lift" : block.type === "light" ? "Light lift" : "Accessory"}</p>
    </section>

    ${accessoryWeightEditor}

    <section class="panel">
      <div class="set-list">
        ${block.sets.map((set, index) => `
          <article class="set-card ${set.completed ? "done" : ""} ${set.skipped ? "skipped" : ""}">
            <div>
              <p class="set-label">${set.label}</p>
              <p class="muted">Reps: ${set.reps}${set.optional ? " • optional" : ""}</p>
            </div>
            <div class="set-actions">
              <button class="ghost small" data-toggle-skip="${index}" type="button">${set.skipped ? "Undo Skip" : "Skip"}</button>
              <button class="primary small" data-toggle-set="${index}" type="button" ${((set.kind === "percent" || block.trackWeight) && set.weight == null) ? "disabled" : ""}>${set.completed ? "Done" : "Mark Done"}</button>
            </div>
          </article>
        `).join("")}
      </div>
    </section>

    ${nextTopSetPicker}

    <section class="workout-actions">
      <button id="previousBlock" class="ghost" type="button" ${session.blockIndex === 0 ? "disabled" : ""}>Previous</button>
      <button id="nextBlock" class="ghost" type="button" ${session.blockIndex === session.blocks.length - 1 ? "disabled" : ""}>Next</button>
      <button id="completeWorkout" class="primary" type="button" ${canCompleteWorkout(session) ? "" : "disabled"}>Complete Workout</button>
    </section>
  `;

  if (block.trackWeight) {
    elements.workout.querySelector("#saveAccessoryWeight").addEventListener("click", () => {
      const input = elements.workout.querySelector("#accessoryWeightInput");
      const value = Number(input.value);
      if (!Number.isFinite(value) || value <= 0) {
        input.focus();
        return;
      }

      state.programState.inProgressSession = updateAccessoryWeight(state, session, session.blockIndex, value);
      persist();
      renderWorkout();
    });
  }

  for (const button of elements.workout.querySelectorAll("[data-next-top-set]")) {
    button.addEventListener("click", () => {
      state.programState.inProgressSession = selectNextTopSet(state, session, session.blockIndex, Number(button.dataset.nextTopSet));
      persist();
      renderWorkout();
    });
  }

  for (const button of elements.workout.querySelectorAll("[data-toggle-set]")) {
    button.addEventListener("click", () => {
      state.programState.inProgressSession = toggleSet(session, session.blockIndex, Number(button.dataset.toggleSet));
      persist();
      renderWorkout();
    });
  }

  for (const button of elements.workout.querySelectorAll("[data-toggle-skip]")) {
    button.addEventListener("click", () => {
      state.programState.inProgressSession = toggleSet(session, session.blockIndex, Number(button.dataset.toggleSkip), "skipped");
      persist();
      renderWorkout();
    });
  }

  elements.workout.querySelector("#previousBlock").addEventListener("click", () => shiftBlock(-1));
  elements.workout.querySelector("#nextBlock").addEventListener("click", () => shiftBlock(1));
  elements.workout.querySelector("#completeWorkout").addEventListener("click", finishWorkout);
}

function shiftBlock(delta) {
  const session = structuredClone(state.programState.inProgressSession);
  session.blockIndex = Math.min(session.blocks.length - 1, Math.max(0, session.blockIndex + delta));
  state.programState.inProgressSession = session;
  persist();
  renderWorkout();
}

function renderHistory() {
  const workouts = [...state.workouts].reverse();
  const liftCards = LIFTS.map((lift) => {
    const last = getLastMainTopSet(state, lift);
    return `
      <article class="panel">
        <h3>${lift}</h3>
        <p class="statline">${last ? `${formatWeight(last.weight)} lb` : "No history yet"}</p>
      </article>
    `;
  }).join("");
  const accessoryCards = ["LTEs", "Curls", "Rows", "Lateral Raises", "Lat Pulldowns"].map((lift) => {
    const last = getLastAccessoryWeight(state, lift);
    return `
      <article class="panel">
        <h3>${lift}</h3>
        <p class="statline">${last ? `${formatWeight(last.weight)} lb` : "No weight logged yet"}</p>
      </article>
    `;
  }).join("");

  const workoutCards = workouts.length
    ? workouts.map((workout) => `
      <article class="panel">
        <h3>${WORKOUT_TEMPLATES[workout.workoutId].title}</h3>
        <p class="muted">${new Date(workout.completedAt).toLocaleString()}</p>
        <p class="statline">${workout.blocks.map((block) => `${block.name}${block.selectedTopSet ? ` ${formatWeight(block.selectedTopSet)} lb` : ""}`).join(" • ")}</p>
      </article>
    `).join("")
    : `<section class="empty-state"><h2>No workouts logged yet</h2><p>Your completed sessions will show up here.</p></section>`;

  elements.history.innerHTML = `
    <section class="stack">
      <div>
        <p class="eyebrow">Main lifts</p>
        <section class="panel-grid">${liftCards}</section>
      </div>
      <div>
        <p class="eyebrow">Accessories</p>
        <section class="panel-grid">${accessoryCards}</section>
      </div>
    </section>
    <section class="stack">${workoutCards}</section>
  `;
}

function renderExport() {
  const csv = rowsToCsv(exportRows(state));
  elements.export.innerHTML = `
    <section class="panel">
      <h2>Export CSV</h2>
      <p class="muted">Open this screen any time. Starting a workout is not required.</p>
      <div class="hero-actions">
        <button id="copyCsv" class="primary" type="button">Copy CSV</button>
        <button id="downloadCsv" class="ghost" type="button">Download CSV</button>
      </div>
      <textarea id="csvOutput" class="csv-output" spellcheck="false">${csv}</textarea>
    </section>
  `;

  elements.export.querySelector("#copyCsv").addEventListener("click", async () => {
    await navigator.clipboard.writeText(csv);
  });

  elements.export.querySelector("#downloadCsv").addEventListener("click", () => {
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "workout-history.csv";
    link.click();
    URL.revokeObjectURL(url);
  });
}

function renderSettings() {
  const liftInputs = LIFTS.map((lift) => {
    const current = getLastMainTopSet(state, lift);
    return `
      <label>
        <span>${lift} current max</span>
        <input name="${lift}" type="number" min="0" step="2.5" value="${current ? current.weight : ""}" required>
      </label>
    `;
  }).join("");

  elements.settings.innerHTML = `
    <form id="settingsForm" class="panel stack">
      <h2>Settings</h2>
      <label>
        <span>Bar weight</span>
        <input name="barWeight" type="number" min="0" step="2.5" value="${state.settings.barWeight}">
      </label>
      <label>
        <span>Rounding increment</span>
        <input name="roundingIncrement" type="number" min="1.25" step="1.25" value="${state.settings.roundingIncrement}">
      </label>
      <label>
        <span>Workout B accessory</span>
        <select name="workoutBAccessory">
          <option value="Chin-ups" ${state.settings.workoutBAccessory === "Chin-ups" ? "selected" : ""}>Chin-ups</option>
          <option value="Lat Pulldowns" ${state.settings.workoutBAccessory === "Lat Pulldowns" ? "selected" : ""}>Lat Pulldowns</option>
        </select>
      </label>
      <div class="stack">
        <p class="eyebrow">Main lift maxes</p>
        ${liftInputs}
      </div>
      <button class="primary" type="submit">Save Settings</button>
    </form>
  `;

  elements.settings.querySelector("#settingsForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state = updateSettings(state, {
      barWeight: Number(form.get("barWeight")),
      roundingIncrement: Number(form.get("roundingIncrement")),
      workoutBAccessory: form.get("workoutBAccessory")
    });
    state = updateMainLiftMaxes(state, Object.fromEntries(LIFTS.map((lift) => [lift, Number(form.get(lift))])));
    persist();
    render();
  });
}

function startOrResumeWorkout() {
  if (state.programState.inProgressSession) {
    setView("workout");
    return;
  }

  const missing = missingBaselinesForWorkout(state, state.programState.nextWorkout);
  if (missing.length) {
    openBaselineDialog(missing);
    return;
  }

  state.programState.inProgressSession = createSession(state, state.programState.nextWorkout);
  state.ui.currentView = "workout";
  persist();
  render();
}

function finishWorkout() {
  const note = window.prompt("Any notes for this workout?", "") || "";
  state = completeWorkout(state, state.programState.inProgressSession, note);
  state.ui.currentView = "home";
  persist();
  render();
}

function openOnboarding() {
  elements.onboardingDialog.innerHTML = `
    <form method="dialog" id="onboardingForm" class="stack">
      <h2>Set Your Baselines</h2>
      <p class="muted">Enter the last successful main top set for each lift. The app will recommend today’s next top set from there.</p>
      ${LIFTS.map((lift) => `
        <label>
          <span>${lift}</span>
          <input name="${lift}" type="number" min="0" step="2.5" required>
        </label>
      `).join("")}
      <label>
        <span>Workout B accessory</span>
        <select name="workoutBAccessory">
          <option value="Chin-ups">Chin-ups</option>
          <option value="Lat Pulldowns">Lat Pulldowns</option>
        </select>
      </label>
      <menu class="hero-actions">
        <button class="primary" value="save" type="submit">Save Baselines</button>
      </menu>
    </form>
  `;

  const dialog = elements.onboardingDialog;
  dialog.showModal();
  dialog.querySelector("#onboardingForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state = updateSettings(state, { workoutBAccessory: form.get("workoutBAccessory") });
    state = seedBaselines(state, Object.fromEntries(LIFTS.map((lift) => [lift, Number(form.get(lift))])));
    persist();
    dialog.close();
    render();
  });
}

function openBaselineDialog(missing) {
  elements.baselineDialog.innerHTML = `
    <form method="dialog" id="baselineForm" class="stack">
      <h2>Add Missing Baselines</h2>
      <p class="muted">These lifts need a last successful main top set before this workout can start.</p>
      ${missing.map((lift) => `
        <label>
          <span>${lift}</span>
          <input name="${lift}" type="number" min="0" step="2.5" required>
        </label>
      `).join("")}
      <menu class="hero-actions">
        <button class="primary" value="save" type="submit">Save and Start</button>
      </menu>
    </form>
  `;

  const dialog = elements.baselineDialog;
  dialog.showModal();
  dialog.querySelector("#baselineForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    state = seedBaselines(state, Object.fromEntries(missing.map((lift) => [lift, Number(form.get(lift))])));
    persist();
    dialog.close();
    startOrResumeWorkout();
  });
}

function setupNavigation() {
  for (const button of elements.navButtons) {
    button.addEventListener("click", () => setView(button.dataset.view));
  }
}

function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    elements.installButton.classList.remove("hidden");
  });

  elements.installButton.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    elements.installButton.classList.add("hidden");
  });
}

async function setupPwa() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.register("./sw.js");
    registration.update();
  }
}

setupNavigation();
setupInstallPrompt();
setupPwa();
render();

if (state.programState.inProgressSession) {
  state.ui.currentView = "workout";
  persist();
  render();
}

if (needsOnboarding(state)) {
  openOnboarding();
}
