
"use client";

import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
const MAX_COUNT = 999999;



const THEMES = [
  // Forest
  { value: "forest-light", label: "Forest Light" },
  { value: "forest-dark", label: "Forest Dark" },

  // Saffron
  { value: "saffron-light", label: "Saffron Light" },
  { value: "saffron-dark", label: "Saffron Dark" },

  // Ocean
  { value: "ocean-light", label: "Ocean Light" },
  { value: "ocean-dark", label: "Ocean Dark" },


  // Rose
  { value: "rose-light", label: "Rose Light" },
 // { value: "rose-dark", label: "Rose Dark" },

  // Mint
  { value: "mint-light", label: "Mint Light" },
  { value: "mint-dark", label: "Mint Dark" },

  // Coral
  { value: "coral-light", label: "Coral Light" },
  // New themes
  { value: "playful", label: "Playful Pop" },
  { value: "market-terminal", label: "Market Terminal" },
  { value: "arcade", label: "Arcade Night" },
] as const;

type Theme = (typeof THEMES)[number]["value"];

type CounterSettings = {
  count: number;
  step: number;
  goal: number;
  theme: Theme;
};

const DEFAULT_SETTINGS: CounterSettings = {
  count: 0,
  step: 1,
  goal: 5000,
  theme: "forest-light",
};

export default function Home() {
const [settings, setSettings] = useState<CounterSettings>(
  DEFAULT_SETTINGS
);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
const [inputValues, setInputValues] = useState({
  step: String(DEFAULT_SETTINGS.step),
  goal: String(DEFAULT_SETTINGS.goal),
});
  // Load saved settings
// Load saved settings
useEffect(() => {
  try {
    const saved = localStorage.getItem("my-counter");

    if (saved) {
      const parsed = JSON.parse(saved);

      const loadedSettings: CounterSettings = {
        count: Number.isInteger(parsed.count)
          ? Math.min(MAX_COUNT, Math.max(0, parsed.count))
          : 0,

        step: Number.isInteger(parsed.step) &&
          parsed.step >= 1 &&
          parsed.step <= MAX_COUNT
          ? parsed.step : 1,

        goal: Number.isInteger(parsed.goal) &&
          parsed.goal >= 1 &&
          parsed.goal <= MAX_COUNT
          ? parsed.goal : 5000,

        theme: THEMES.some(t => t.value === parsed.theme)
          ? parsed.theme : "forest-light",
      };

      setSettings(loadedSettings);

      setInputValues({
        step: String(loadedSettings.step),
        goal: String(loadedSettings.goal),
      });
    }
  } catch {
    console.error("Unable to load saved counter settings.");
  }

  setHydrated(true);
}, []);

  // Save settings
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(
      "my-counter",
      JSON.stringify(settings)
    );
  }, [settings, hydrated]);

const updateSetting = <K extends keyof CounterSettings,>(
  key: K,
  value: CounterSettings[K]
) => {
  setSettings(prev => ({
    ...prev,
    [key]: value,
  }));
};

const progress = settings.goal > 0
  ? Math.min((settings.count / settings.goal) * 100, 100)
  : 0;

  const remaining = Math.max(
    settings.goal - settings.count,
    0
  );

  const increment = () => {
    updateSetting(
      "count",
      Math.min(MAX_COUNT, settings.count + settings.step)
    );
  };

  const decrement = () => {
    updateSetting(
      "count",
      Math.max(0, settings.count - settings.step)
    );
  };

  const reset = () => {
    if (window.confirm("Reset today's count?")) {
      updateSetting("count", 0);
    }
  };


const handleNumberChange = (
  key: "step" | "goal",
  value: string
) => {
  // Allow the input to become temporarily empty.
  setInputValues(prev => ({
    ...prev,
    [key]: value,
  }));

  if (value === "") return;

  const number = Number(value);

  if (
    Number.isInteger(number) &&
    number >= 1 &&
    number <= MAX_COUNT
  ) {
    updateSetting(key, number);
  }
};

