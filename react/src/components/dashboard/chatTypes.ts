export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

export type Conversation = {
  id: number;
  title: string;
  messages: ChatMessage[];
  createdAt?: string;
  updatedAt: string;
};

export type SaveConversationInput = {
  id?: number;
  title: string;
  messages: ChatMessage[];
};