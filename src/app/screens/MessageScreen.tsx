import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { MailClient } from '../../mail/MailClient';
import type { EmailMessage } from '../../mail/types';
import { KeyHints } from '../../ui/KeyHints';

interface MessageScreenProps {
  mailClient: MailClient;
  messageId: string;
  onBack: () => void;
  onCompose: () => void;
  onQuit: () => void;
}

export const MessageScreen: React.FC<MessageScreenProps> = ({
  mailClient,
  messageId,
  onBack,
  onCompose,
  onQuit,
}) => {
  const [message, setMessage] = useState<EmailMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessage = async () => {
      setLoading(true);
      setError(null);
      try {
        const msg = await mailClient.getMessage(messageId);
        setMessage(msg);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load message');
      } finally {
        setLoading(false);
      }
    };

    loadMessage();
  }, [messageId]);

  useInput((input, key) => {
    if (loading) return;

    if (input === 'q') {
      onQuit();
    } else if (input === 's') {
      onCompose();
    } else if (key.escape || key.backspace) {
      onBack();
    }
  });

  if (loading) {
    return (
      <Box flexDirection="column">
        <Box paddingX={2} paddingY={1}>
          <Text color="yellow">Loading message...</Text>
        </Box>
      </Box>
    );
  }

  if (error || !message) {
    return (
      <Box flexDirection="column">
        <Box paddingX={2} paddingY={1}>
          <Text color="red">Error: {error || 'Message not found'}</Text>
        </Box>
        <KeyHints
          hints={[
            { key: 'Esc', description: 'Back' },
            { key: 'q', description: 'Quit' },
          ]}
        />
      </Box>
    );
  }

  const dateStr = message.date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <Box flexDirection="column" height="100%">
      <Box borderStyle="single" paddingX={1}>
        <Text bold color="cyan">
          📧 Message
        </Text>
      </Box>

      <Box flexDirection="column" paddingX={2} paddingY={1} flexGrow={1}>
        <Box marginBottom={1}>
          <Text bold color="green">
            Subject: {message.subject}
          </Text>
        </Box>

        <Box>
          <Text>
            <Text dimColor>From: </Text>
            {message.from}
          </Text>
        </Box>

        <Box>
          <Text>
            <Text dimColor>To: </Text>
            {message.to}
          </Text>
        </Box>

        <Box marginBottom={1}>
          <Text dimColor>Date: {dateStr}</Text>
        </Box>

        <Box borderStyle="single" paddingX={1} paddingY={1} flexDirection="column">
          {message.body.split('\n').map((line, i) => (
            <Text key={i}>{line || ' '}</Text>
          ))}
        </Box>
      </Box>

      <KeyHints
        hints={[
          { key: 'Esc/Backspace', description: 'Back' },
          { key: 's', description: 'Compose' },
          { key: 'q', description: 'Quit' },
        ]}
      />
    </Box>
  );
};

