import { useCallback, useState, useEffect, useRef } from "react";
import { Logo, PlusIcon } from "../../assets";
import DashBoardList from "./DashBoardList";
import History from "./History";
import Profile from "./Profile";
import type { DashboardPage } from "./types";
import type { Conversation } from "./chatTypes";

const MIN_WIDTH = 72;
const MAX_WIDTH = 500;
const COLLAPSED_BREAKPOINT = 240;

type SidebarProps = {
  activePage: DashboardPage;
  onPageChange: (page: DashboardPage) => void;
  onNewChat: () => void;
  onSelectConversation: (conversation: Conversation) => void;
  historyRefreshKey: string | undefined;
  userName: string;
};

const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onPageChange,
  onNewChat,
  onSelectConversation,
  historyRefreshKey,
  userName,
}) => {
  const [width, setWidth] = useState(() =>
    window.innerWidth < 640 ? MIN_WIDTH : window.innerWidth < 1024 ? 256 : 280,
  );
  const [resizing, setResizing] = useState(false);
  const isResizing = useRef(false);
  const isCollapsed = width <= COLLAPSED_BREAKPOINT;

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing.current) return;
    const viewportMax = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, window.innerWidth - 120),
    );
    const newWidth = Math.min(viewportMax, Math.max(MIN_WIDTH, e.clientX));
    setWidth(newWidth);
  }, []);

  const onWindowResize = useCallback(() => {
    if (window.innerWidth < 640) {
      setWidth(MIN_WIDTH);
      return;
    }
    const viewportMax = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, window.innerWidth - 120),
    );
    setWidth((current) => Math.min(current, viewportMax));
  }, []);

  const stopResizing = useCallback(() => {
    isResizing.current = false;
    setResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  useEffect(() => {
    window.addEventListener("pointermove", onMouseMove);
    window.addEventListener("pointerup", stopResizing);
    window.addEventListener("pointercancel", stopResizing);
    window.addEventListener("resize", onWindowResize);
    return () => {
      window.removeEventListener("pointermove", onMouseMove);
      window.removeEventListener("pointerup", stopResizing);
      window.removeEventListener("pointercancel", stopResizing);
      window.removeEventListener("resize", onWindowResize);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [onMouseMove, onWindowResize, stopResizing]);

  const startResizing = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    isResizing.current = true;
    setResizing(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  const resizeWithKeyboard = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const viewportMax = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, window.innerWidth - 120),
      );
      setWidth((current) =>
        Math.min(
          viewportMax,
          Math.max(
            MIN_WIDTH,
            current + (event.key === "ArrowRight" ? 16 : -16),
          ),
        ),
      );
    }
    if (event.key === "Home") setWidth(MIN_WIDTH);
    if (event.key === "End")
      setWidth(
        Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, window.innerWidth - 120)),
      );
  };

  return (
    <aside
      className="relative h-dvh shrink-0 overflow-hidden border-r border-FormBg bg-white"
      style={{
        width,
        transition: resizing
          ? "none"
          : "width 180ms cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      <div
        className={`flex h-full min-h-0 flex-col overflow-y-auto ${isCollapsed ? "items-center gap-6 px-1 py-4" : "items-stretch gap-8 px-4 py-4"}`}
      >
        <header className="w-full">
          <div
            className={`flex min-h-10 items-center ${isCollapsed ? "justify-between" : "gap-2"}`}
          >
            <img
              src={Logo}
              alt="MediAI"
              className={`shrink-0 ${isCollapsed ? "h-6 w-7" : "h-8 w-9"}`}
            />
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <h2 className="truncate font-Inter text-[22px] font-semibold leading-7 text-Black">
                  Medi<span className="text-TextColor">AI</span>
                </h2>
                <span className="block truncate font-Inter text-xs font-medium text-black">
                  AI Health assistant
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() =>
                setWidth(
                  isCollapsed
                    ? Math.max(
                        MIN_WIDTH,
                        Math.min(256, window.innerWidth - 120),
                      )
                    : MIN_WIDTH,
                )
              }
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="grid size-6 shrink-0 cursor-pointer place-items-center rounded-md border-0 bg-transparent text-lg text-[#52645c] hover:bg-ButtonBg2"
            >
              <span aria-hidden="true">{isCollapsed ? "›" : "‹"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onNewChat}
            title={isCollapsed ? "New Chat" : undefined}
            aria-label="New Chat"
            className={`mt-6 flex h-10 w-full cursor-pointer items-center rounded-lg bg-TextColor text-white transition-colors hover:bg-emerald-800 ${isCollapsed ? "justify-center px-0" : "justify-center gap-2 px-4"}`}
          >
            <img src={PlusIcon} alt="" className="h-5 w-5 shrink-0" />
            {!isCollapsed && (
              <span className="font-Inter text-sm font-medium">New Chat</span>
            )}
          </button>
        </header>

        <DashBoardList
          activePage={activePage}
          collapsed={isCollapsed}
          onPageChange={onPageChange}
        />
        <History
          activePage={activePage}
          collapsed={isCollapsed}
          onPageChange={onPageChange}
          onSelectConversation={onSelectConversation}
          refreshKey={historyRefreshKey}
        />
        <div className="mt-auto w-full border-t border-BorderColor pt-3">
          <Profile
            activePage={activePage}
            collapsed={isCollapsed}
            onPageChange={onPageChange}
            userName={userName}
          />
        </div>
      </div>

      <div
        className={`absolute inset-y-0 right-0 z-10 w-2 cursor-col-resize touch-none transition-colors ${resizing ? "bg-TextColor/20" : "hover:bg-TextColor/15"}`}
        onPointerDown={startResizing}
        role="separator"
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={MAX_WIDTH}
        aria-valuenow={width}
        tabIndex={0}
        onKeyDown={resizeWithKeyboard}
      />
    </aside>
  );
};

export default Sidebar;