const handleNumberBlur = (
  key: "step" | "goal"
) => {
  const value = inputValues[key];
  const number = Number(value);

  // Restore the previous valid value if input is empty or invalid.
  if (
    value === "" ||
    !Number.isInteger(number) ||
    number < 1 ||
    number > MAX_COUNT
  ) {
    setInputValues(prev => ({
      ...prev,
      [key]: String(settings[key]),
    }));
  } else {
    setInputValues(prev => ({
      ...prev,
      [key]: String(number),
    }));
  }
};


  return (
    <main
      className="app_container"
      data-theme={settings.theme}
    >
      {/* HEADER */}
      <header className="app_header">
        <div>
          <h1 className="header">My Counter</h1>
          <p>A Simple Counter App</p>
        </div>


<div className="theme_wrapper">
  <button
    className="theme_toggle"
    onClick={() => setThemeMenuOpen(prev => !prev)}
    aria-label="Choose appearance"
    aria-expanded={themeMenuOpen}
    aria-haspopup="true"
  >
   <Palette size={22} strokeWidth={2} />
  </button>

  {themeMenuOpen && (
    <div className="theme_dropdown">
      {THEMES.map(({ value, label }) => (
        <button
          key={value}
          className={
            settings.theme === value ? "selected" : ""
          }
          aria-pressed={settings.theme === value}
          onClick={() => {
            updateSetting("theme", value);
            setThemeMenuOpen(false);
          }}
        >
          {label}
          {settings.theme === value && " ✓"}
        </button>
      ))}
    </div>
  )}
</div>

      </header>

      {/* COUNTER */}
      <section className="counter_container">
        <p className="counter_heading">TODAY'S COUNT</p>

        <h2 className="counter_display" aria-live="polite">
          {settings.count.toLocaleString()}
        </h2>

        <div className="progress_section">
          <div className="progress_labels">
            <span>Daily goal progress</span>
            <strong>{progress.toFixed(1)}%</strong>
          </div>

          <div
            className="progress_track"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Daily goal progress"
          >
            <div
              className="progress_fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="progress_description">
            {remaining > 0
              ? `${remaining.toLocaleString()} counts remaining to reach your goal`
              : "Congratulations! Today's goal completed!"}
          </p>
        </div>
      </section>

      {/* MAIN BUTTON */}
      <section className="counting_section">
        <button
          className="increment"
          onClick={increment}
          aria-label={`Add ${settings.step} to counter`}
          disabled={settings.count >= MAX_COUNT}
        >
          <span>+{settings.step}</span>
          <small>TAP TO COUNT</small>
        </button>

        <p className="counting_hint">
          One breath. One count.
        </p>
      </section>

      {/* ACTION BUTTONS */}
      <section className="action_buttons">
        <button
          className="decrement"
          onClick={decrement}
          disabled={settings.count === 0}
        >
          − <span>Decrease</span>
        </button>

        <button
          className="reset"
          onClick={reset}
          disabled={settings.count === 0}
        >
          ↺ <span>Reset</span>
        </button>
      </section>

      {/* SETTINGS */}
      <section className="settings_container">
        <h3>Counting settings</h3>

        <div className="setting_group">
          <label htmlFor="step">
            Counting interval
          </label>

<input
  id="step"
  type="text"
  inputMode="numeric"
  maxLength={6}
  value={inputValues.step}
  onChange={e =>
    handleNumberChange("step", e.target.value)
  }
  onBlur={() => handleNumberBlur("step")}
/>
        </div>

        <div className="setting_group">
          <label htmlFor="goal">
            Today's goal
          </label>

<input
  id="goal"
  type="text"
  inputMode="numeric"
  maxLength={6}
  value={inputValues.goal}
  onChange={e =>
    handleNumberChange("goal", e.target.value)
  }
  onBlur={() => handleNumberBlur("goal")}
/>

          <p>
            Set your personal counting target for today.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="app_footer">
        Built Using Next.js
      </footer>
    </main>
  );
}
