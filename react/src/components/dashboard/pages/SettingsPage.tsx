import { useState } from "react";
import type { UserPreferences } from "../../../auth";

type SettingsPageProps = {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => Promise<void>;
};

const responseStyles: {
  value: UserPreferences["responseStyle"];
  title: string;
  description: string;
}[] = [
  {
    value: "concise",
    title: "Concise",
    description: "A quick, direct answer.",
  },
  {
    value: "balanced",
    title: "Balanced",
    description: "Helpful context without the extra length.",
  },
  {
    value: "detailed",
    title: "Detailed",
    description: "More explanation and practical detail.",
  },
];

export default function SettingsPage({
  preferences,
  onSave,
}: SettingsPageProps) {
  const [draft, setDraft] = useState(preferences);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function saveSettings() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      await onSave(draft);
      setSaved(true);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Settings could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  const changed =
    draft.responseStyle !== preferences.responseStyle ||
    draft.saveHistory !== preferences.saveHistory;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8 overflow-y-auto text-[#1c302d]">
      <header className="flex flex-col items-start gap-2.5">
        <p className="text-[10px] font-Inter font-bold text-TextColor leading-7">
          PREFERENCES
        </p>
        <h2 className="text-2xl font-semibold font-Inter leading-7 sm:text-[34px]">
          Settings
        </h2>
        <p className="font-Inter font-medium text-sm text-Black">
          Adjust how MediAI responds and what it remembers.
        </p>
      </header>

      {error && (
        <p
          className="border-l-[3px] border-[#c65b53] bg-[#fff5f3] px-3 py-2.5 text-sm text-[#98443e]"
          role="alert"
        >
          {error}
        </p>
      )}

      <fieldset className="flex flex-col gap-4 border-0 border-b border-[#dce7e1] p-0 pb-7">
        <div className="flex flex-col items-start gap-0.5">
          <legend className="text-sm font-Inter font-semibold text-black">
            Response length
          </legend>
          <p className="font-Inter font-medium text-xs text-Black">
            Choose how much detail you prefer in each reply.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {responseStyles.map((style) => (
            <label
              key={style.value}
              className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition ${draft.responseStyle === style.value ? "border-[#087e68] bg-[#f1f8f4] ring-1 ring-[#087e68]/15" : "border-[#dce7e1] bg-white hover:border-[#a8c8ba]"}`}
            >
              <input
                className="mt-0.5 accent-[#087e68]"
                type="radio"
                name="response-style"
                value={style.value}
                checked={draft.responseStyle === style.value}
                onChange={() => {
                  setDraft((current) => ({
                    ...current,
                    responseStyle: style.value,
                  }));
                  setSaved(false);
                }}
              />
              <span>
                <strong className="block text-xs font-Inter font-semibold text-black">
                  {style.title}
                </strong>
                <small className="mt-1 block text-[11px] font-Inter font-medium leading-4 text-Black">
                  {style.description}
                </small>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold font-Inter text-black">
            Save conversation history
          </h2>
          <p className="max-w-xl text-xs font-Inter font-medium leading-7.5 text-Black">
            When turned off, new chats stay in this session and are not added to
            your saved history.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={draft.saveHistory}
          aria-label="Save conversation history"
          onClick={() => {
            setDraft((current) => ({
              ...current,
              saveHistory: !current.saveHistory,
            }));
            setSaved(false);
          }}
          className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full border-0 transition-colors ${draft.saveHistory ? "bg-[#087e68]" : "bg-[#aab8b1]"}`}
        >
          <span
            className={`absolute top-1 size-4 rounded-full bg-white shadow transition-transform ${draft.saveHistory ? "left-6" : "left-1"}`}
          />
        </button>
      </div>

      <div className="flex min-h-10 items-center gap-4 border-t border-[#dce7e1] pt-5">
        <button
          className="h-10 cursor-pointer rounded-md bg-[#087e68] px-4 text-sm font-semibold text-white transition hover:bg-[#066b59] disabled:cursor-not-allowed disabled:bg-[#b7cec5]"
          type="button"
          onClick={() => void saveSettings()}
          disabled={!changed || saving}
        >
          {saving ? "Saving..." : "Save settings"}
        </button>
        {saved && (
          <span className="text-xs font-medium text-[#087e68]" role="status">
            Settings saved
          </span>
        )}
      </div>
    </section>
  );
}
