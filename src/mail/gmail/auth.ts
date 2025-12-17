import { google } from 'googleapis';
import open from 'open';
import { saveTokens, loadTokens, type TokenData } from './tokenStore';

const SCOPES = ['https://www.googleapis.com/auth/gmail.modify'];
const REDIRECT_URI = 'http://localhost:3000/oauth2callback';

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
}

export function getOAuthConfig(): OAuthConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Missing Gmail credentials. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.'
    );
  }

  return { clientId, clientSecret };
}

export async function getAuthenticatedClient() {
  const config = getOAuthConfig();
  const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    REDIRECT_URI
  );

  // Try to load existing tokens
  const tokens = await loadTokens();
  if (tokens) {
    oauth2Client.setCredentials(tokens);
    return oauth2Client;
  }

  throw new Error(
    'No stored credentials found. Run "bun run auth" to authenticate with Gmail.'
  );
}

export async function runAuthFlow(): Promise<void> {
  const config = getOAuthConfig();
  const oauth2Client = new google.auth.OAuth2(
    config.clientId,
    config.clientSecret,
    REDIRECT_URI
  );

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Opening browser for authentication...');
  console.log('If browser does not open, visit this URL:\n');
  console.log(authUrl);
  console.log('');

  await open(authUrl);

  // Start a simple HTTP server to receive the callback
  const server = Bun.serve({
    port: 3000,
    async fetch(req) {
      const url = new URL(req.url);
      
      if (url.pathname === '/oauth2callback') {
        const code = url.searchParams.get('code');
        
        if (!code) {
          return new Response('No code received', { status: 400 });
        }

        try {
          const { tokens } = await oauth2Client.getToken(code);
          await saveTokens(tokens as TokenData);
          
          server.stop();
          
          return new Response(`
            <html>
              <body>
                <h1>✓ Authentication successful!</h1>
                <p>You can close this window and return to the terminal.</p>
              </body>
            </html>
          `, {
            headers: { 'Content-Type': 'text/html' },
          });
        } catch (err) {
          console.error('Token exchange error:', err);
          return new Response('Authentication failed', { status: 500 });
        }
      }

      return new Response('Not found', { status: 404 });
    },
  });

  console.log('Waiting for authentication callback...');
}

