import { useEffect, useState } from "react";
import { getCurrentUser, type AuthUser } from "../../auth";

export default function ChatDashboard() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((result) => {
        if (isMounted) setUser(result.user ?? null);
      })
      .catch((reason: unknown) => {
        if (!isMounted) return;
        if (reason instanceof Error && reason.message === "Not signed in.") {
          window.location.replace("/login");
          return;
        }
        setError(
          reason instanceof Error
            ? reason.message
            : "Could not verify your session.",
        );
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-800">
        <p role="alert">{error}</p>
      </main>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-800">
      <section className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="mb-3 text-sm font-medium uppercase text-emerald-700">
          MediAI
        </p>
        <h1 className="text-3xl font-semibold">
          Welcome to your chat dashboard
        </h1>
        <p className="mt-3 text-slate-600">
          {user
            ? `You are signed in as ${user.name}.`
            : "Loading your account..."}
        </p>
      </section>
    </main>
  );
}
