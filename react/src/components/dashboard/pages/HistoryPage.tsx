import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getConversation, listConversations } from "../chatApi";
import type { Conversation } from "../chatTypes";
import { PlusIcon, Logo } from "../../../assets";

type HistoryItem = {
  id: number;
  title: string;
  updatedAt: string;
};

type HistoryPageProps = {
  onSelectConversation: (conversation: Conversation) => void;
  onNewChat: () => void;
};

function formatDate(value: string) {
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "Recently";
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    ...(isToday ? { hour: "numeric", minute: "2-digit" } : { year: "numeric" }),
  }).format(date);
}

export default function HistoryPage({
  onSelectConversation,
  onNewChat,
}: HistoryPageProps) {
  const [conversations, setConversations] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;
    listConversations()
      .then((items) => {
        if (isCurrent) setConversations(items);
      })
      .catch((reason: unknown) => {
        if (isCurrent)
          setError(
            reason instanceof Error
              ? reason.message
              : "Could not load conversation history.",
          );
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, []);

  async function openConversation(id: number) {
    setOpeningId(id);
    setError("");
    try {
      onSelectConversation(await getConversation(id));
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Could not open this conversation.",
      );
      setOpeningId(null);
    }
  }

  const filtered = conversations.filter((conversation) =>
    conversation.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <section
      className="mx-auto w-full max-w-230 text-[#1c302d]"
      aria-label="Conversation history"
    >
      <motion.header
        className="mb-7.5 mt-1 flex items-end justify-between gap-5 max-sm:items-start"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <p className="text-[10px] leading-7.5 font-Inter font-bold text-TextColor">
            YOUR SPACE
          </p>
          <h1 className="text-[20px] text-black font-Inter font-semibold leading-7.5 sm:text-[34px]">
            Conversation history
          </h1>
          <p className="font-Inter text-[14px] text-Grey font-medium leading-7.5">
            Pick up where you left off.
          </p>
        </div>
        <button
          type="button"
          onClick={onNewChat}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-md border border-TextColor bg-TextColor px-3 py-2 text-[13px] font-semibold text-white transition hover:-translate-y-px max-sm:px-2.5"
        >
          <img src={PlusIcon} alt="" />
          New chat
        </button>
      </motion.header>

      <div className="flex flex-wrap items-center gap-3.5 border-b border-[#dce7e1] pb-3">
        <label
          className="text-xs font-semibold text-[#425a52] max-sm:w-full"
          htmlFor="history-search"
        >
          Search conversations
        </label>
        <div className="flex h-9.25 w-full max-w-85 items-center gap-2 rounded-md border border-[#dce7e1] bg-white px-2.5 text-[#71847b] max-sm:max-w-full">
          <span className="text-[21px] leading-none" aria-hidden="true">
            ⌕
          </span>
          <input
            className="w-full border-0 bg-transparent text-xs text-[#1c302d] outline-none"
            id="history-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title"
          />
          {search && (
            <button
              className="cursor-pointer border-0 bg-transparent text-lg text-[#647870]"
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <span className="ml-auto text-[11px] text-[#71847b]">
          {conversations.length}{" "}
          {conversations.length === 1 ? "conversation" : "conversations"}
        </span>
      </div>

      {error && (
        <p
          className="border-l-[3px] border-[#c65b53] bg-[#fff5f3] px-3 py-2.5 text-xs text-[#98443e]"
          role="alert"
        >
          {error}
        </p>
      )}
      {loading ? (
        <div className="flex flex-col" aria-label="Loading conversations">
          {[0, 1, 2].map((item) => (
            <div
              className="h-19 animate-pulse border-b border-[#e7eeea] bg-linear-to-r from-transparent via-[#f0f5f2] to-transparent motion-reduce:animate-none"
              key={item}
            />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="flex flex-col" role="list">
          <AnimatePresence initial={false}>
            {filtered.map((conversation, index) => (
              <motion.button
                type="button"
                role="listitem"
                className="relative flex min-h-19 cursor-pointer items-center gap-3.5 border-0 border-b border-[#e7eeea] bg-transparent px-2.5 py-3 text-left transition hover:bg-[#f2f8f4] hover:px-3.5 disabled:cursor-wait max-sm:gap-2.5"
                key={conversation.id}
                onClick={() => openConversation(conversation.id)}
                disabled={openingId !== null}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ delay: index * 0.035, duration: 0.2 }}
              >
                <span
                  className="grid w-10 h-10 shrink-0 place-items-center rounded-[10px] bg-SoftGreen shadow-hard hover:motion-safe:animate-spin motion-reduce:animate-none [animation-duration:12s]"
                  aria-hidden="true"
                >
                  <img src={Logo} alt="" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-Inter font-semibold text-Black">
                    {conversation.title || "Untitled conversation"}
                  </strong>
                  <small className="text-[11px] text-[#87958f] font-Inter font-medium">
                    Open conversation
                  </small>
                </span>
                <time
                  className="shrink-0 text-[11px] text-[#71847b] font-Inter font-medium max-sm:text-[10px]"
                  dateTime={conversation.updatedAt}
                >
                  {formatDate(conversation.updatedAt)}
                </time>
                <span className="text-base text-[#087e68]" aria-hidden="true">
                  ↗
                </span>
                {openingId === conversation.id && (
                  <span className="absolute right-10 font-Inter font-medium text-[11px] text-[#087e68] max-sm:right-8">
                    Opening…
                  </span>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          className="flex min-h-77.5 flex-col items-center justify-center text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span
            className="grid w-10 h-10 shrink-0 place-items-center rounded-[10px] bg-SoftGreen shadow-hard hover:motion-safe:animate-spin motion-reduce:animate-none [animation-duration:12s]"
            aria-hidden="true"
          >
            <img src={Logo} alt="" />
          </span>
          <h2 className="mb-1 mt-3.75 text-[17px] font-Inter font-semibold">
            {search
              ? "No matches found"
              : "Your conversations will appear here"}
          </h2>
          <p className="m-0 text-xs text-[#687b75] font-Inter">
            {search
              ? "Try a different title or clear your search."
              : "Start a chat and you can return to it anytime."}
          </p>
          {!search && (
            <button
              className="mt-4.5 inline-flex cursor-pointer items-center gap-2 rounded-md border-0 bg-[#087e68] px-3 py-2 text-xs font-Inter font-semibold text-white"
              type="button"
              onClick={onNewChat}
            >
              Start a conversation <span aria-hidden="true">↗</span>
            </button>
          )}
        </motion.div>
      )}
    </section>
  );
}
