import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getCurrentUser } from "../../auth";
import Sidebar from "./Sidebar";
import type { DashboardPage } from "./types";
import ChatPage from "./pages/ChatPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

const pageComponents = {
  chat: ChatPage,
  settings: SettingsPage,
  history: HistoryPage,
  profile: ProfilePage,
};

export default function ChatDashboard() {
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState<DashboardPage>("chat");

  useEffect(() => {
    let isMounted = true;

    getCurrentUser().catch((reason: unknown) => {
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

  const ActivePage = pageComponents[activePage];

  return (
    <div className="flex min-h-screen bg-[#f7f9f8]">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="min-w-0 flex-1 overflow-hidden p-6 md:p-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={activePage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto w-full max-w-5xl"
          >
            <ActivePage />
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}
