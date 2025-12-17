import type { MailClient } from '../MailClient';
import type { EmailMessage, EmailToSend, InboxListResult } from '../types';

export class MockMailClient implements MailClient {
  private messages: EmailMessage[] = [
    {
      id: '1',
      threadId: 't1',
      from: 'alice@example.com',
      to: 'you@example.com',
      subject: 'Welcome to Zero Mail!',
      snippet: 'This is a mock email to help you test the interface...',
      body: 'This is a mock email to help you test the interface. Everything works!\n\nYou can navigate with arrow keys, press Enter to view messages, and press S to compose.\n\nEnjoy!',
      date: new Date('2024-01-15T10:30:00Z'),
      isRead: false,
    },
    {
      id: '2',
      threadId: 't2',
      from: 'bob@example.com',
      to: 'you@example.com',
      subject: 'Re: Project Update',
      snippet: 'Thanks for the update! The new features look great...',
      body: 'Thanks for the update! The new features look great.\n\nI reviewed the code and everything looks solid. Let\'s schedule a demo for next week.\n\nBest,\nBob',
      date: new Date('2024-01-14T15:45:00Z'),
      isRead: true,
    },
    {
      id: '3',
      threadId: 't3',
      from: 'notifications@github.com',
      to: 'you@example.com',
      subject: '[GitHub] New pull request',
      snippet: 'A new pull request has been opened in your repository...',
      body: 'A new pull request has been opened in your repository.\n\nPR #42: Add dark mode support\n\nReview it at: https://github.com/...',
      date: new Date('2024-01-13T09:15:00Z'),
      isRead: true,
    },
    {
      id: '4',
      threadId: 't4',
      from: 'team@company.com',
      to: 'you@example.com',
      subject: 'Team Meeting - Tomorrow 2pm',
      snippet: 'Quick reminder about our team sync tomorrow...',
      body: 'Quick reminder about our team sync tomorrow at 2pm.\n\nAgenda:\n- Sprint review\n- Planning next quarter\n- Q&A\n\nSee you there!',
      date: new Date('2024-01-12T16:20:00Z'),
      isRead: false,
    },
  ];

  private sentMessages: EmailToSend[] = [];

  async listInbox(maxResults = 50): Promise<InboxListResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    return {
      messages: this.messages.slice(0, maxResults),
    };
  }

  async getMessage(id: string): Promise<EmailMessage> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    const message = this.messages.find((m) => m.id === id);
    if (!message) {
      throw new Error(`Message ${id} not found`);
    }
    return message;
  }

  async send(email: EmailToSend): Promise<void> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    this.sentMessages.push(email);
    
    // Add sent message to inbox for demo purposes
    this.messages.unshift({
      id: `sent-${Date.now()}`,
      threadId: `t-${Date.now()}`,
      from: 'you@example.com',
      to: email.to,
      subject: email.subject,
      snippet: email.body.substring(0, 100),
      body: email.body,
      date: new Date(),
      isRead: true,
    });
  }
}

