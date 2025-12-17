import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { MailClient } from '../../mail/MailClient';
import type { EmailMessage } from '../../mail/types';
import { KeyHints } from '../../ui/KeyHints';

interface InboxScreenProps {
  mailClient: MailClient;
  onOpenMessage: (id: string) => void;
  onCompose: () => void;
  onQuit: () => void;
}

export const InboxScreen: React.FC<InboxScreenProps> = ({
  mailClient,
  onOpenMessage,
  onCompose,
  onQuit,
}) => {
  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInbox = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await mailClient.listInbox();
      setMessages(result.messages);
      setSelectedIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load inbox');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInbox();
  }, []);

  useInput((input, key) => {
    if (loading) return;

    if (input === 'q') {
      onQuit();
    } else if (input === 's') {
      onCompose();
    } else if (input === 'r') {
      loadInbox();
    } else if (key.upArrow) {
      setSelectedIndex((prev) => Math.max(0, prev - 1));
    } else if (key.downArrow) {
      setSelectedIndex((prev) => Math.min(messages.length - 1, prev + 1));
    } else if (key.return && messages[selectedIndex]) {
      onOpenMessage(messages[selectedIndex].id);
    }
  });

  if (loading) {
    return (
      <Box flexDirection="column">
        <Box paddingX={2} paddingY={1}>
          <Text color="yellow">Loading inbox...</Text>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box flexDirection="column">
        <Box paddingX={2} paddingY={1}>
          <Text color="red">Error: {error}</Text>
        </Box>
        <KeyHints
          hints={[
            { key: 'r', description: 'Retry' },
            { key: 'q', description: 'Quit' },
          ]}
        />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      <Box borderStyle="single" paddingX={1}>
        <Text bold color="cyan">
          📬 Zero Mail - Inbox ({messages.length} messages)
        </Text>
      </Box>

      <Box flexDirection="column" paddingX={1} paddingY={1} flexGrow={1}>
        {messages.length === 0 ? (
          <Text dimColor>No messages in inbox</Text>
        ) : (
          messages.map((msg, index) => {
            const isSelected = index === selectedIndex;
            const dateStr = msg.date.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <Box key={msg.id} paddingY={0}>
                <Text
                  bold={!msg.isRead}
                  color={isSelected ? 'green' : undefined}
                  backgroundColor={isSelected ? 'gray' : undefined}
                >
                  {isSelected ? '> ' : '  '}
                  {!msg.isRead ? '● ' : '  '}
                  <Text dimColor>[{dateStr}]</Text> {msg.from.padEnd(25).substring(0, 25)}{' '}
                  {msg.subject.substring(0, 40)}
                </Text>
              </Box>
            );
          })
        )}
      </Box>

      <KeyHints
        hints={[
          { key: '↑↓', description: 'Navigate' },
          { key: 'Enter', description: 'Open' },
          { key: 's', description: 'Compose' },
          { key: 'r', description: 'Refresh' },
          { key: 'q', description: 'Quit' },
        ]}
      />
    </Box>
  );
};

