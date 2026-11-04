import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Mail } from "../../assets";
import { getAuthErrorMessage, resendVerificationEmail } from "../../auth";
import NavBar from "../NavBar";

type CheckEmailRouteState = {
  email?: unknown;
};

const CheckEmail: React.FC = () => {
  const location = useLocation();
  const routeState = location.state as CheckEmailRouteState | null;
  const email = typeof routeState?.email === "string" ? routeState.email : "";
  const [cooldown, setCooldown] = useState(60);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackIsError, setFeedbackIsError] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setCooldown((remaining) => Math.max(remaining - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function handleResend() {
    if (!email || cooldown > 0 || busy) return;

    setBusy(true);
    setCooldown(60);
    setFeedback("");
    setFeedbackIsError(false);

    try {
      const result = await resendVerificationEmail(email);
      setFeedback(
        result.message ||
          "If an unverified account exists for this email, a confirmation email has been sent.",
      );
    } catch (error) {
      setFeedback(getAuthErrorMessage(error));
      setFeedbackIsError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex min-h-screen flex-col bg-linear-to-b from-[#cfdee3] to-[#fafafa]">
      <NavBar />
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="flex w-full max-w-lg flex-col items-center gap-5 rounded-2xl bg-white px-6 py-10 text-center shadow-lg sm:px-10">
          <div className="flex size-16 items-center justify-center rounded-full bg-SoftGreen">
            <img src={Mail} alt="" className="size-8" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="font-Manrope text-3xl font-semibold text-TextBlack">
              Check your email
            </h1>
            <p className="font-Inter text-base leading-6 text-Black">
              We sent a confirmation link. Check your inbox and spam folder.
            </p>
            {email && (
              <p className="break-all font-Inter text-sm font-semibold text-TextColor">
                {email}
              </p>
            )}
          </div>
          <button
            type="button"
            disabled={!email || busy || cooldown > 0}
            onClick={handleResend}
            className="w-full cursor-pointer rounded-[10px] bg-TextColor px-5 py-3 font-Inter text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy
              ? "Sending..."
              : cooldown > 0
                ? `Resend email in ${cooldown}s`
                : "Resend email"}
          </button>
          {feedback && (
            <p
              role={feedbackIsError ? "alert" : "status"}
              className={`text-sm ${feedbackIsError ? "text-red-700" : "text-TextColor"}`}
            >
              {feedback}
            </p>
          )}
          <Link
            to="/login"
            className="font-Inter text-sm font-semibold text-TextColor underline"
          >
            Back to login
          </Link>
        </div>
      </main>
    </section>
  );
};

export default CheckEmail;
