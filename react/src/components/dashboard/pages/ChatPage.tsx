import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sendChatMessage } from "../chatApi";
import type {
  ChatMessage,
  Conversation,
  SaveConversationInput,
} from "../chatTypes";
import type { UserPreferences } from "../../../auth";
import { Logo } from "../../../assets";

type ChatPageProps = {
  conversation: Conversation | null;
  onSaveConversation: (input: SaveConversationInput) => Promise<number>;
  onNewChat: () => void;
  userName: string;
  userId: number;
  responseStyle: UserPreferences["responseStyle"];
  saveHistory: boolean;
};

type ChatSessionSnapshot = {
  userId: number;
  conversationId: number | null;
  messages: ChatMessage[];
  draft: string;
  conversationStartedAt: string | null;
};

function readChatSession(userId: number): ChatSessionSnapshot | null {
  try {
    const value = sessionStorage.getItem(`mediai-chat-session:${userId}`);
    if (!value) return null;
    const parsed = JSON.parse(value) as Partial<ChatSessionSnapshot>;
    if (
      parsed.userId !== userId ||
      !Array.isArray(parsed.messages) ||
      typeof parsed.draft !== "string"
    ) {
      return null;
    }
    return {
      userId,
      conversationId:
        typeof parsed.conversationId === "number"
          ? parsed.conversationId
          : null,
      messages: parsed.messages.filter(
        (message): message is ChatMessage =>
          typeof message === "object" &&
          message !== null &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string",
      ),
      draft: parsed.draft,
      conversationStartedAt:
        typeof parsed.conversationStartedAt === "string"
          ? parsed.conversationStartedAt
          : null,
    };
  } catch {
    return null;
  }
}

const suggestions = [
  "What can help me sleep better?",
  "Help me understand a health report",
  "How can I build a balanced routine?",
];

function conversationTitle(messages: ChatMessage[]) {
  const firstMessage =
    messages.find((message) => message.role === "user")?.content ??
    "New conversation";
  return firstMessage.length > 54
    ? `${firstMessage.slice(0, 51).trimEnd()}...`
    : firstMessage;
}

