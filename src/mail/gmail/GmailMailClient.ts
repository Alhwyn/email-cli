import { google } from 'googleapis';
import type { MailClient } from '../MailClient';
import type { EmailMessage, EmailToSend, InboxListResult } from '../types';
import { getAuthenticatedClient } from './auth';

export class GmailMailClient implements MailClient {
  private gmail: ReturnType<typeof google.gmail>;

  private constructor(gmail: ReturnType<typeof google.gmail>) {
    this.gmail = gmail;
  }

  static async create(): Promise<GmailMailClient> {
    const auth = await getAuthenticatedClient();
    const gmail = google.gmail({ version: 'v1', auth });
    return new GmailMailClient(gmail);
  }

  async listInbox(maxResults = 50): Promise<InboxListResult> {
    const response = await this.gmail.users.messages.list({
      userId: 'me',
      maxResults,
      labelIds: ['INBOX'],
    });

    const messages: EmailMessage[] = [];

    if (response.data.messages) {
      for (const msg of response.data.messages) {
        if (msg.id) {
          const fullMessage = await this.getMessage(msg.id);
          messages.push(fullMessage);
        }
      }
    }

    return {
      messages,
      nextPageToken: response.data.nextPageToken || undefined,
    };
  }

  async getMessage(id: string): Promise<EmailMessage> {
    const response = await this.gmail.users.messages.get({
      userId: 'me',
      id,
      format: 'full',
    });

    const msg = response.data;
    const headers = msg.payload?.headers || [];

    const getHeader = (name: string): string => {
      const header = headers.find((h) => h.name?.toLowerCase() === name.toLowerCase());
      return header?.value || '';
    };

    const from = getHeader('From');
    const to = getHeader('To');
    const subject = getHeader('Subject');
    const dateStr = getHeader('Date');

    // Parse body
    let body = '';
    if (msg.payload?.parts) {
      // Multipart message
      const textPart = msg.payload.parts.find((p) => p.mimeType === 'text/plain');
      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString('utf-8');
      }
    } else if (msg.payload?.body?.data) {
      // Simple message
      body = Buffer.from(msg.payload.body.data, 'base64').toString('utf-8');
    }

    const isRead = !msg.labelIds?.includes('UNREAD');

    return {
      id: msg.id!,
      threadId: msg.threadId!,
      from,
      to,
      subject,
      snippet: msg.snippet || '',
      body,
      date: dateStr ? new Date(dateStr) : new Date(),
      isRead,
    };
  }

  async send(email: EmailToSend): Promise<void> {
    const message = [
      'Content-Type: text/plain; charset="UTF-8"',
      'MIME-Version: 1.0',
      `To: ${email.to}`,
      `Subject: ${email.subject}`,
      '',
      email.body,
    ].join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await this.gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });
  }
}

