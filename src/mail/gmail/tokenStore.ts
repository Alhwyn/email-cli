import { join } from 'path';
import { homedir } from 'os';
import { mkdir, readFile, writeFile } from 'fs/promises';

export interface TokenData {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
}

const CONFIG_DIR = join(homedir(), '.config', 'zero-mail-pro');
const TOKEN_FILE = join(CONFIG_DIR, 'gmail-tokens.json');

export async function saveTokens(tokens: TokenData): Promise<void> {
  await mkdir(CONFIG_DIR, { recursive: true });
  await writeFile(TOKEN_FILE, JSON.stringify(tokens, null, 2), 'utf-8');
}

export async function loadTokens(): Promise<TokenData | null> {
  try {
    const content = await readFile(TOKEN_FILE, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
}

export async function clearTokens(): Promise<void> {
  try {
    await Bun.write(TOKEN_FILE, '');
  } catch (err) {
    // Ignore if file doesn't exist
  }
}

