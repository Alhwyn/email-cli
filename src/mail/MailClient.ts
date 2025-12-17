import type { EmailMessage, EmailToSend, InboxListResult } from './types';

export interface MailClient {
  listInbox(maxResults?: number): Promise<InboxListResult>;
  getMessage(id: string): Promise<EmailMessage>;
  send(email: EmailToSend): Promise<void>;
}

