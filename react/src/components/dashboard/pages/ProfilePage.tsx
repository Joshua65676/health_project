import { useEffect, useState, type FormEvent } from "react";
import { getCurrentUser, updateProfile, type AuthUser } from "../../../auth";

type ProfilePageProps = {
  onProfileUpdated: (user: AuthUser) => void;
};

export default function ProfilePage({ onProfileUpdated }: ProfilePageProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getCurrentUser()
      .then((result) => {
        if (!isMounted || !result.user) return;
        setUser(result.user);
        setName(result.user.name);
      })
      .catch((reason: unknown) => {
        if (isMounted) {
          setError(
            reason instanceof Error
              ? reason.message
              : "Could not load your profile.",
          );
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextName = name.trim();
    if (nextName.length < 2 || saving) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const result = await updateProfile(nextName);
      if (result.user) {
        setUser(result.user);
        setName(result.user.name);
        onProfileUpdated(result.user);
      }
      setSaved(true);
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not save your profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-7 overflow-y-auto text-[#1c302d]">
      <header>
        <p className="mb-2 text-[10px] font-Inter font-bold text-TextColor">
          YOUR ACCOUNT
        </p>
        <h1 className="m-0 text-2xl font-semibold font-Inter text-black leading-tight sm:text-[34px]">
          Profile
        </h1>
        <p className="mt-2 font-Inter font-medium text-sm text-Black">
          Manage your account details.
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

      <div className="flex items-center gap-4 border-b border-[#dce7e1] pb-6">
        <div
          className="grid size-16 shrink-0 place-items-center rounded-full border border-[#b9ded0] bg-[#e9f6ef] text-2xl font-semibold text-[#087e68]"
          role="img"
          aria-label={`${user?.name ?? "User"} profile picture`}
        >
          {initial}
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-Inter font-semibold">
            {loading ? "Loading profile..." : (user?.name ?? "Your profile")}
          </h2>
          <p className="mt-1 truncate font-Inter text-sm text-TextBlack">
            {user?.email ?? "Account details"}
          </p>
        </div>
      </div>

      <form className="flex max-w-xl flex-col gap-5" onSubmit={save}>
        <div>
          <h2 className="text-sm font-Inter font-semibold text-Black">
            Personal details
          </h2>
          <p className="mt-1 font-Inter font-medium text-xs text-TextBlack">
            Your name appears on your account and chat messages.
          </p>
        </div>
        <label
          className="flex flex-col gap-1.5 text-xs font-Inter font-medium text-TextBlack"
          htmlFor="profile-name"
        >
          Display name
          <input
            id="profile-name"
            className="h-11 rounded-md border font-semibold font-Inter border-[#d7e4dd] bg-white px-3 text-sm text-Black outline-none transition focus:border-[#087e68] focus:ring-2 focus:ring-[#087e68]/10 disabled:bg-[#f5f8f6]"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setSaved(false);
            }}
            minLength={2}
            maxLength={120}
            required
            disabled={loading || saving}
            autoComplete="name"
          />
        </label>
        <label
          className="flex flex-col gap-1.5 text-xs font-Inter font-medium text-TextBlack"
          htmlFor="profile-email"
        >
          Email address
          <input
            id="profile-email"
            className="h-11 rounded-md font-Inter font-medium border border-[#e3ebe6] bg-[#f5f8f6] px-3 text-sm text-[#687b75]"
            value={user?.email ?? ""}
            readOnly
            disabled={loading}
            autoComplete="email"
          />
          <span className="font-Inter font-normal text-[#83928c]">
            Email changes are managed through account support.
          </span>
        </label>
        <div className="flex min-h-10 items-center gap-4">
          <button
            className="h-10 font-Inter cursor-pointer rounded-md bg-[#087e68] px-4 text-sm font-semibold text-white transition hover:bg-[#066b59] disabled:cursor-not-allowed disabled:bg-[#b7cec5]"
            type="submit"
            disabled={
              loading ||
              saving ||
              name.trim().length < 2 ||
              name.trim() === user?.name
            }
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
          {saved && (
            <span className="text-xs font-medium text-[#087e68]" role="status">
              Profile saved
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
