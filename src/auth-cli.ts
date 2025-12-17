#!/usr/bin/env bun
import { runAuthFlow } from './mail/gmail/auth';

async function main() {
  console.log('🔐 Zero Mail - Gmail Authentication\n');

  try {
    await runAuthFlow();
    console.log('\n✓ Authentication successful!');
    console.log('Tokens saved. You can now run: bun run dev --mode=gmail\n');
  } catch (err) {
    console.error('\n✗ Authentication failed:', err instanceof Error ? err.message : err);
    console.error('\nMake sure you have set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET');
    console.error('in your .env file or environment variables.\n');
    process.exit(1);
  }
}

main();

