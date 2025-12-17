# 📬 Zero Mail Pro

A fast, keyboard-driven terminal email client built with Ink, TypeScript, and Bun.

## Features

- 🎯 **Keyboard-first interface** - navigate with arrow keys, vim-like shortcuts
- 📧 **Gmail integration** - full OAuth 2.0 support with token storage
- 🎭 **Mock mode** - test the UI without Gmail credentials
- ⚡ **Fast** - built with Bun for maximum performance
- 🎨 **Clean TUI** - beautiful terminal interface powered by Ink

## Quick Start

### 1. Install dependencies

```bash
bun install
```

### 2. Run in mock mode (no setup required)

```bash
bun run dev
```

This runs the app with demo data so you can try the interface immediately.

### 3. Set up Gmail (optional)

To use your real Gmail account:

#### a) Create Google Cloud OAuth credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable the Gmail API
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose **Desktop app** as application type
6. Download the credentials

#### b) Configure environment variables

Copy `env.example` to `.env`:

```bash
cp env.example .env
```

Edit `.env` and add your credentials:

```
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### c) Authenticate

Run the auth command to authorize the app:

```bash
bun run auth
```

This will:
- Open your browser for Google authentication
- Save OAuth tokens to `~/.config/zero-mail-pro/gmail-tokens.json`

#### d) Run with Gmail

```bash
bun run dev --mode=gmail
```

## Keyboard Shortcuts

### Inbox Screen
- **↑/↓** - Navigate messages
- **Enter** - Open selected message
- **s** - Compose new email
- **r** - Refresh inbox
- **q** - Quit

### Message Screen
- **Esc / Backspace** - Back to inbox
- **s** - Compose new email
- **q** - Quit

### Compose Screen
- **Tab / Shift+Tab** - Switch between fields (To, Subject, Body)
- **Ctrl+S** - Send email
- **Esc** - Cancel and return to inbox
- **q** - Quit

## Project Structure

```
src/
├── cli.tsx                    # Main entry point
├── auth-cli.ts                # OAuth authentication command
├── app/
│   ├── App.tsx                # Main app component (state machine)
│   └── screens/
│       ├── InboxScreen.tsx    # Email list view
│       ├── MessageScreen.tsx  # Single email view
│       └── ComposeScreen.tsx  # Compose/send email
├── mail/
│   ├── types.ts               # Email type definitions
│   ├── MailClient.ts          # Mail client interface
│   ├── mock/
│   │   └── MockMailClient.ts  # Demo data implementation
│   └── gmail/
│       ├── GmailMailClient.ts # Gmail API implementation
│       ├── auth.ts            # OAuth flow
│       └── tokenStore.ts      # Token persistence
└── ui/
    └── KeyHints.tsx           # Keyboard hints footer
```

## Development

```bash
# Run in mock mode
bun run dev

# Run with Gmail
bun run dev --mode=gmail

# Re-authenticate Gmail
bun run auth

# Type checking
bun run tsc --noEmit
```

## Troubleshooting

### "No stored credentials found"

Run `bun run auth` to authenticate with Gmail.

### "Missing Gmail credentials"

Make sure you've set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`.

### OAuth consent screen errors

If you see OAuth errors, make sure:
1. Gmail API is enabled in Google Cloud Console
2. Your OAuth consent screen is configured
3. Your email is added as a test user (if app is not published)

## Tech Stack

- [Bun](https://bun.sh) - JavaScript runtime & package manager
- [Ink](https://github.com/vadimdemedes/ink) - React for CLI interfaces
- [Google APIs](https://github.com/googleapis/google-api-nodejs-client) - Gmail API client
- TypeScript - Type safety

## License

MIT
