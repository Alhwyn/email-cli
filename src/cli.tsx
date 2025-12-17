#!/usr/bin/env bun
import React from 'react';
import { render } from 'ink';
import { App } from './app/App';
import { MockMailClient } from './mail/mock/MockMailClient';
import { GmailMailClient } from './mail/gmail/GmailMailClient';
import type { MailClient } from './mail/MailClient';

// Parse command line arguments
const args = process.argv.slice(2);
const modeArg = args.find((arg) => arg.startsWith('--mode='));
const mode = modeArg ? modeArg.split('=')[1] : 'mock';

async function main() {
  let mailClient: MailClient;

  if (mode === 'gmail') {
    try {
      mailClient = await GmailMailClient.create();
      console.log('✓ Connected to Gmail\n');
    } catch (err) {
      console.error('Failed to connect to Gmail:', err instanceof Error ? err.message : err);
      console.error('\nTo use Gmail mode:');
      console.error('1. Create OAuth credentials at https://console.cloud.google.com');
      console.error('2. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
      console.error('3. Run: bun run auth');
      console.error('4. Then run: bun run dev --mode=gmail\n');
      process.exit(1);
    }
  } else {
    mailClient = new MockMailClient();
    console.log('📬 Running in MOCK mode (using demo data)\n');
  }

  render(<App mailClient={mailClient} />);
}

main();

