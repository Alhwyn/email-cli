import React, { useState } from 'react';
import { Box, useApp } from 'ink';
import type { MailClient } from '../mail/MailClient';
import { InboxScreen } from './screens/InboxScreen';
import { MessageScreen } from './screens/MessageScreen';
import { ComposeScreen } from './screens/ComposeScreen';

interface AppProps {
  mailClient: MailClient;
}

type Screen = 
  | { type: 'inbox' }
  | { type: 'message'; messageId: string }
  | { type: 'compose' };

export const App: React.FC<AppProps> = ({ mailClient }) => {
  const { exit } = useApp();
  const [screen, setScreen] = useState<Screen>({ type: 'inbox' });

  const handleQuit = () => {
    exit();
  };

  const handleOpenMessage = (messageId: string) => {
    setScreen({ type: 'message', messageId });
  };

  const handleCompose = () => {
    setScreen({ type: 'compose' });
  };

  const handleBackToInbox = () => {
    setScreen({ type: 'inbox' });
  };

  const handleSent = () => {
    setScreen({ type: 'inbox' });
  };

  return (
    <Box flexDirection="column" height="100%">
      {screen.type === 'inbox' && (
        <InboxScreen
          mailClient={mailClient}
          onOpenMessage={handleOpenMessage}
          onCompose={handleCompose}
          onQuit={handleQuit}
        />
      )}

      {screen.type === 'message' && (
        <MessageScreen
          mailClient={mailClient}
          messageId={screen.messageId}
          onBack={handleBackToInbox}
          onCompose={handleCompose}
          onQuit={handleQuit}
        />
      )}

      {screen.type === 'compose' && (
        <ComposeScreen
          mailClient={mailClient}
          onCancel={handleBackToInbox}
          onSent={handleSent}
          onQuit={handleQuit}
        />
      )}
    </Box>
  );
};

