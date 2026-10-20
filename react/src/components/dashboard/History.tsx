import React, { useEffect, useState } from "react";
import { Clipboard } from "../../assets";
import type { DashboardPage } from "./types";
import { getConversation, listConversations } from "./chatApi";
import type { Conversation } from "./chatTypes";

type HistoryProps = {
  activePage: DashboardPage;
  collapsed: boolean;
  onPageChange: (page: DashboardPage) => void;
  onSelectConversation: (conversation: Conversation) => void;
  refreshKey: string | undefined;
};

const History: React.FC<HistoryProps> = ({
  activePage,
  collapsed,
  onPageChange,
  onSelectConversation,
  refreshKey,
}) => {
  const isActive = activePage === "history";
  const [conversations, setConversations] = useState<
    Pick<Conversation, "id" | "title" | "updatedAt">[]
  >([]);
  const [openingId, setOpeningId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    listConversations()
      .then((items) => {
        if (isMounted) setConversations(items.slice(0, 5));
      })
      .catch(() => {
        if (isMounted) setConversations([]);
      });
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  async function openConversation(id: number) {
    setOpeningId(id);
    setError("");
    try {
      onSelectConversation(await getConversation(id));
    } catch {
      setError("Could not open this conversation. Please try again.");
    } finally {
      setOpeningId(null);
    }
  }

  function formatDate(value: string) {
    const date = new Date(value.replace(" ", "T"));
    if (Number.isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
    }).format(date);
  }

  return (
    <section className="w-full">
      {collapsed ? (
        <button
          type="button"
          onClick={() => onPageChange("history")}
          aria-label="View all conversation history"
          aria-current={isActive ? "page" : undefined}
          title="History"
          className={`flex h-10 w-full cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 ${isActive ? "bg-ButtonBg2 text-TextColor" : "text-black hover:bg-ButtonBg2 hover:text-TextColor"}`}
        >
          <span
            aria-hidden="true"
            className="h-5 w-5 bg-current"
            style={{
              maskImage: `url("${Clipboard}")`,
              maskPosition: "center",
              maskRepeat: "no-repeat",
              maskSize: "contain",
              WebkitMaskImage: `url("${Clipboard}")`,
              WebkitMaskPosition: "center",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskSize: "contain",
            }}
          />
        </button>
      ) : (
        <div className="w-full min-w-0">
          <div className="flex w-full items-center justify-between gap-2">
            <h2 className="truncate font-Inter text-[13px] font-medium text-black">
              Recent Conversations
            </h2>
            <button
              type="button"
              onClick={() => onPageChange("history")}
              aria-current={isActive ? "page" : undefined}
              className={`shrink-0 cursor-pointer rounded px-2 py-1 font-Inter text-[11px] transition-colors ${isActive ? "text-TextColor" : "text-Black hover:text-TextColor"}`}
            >
              View all
            </button>
          </div>
          <div className="mt-2 flex max-h-48 flex-col overflow-y-auto">
            {error && (
              <p className="px-2 py-1 text-[11px] text-red-700" role="alert">
                {error}
              </p>
            )}
            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => void openConversation(conversation.id)}
                disabled={openingId !== null}
                title={conversation.title}
                className="flex min-w-0 cursor-pointer flex-row items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left transition hover:bg-ButtonBg2 disabled:cursor-wait"
              >
                <div>
                  <span className="max-w-full truncate font-Inter text-xs leading-5 font-medium text-Black">
                    {conversation.title}
                  </span>
                </div>

                <div>
                  <time
                    className="font-Inter text-[11px] text-Grey flex flex-row w-full"
                    dateTime={conversation.updatedAt}
                  >
                    {openingId === conversation.id
                      ? "Opening..."
                      : formatDate(conversation.updatedAt)}
                  </time>
                </div>
              </button>
            ))}
            {conversations.length === 0 && (
              <span className="px-2 py-2 font-Inter text-[11px] text-Grey">
                No conversations yet
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default History;
