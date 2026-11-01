import type { ChatMessage, Conversation, SaveConversationInput } from "./chatTypes";

const apiBaseUrl = (import.meta.env.VITE_PHP_API_URL || "http://localhost:8083").replace(/\/$/, "");

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBaseUrl}/${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
  });
  const result = await response.json() as T & { error?: string; reply?: string };

  if (!response.ok) {
    throw new Error(result.reply || result.error || "The request could not be completed.");
  }

  return result;
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  file?: File | null,
  responseStyle: "concise" | "balanced" | "detailed" = "balanced",
): Promise<string> {
  const body = new FormData();
  body.append("message", message);
  body.append("history", JSON.stringify(history));
  body.append("responseStyle", responseStyle);
  if (file) body.append("file", file);

  const result = await request<{ reply?: string; error?: string }>("api.php", {
    method: "POST",
    body,
  });
  if (!result.reply) throw new Error(result.error || "The assistant returned an empty reply.");

  return result.reply.replace(/\r\n?/g, "\n").trim();
}

export async function listConversations(): Promise<Pick<Conversation, "id" | "title" | "updatedAt">[]> {
  const result = await request<{ conversations: Pick<Conversation, "id" | "title" | "updatedAt">[] }>("history.php");
  return result.conversations;
}

export async function getConversation(id: number): Promise<Conversation> {
  const result = await request<{ conversation: Conversation }>(`history.php?id=${id}`);
  return result.conversation;
}

export async function deleteConversation(id: number): Promise<{ deleted: boolean }> {
  return request<{ deleted: boolean }>(`history.php?id=${id}`, {
    method: "DELETE",
  });
}

export async function saveConversation(input: SaveConversationInput): Promise<{ id: number }> {
  return request<{ id: number }>("history.php", {
    method: "POST",
    body: JSON.stringify(input),
  });
}