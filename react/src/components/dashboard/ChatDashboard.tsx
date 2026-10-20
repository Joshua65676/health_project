import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  getCurrentUser,
  getUserPreferences,
  saveUserPreferences,
  type UserPreferences,
} from "../../auth";
import { getConversation, saveConversation } from "./chatApi";
import Sidebar from "./Sidebar";
import type { DashboardPage } from "./types";
import ChatPage from "./pages/ChatPage";
import HistoryPage from "./pages/HistoryPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { LockIcon, Logo } from "../../assets";
import type { Conversation, SaveConversationInput } from "./chatTypes";

const DASHBOARD_SESSION_KEY = "mediai-dashboard-session";
const dashboardPages: DashboardPage[] = [
  "chat",
  "settings",
  "history",
  "profile",
];

type StoredDashboardSession = {
  userId: number;
  activePage: DashboardPage;
  conversationId: number | null;
};

function readDashboardSession(userId: number): StoredDashboardSession | null {
  try {
    const value = sessionStorage.getItem(DASHBOARD_SESSION_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<StoredDashboardSession>;
    if (
      parsed.userId !== userId ||
      !dashboardPages.includes(parsed.activePage as DashboardPage)
    )
      return null;
    return {
      userId,
      activePage: parsed.activePage as DashboardPage,
      conversationId:
        typeof parsed.conversationId === "number"
          ? parsed.conversationId
          : null,
    };
  } catch {
    return null;
  }
}

export default function ChatDashboard() {
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState<number | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>({
    responseStyle: "balanced",
    saveHistory: true,
  });
  const [activePage, setActivePage] = useState<DashboardPage>("chat");
  const [chatGeneration, setChatGeneration] = useState(0);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  async function persistConversation(input: SaveConversationInput) {
    const result = await saveConversation(input);
    setSelectedConversation((current) => ({
      ...(current?.id === result.id ? current : {}),
      id: result.id,
      title: input.title,
      messages: input.messages,
      updatedAt: new Date().toISOString(),
    }));
    return result.id;
  }

  useEffect(() => {
    let isMounted = true;

    getUserPreferences()
      .then((result) => {
        if (isMounted) setPreferences(result);
      })
      .catch(() => {});

    async function restoreDashboard() {
      try {
        const result = await getCurrentUser();
        if (!isMounted || !result.user) return;
        setUserName(result.user.name);
        setUserId(result.user.id);

        const savedSession = readDashboardSession(result.user.id);
        if (savedSession) {
          setActivePage(savedSession.activePage);
          if (savedSession.conversationId) {
            try {
              const conversation = await getConversation(
                savedSession.conversationId,
              );
              if (isMounted) setSelectedConversation(conversation);
            } catch {
              sessionStorage.removeItem(DASHBOARD_SESSION_KEY);
            }
          }
        } else {
          sessionStorage.removeItem(DASHBOARD_SESSION_KEY);
        }
      } catch (reason: unknown) {
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
      } finally {
        if (isMounted) setRestoring(false);
      }
    }

    void restoreDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!userId || restoring) return;
    const savedSession: StoredDashboardSession = {
      userId,
      activePage,
      conversationId: selectedConversation?.id ?? null,
    };
    try {
      sessionStorage.setItem(
        DASHBOARD_SESSION_KEY,
        JSON.stringify(savedSession),
      );
    } catch {
      // The dashboard remains usable if browser storage is unavailable.
    }
  }, [activePage, restoring, selectedConversation?.id, userId]);

  function startNewChat() {
    if (userId) {
      try {
        sessionStorage.removeItem(`mediai-chat-session:${userId}`);
      } catch {
        // The current page remains usable without browser storage.
      }
    }
    setSelectedConversation(null);
    setActivePage("chat");
    setChatGeneration((generation) => generation + 1);
  }

  function openConversation(conversation: Conversation) {
    setSelectedConversation(conversation);
    setActivePage("chat");
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-slate-800">
        <p role="alert">{error}</p>
      </main>
    );
  }

  if (restoring) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f7f9f8] text-sm text-[#687b75]">
        Restoring your workspace...
      </main>
    );
  }

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#f7f9f8]">
      <Sidebar
        activePage={activePage}
        onPageChange={setActivePage}
        onNewChat={startNewChat}
        historyRefreshKey={selectedConversation?.updatedAt}
        onSelectConversation={openConversation}
        userName={userName}
      />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <nav className="h-20 w-full shrink-0 border-b border-FormBg bg-BoardBg shadow-medium">
          <div className="flex h-full min-w-0 items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-SoftGreen p-2 shadow-hard sm:size-12">
              <img src={Logo} alt="" />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <header className="flex min-w-0 items-baseline gap-2 sm:gap-3">
                <h2 className="shrink-0 font-Inter text-xl font-semibold leading-7 text-Black sm:text-2xl">
                  Medi<span className="text-TextColor">AI</span>
                </h2>
                <span className="truncate font-Inter text-sm font-semibold leading-7 text-TextColor sm:text-base">
                  Assistant
                </span>
              </header>
              <div className="flex flex-row items-center gap-3 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-Green" />
                  <span className="font-Inter text-xs text-black sm:text-sm">
                    Active
                  </span>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <img src={LockIcon} alt="" />
                  <span className="font-Inter text-sm text-black">
                    Secure Connection
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={`${activePage}-${activePage === "chat" ? `${selectedConversation?.id ?? "new"}-${chatGeneration}` : "page"}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`flex min-h-0 w-full max-w-5xl flex-1 flex-col p-3 sm:p-5 lg:p-8 ${activePage === "chat" ? "overflow-hidden" : "overflow-y-auto"}`}
          >
            {activePage === "chat" ? (
              <ChatPage
                conversation={selectedConversation}
                onSaveConversation={persistConversation}
                onNewChat={() => setSelectedConversation(null)}
                userName={userName}
                responseStyle={preferences.responseStyle}
                saveHistory={preferences.saveHistory}
                userId={userId ?? 0}
              />
            ) : activePage === "history" ? (
              <HistoryPage
                onSelectConversation={(conversation) => {
                  setSelectedConversation(conversation);
                  setActivePage("chat");
                }}
                onNewChat={() => {
                  startNewChat();
                }}
              />
            ) : activePage === "settings" ? (
              <SettingsPage
                preferences={preferences}
                onSave={async (nextPreferences) => {
                  const saved = await saveUserPreferences(nextPreferences);
                  setPreferences(saved);
                }}
              />
            ) : (
              <ProfilePage
                onProfileUpdated={(user) => setUserName(user.name)}
              />
            )}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}