function formatConversationDay(value: string) {
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return "Conversation started";
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatMessageTime(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function ChatPage({
  conversation,
  onSaveConversation,
  userName,
  userId,
  responseStyle,
  saveHistory,
}: ChatPageProps) {
  const [storedSession] = useState(() => readChatSession(userId));
  const sessionMatchesConversation =
    storedSession?.conversationId === (conversation?.id ?? null);
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    sessionMatchesConversation
      ? storedSession.messages
      : (conversation?.messages ?? []),
  );
  const [conversationId, setConversationId] = useState<number | undefined>(
    conversation?.id,
  );
  const [conversationStartedAt, setConversationStartedAt] = useState(
    (sessionMatchesConversation ? storedSession.conversationStartedAt : null) ??
      conversation?.createdAt ??
      conversation?.messages[0]?.createdAt ??
      null,
  );
  const [draft, setDraft] = useState(() =>
    sessionMatchesConversation ? storedSession.draft : "",
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesContainer = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const userInitial = userName.trim().charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const container = messagesContainer.current;
    container?.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const snapshot: ChatSessionSnapshot = {
      userId,
      conversationId: conversationId ?? null,
      messages,
      draft,
      conversationStartedAt,
    };
    try {
      sessionStorage.setItem(
        `mediai-chat-session:${userId}`,
        JSON.stringify(snapshot),
      );
    } catch {
      // The current conversation remains available for this render.
    }
  }, [conversationId, conversationStartedAt, draft, messages, userId]);

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if ((!content && !selectedFile) || loading) return;

    const priorMessages = messages;
    const messageTime = new Date().toISOString();
    if (!conversationStartedAt) setConversationStartedAt(messageTime);
    const attachmentText = selectedFile
      ? `[Attachment: ${selectedFile.name}]`
      : "";
    const userMessage: ChatMessage = {
      role: "user",
      content:
        [content, attachmentText].filter(Boolean).join("\n\n") ||
        "Review this attachment.",
      createdAt: messageTime,
    };
    setMessages([...priorMessages, userMessage]);
    setDraft("");
    setError("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(
        content,
        priorMessages,
        selectedFile,
        responseStyle,
      );
      setSelectedFile(null);
      if (fileInput.current) fileInput.current.value = "";
      const nextMessages: ChatMessage[] = [
        ...priorMessages,
        userMessage,
        {
          role: "assistant",
          content: reply,
          createdAt: new Date().toISOString(),
        },
      ];
      setMessages(nextMessages);
      if (saveHistory) {
        try {
          const id = await onSaveConversation({
            id: conversationId,
            title: conversationTitle(nextMessages),
            messages: nextMessages,
          });
          setConversationId(id);
        } catch (reason) {
          setError(
            `Reply received, but it could not be saved to history. ${reason instanceof Error ? reason.message : "Please try again later."}`,
          );
        }
      }
    } catch (reason) {
      setMessages(priorMessages);
      setDraft(content);
      setError(
        reason instanceof Error
          ? reason.message
          : "The message could not be sent. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Files must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }
    setError("");
    setSelectedFile(file);
  }

  function handleComposerKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <section
      className="flex h-full min-h-0 w-full flex-1 flex-col text-[#1c302d]"
      aria-label="MediAI conversation"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          ref={messagesContainer}
          className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto overscroll-contain scroll-smooth"
          role="log"
          aria-live="polite"
          aria-relevant="additions text"
        >
          {messages.length > 0 && conversationStartedAt && (
            <div className="sticky top-0 z-10 flex justify-center py-1">
              <span className="rounded-full border border-[#dce7e1] bg-white/95 px-3 py-1 text-[11px] font-medium text-[#687b75] shadow-sm">
                {formatConversationDay(conversationStartedAt)}
              </span>
            </div>
          )}
          {messages.length === 0 ? (
            <motion.div
              className="flex min-h-90 flex-1 flex-col items-center justify-center text-center max-sm:min-h-75"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                className="grid size-12 place-items-center rounded-[15px] border border-[#b9ded0] bg-SoftGreen text-[25px] text-[#087e68] motion-safe:animate-spin motion-reduce:animate-none [animation-duration:12s]"
                aria-hidden="true"
              >
                <img src={Logo} alt="" />
              </div>
              <h2 className="mb-1 mt-4.5 text-[22px] font-semibold max-sm:text-[19px]">
                A little more clarity starts here.
              </h2>
              <p className="m-0 text-sm text-[#687b75] max-sm:max-w-75 max-sm:leading-6">
                Ask a question, talk through a concern, or find a healthier next
                step.
              </p>
              <div className="mt-7 flex w-full max-w-155 flex-wrap justify-center gap-2 max-sm:flex-col">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    type="button"
                    className="flex cursor-pointer items-center justify-between gap-2.5 rounded-md border border-[#dce8e1] bg-white/85 px-3 py-2.5 text-left text-xs text-[#476158] transition hover:-translate-y-0.5 hover:border-[#9bc9b7] hover:bg-[#f4faf6]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.07 }}
                    onClick={() => setDraft(suggestion)}
                  >
                    {suggestion}
                    <span className="text-[#087e68]" aria-hidden="true">
                      ↗
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.article
                  key={`${index}-${message.role}`}
                  className={`flex max-w-[86%] items-start gap-2.5 max-sm:max-w-[96%] ${message.role === "user" ? "self-end" : "self-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  {message.role === "assistant" && (
                    <span
                      className="grid size-7.75 shrink-0 place-items-center rounded-[9px] bg-[#e5f4ed] text-base text-[#087e68]"
                      aria-hidden="true"
                    >
                      <img src={Logo} alt="" className="w-4 h-4" />
                    </span>
                  )}
                  <div
                    className={`flex min-w-0 flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`wrap-anywhere whitespace-pre-wrap rounded-[13px] border px-4 py-3 text-sm leading-[1.65] shadow-[0_4px_16px_rgba(31,72,59,0.035)] ${message.role === "user" ? "rounded-tr-sm border-[#087e68] bg-[#087e68] text-white" : "rounded-tl-sm border-[#e1eae5] bg-white text-[#334741]"}`}
                    >
                      {message.content}
                    </div>
                    {formatMessageTime(message.createdAt) && (
                      <time
                        className="mt-1 px-1 text-[10px] text-[#83928c]"
                        dateTime={message.createdAt}
                      >
                        {formatMessageTime(message.createdAt)}
                      </time>
                    )}
                  </div>
                  {message.role === "user" && (
                    <span
                      className="grid size-7.25 shrink-0 place-items-center rounded-full border border-[#b9ded0] bg-[#e9f6ef] text-xs font-semibold text-[#087e68]"
                      role="img"
                      aria-label={`${userName} profile picture`}
                    >
                      {userInitial}
                    </span>
                  )}
                </motion.article>
              ))}
            </AnimatePresence>
          )}
          {loading && (
            <motion.div
              className="flex max-w-[86%] items-start gap-2.5 self-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span
                className="grid size-7.25 shrink-0 place-items-center rounded-[9px] bg-[#e5f4ed] text-base text-[#087e68]"
                aria-hidden="true"
              >
                <img src={Logo} alt="" className="w-4 h-4" />
              </span>
              <div
                className="flex min-h-10.75 items-center gap-1 rounded-r-[13px] rounded-bl-[13px] rounded-tl-sm border border-[#e1eae5] bg-white px-3.5"
                aria-label="MediAI is thinking"
              >
                <span className="size-1.25 animate-bounce rounded-full bg-[#49a88c] motion-reduce:animate-none" />
                <span className="size-1.25 animate-bounce rounded-full bg-[#49a88c] motion-reduce:animate-none [animation-delay:130ms]" />
                <span className="size-1.25 animate-bounce rounded-full bg-[#49a88c] motion-reduce:animate-none [animation-delay:260ms]" />
                <small className="ml-1.5 text-[11px] text-[#687b75]">
                  Thinking
                </small>
              </div>
            </motion.div>
          )}
        </div>

        <form
          className="mx-4.5 mb-4.5 mt-3 shrink-0 rounded-lg border border-[#d7e4dd] bg-white px-3 py-2.5 shadow-[0_7px_20px_rgba(32,72,58,0.06)] max-sm:mx-2.5 max-sm:mb-2.5"
          onSubmit={submitMessage}
        >
          {error && (
            <p className="mb-2 text-xs text-[#a13d37]" role="alert">
              {error}
            </p>
          )}
          <label className="sr-only" htmlFor="chat-message">
            Message MediAI
          </label>
          {selectedFile && (
            <div className="mb-2 flex min-w-0 items-center gap-2 rounded-md bg-[#f2f8f4] px-2.5 py-1.5 text-xs text-[#476158]">
              <span className="truncate">{selectedFile.name}</span>
              <button
                className="ml-auto shrink-0 cursor-pointer border-0 bg-transparent px-1 text-base text-[#687b75] hover:text-[#a13d37]"
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInput.current) fileInput.current.value = "";
                }}
                aria-label="Remove attachment"
                title="Remove attachment"
              >
                ×
              </button>
            </div>
          )}
          <textarea
            className="block h-12 max-h-12 min-w-0 w-full resize-none overflow-y-auto border-0 bg-transparent text-sm leading-6 text-[#1c302d] outline-none placeholder:text-[#8b9a94]"
            id="chat-message"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={handleComposerKeyDown}
            placeholder="Write your message..."
            rows={2}
            maxLength={4000}
            disabled={loading}
          />
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex min-w-0 items-center gap-2">
              <input
                ref={fileInput}
                className="hidden"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,application/pdf,text/plain,.doc,.docx"
                onChange={handleFileChange}
                disabled={loading}
                aria-label="Choose an image or document"
              />
              <button
                className="grid size-8.5 shrink-0 cursor-pointer place-items-center rounded-md border border-[#dce7e1] bg-white text-xl text-[#476158] transition hover:border-[#96c5b5] hover:bg-[#f4faf6] disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={loading}
                aria-label="Attach an image or document"
                title="Attach image or document (up to 5 MB)"
              >
                <span aria-hidden="true">＋</span>
              </button>
              <span className="hidden truncate text-[10px] text-[#83928c] sm:inline">
                General information, not a diagnosis.
              </span>
            </div>
            <button
              className="grid size-8.5 cursor-pointer place-items-center rounded-md border-0 bg-[#087e68] text-[22px] text-white transition hover:-translate-y-px hover:bg-[#066b59] disabled:cursor-not-allowed disabled:bg-[#b7cec5]"
              type="submit"
              disabled={(!draft.trim() && !selectedFile) || loading}
              aria-label="Send message"
              title="Send message"
            >
              <span aria-hidden="true">↑</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
