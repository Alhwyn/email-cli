export interface EmailMessage {
  id: string;
  threadId: string;
  from: string;
  to: string;
  subject: string;
  snippet: string;
  body: string;
  date: Date;
  isRead: boolean;
}

export interface EmailToSend {
  to: string;
  subject: string;
  body: string;
}

export interface InboxListResult {
  messages: EmailMessage[];
  nextPageToken?: string;
}

