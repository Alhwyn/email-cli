import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import type { MailClient } from '../../mail/MailClient';
import { KeyHints } from '../../ui/KeyHints';

interface ComposeScreenProps {
  mailClient: MailClient;
  onCancel: () => void;
  onSent: () => void;
  onQuit: () => void;
}

type Field = 'to' | 'subject' | 'body';

export const ComposeScreen: React.FC<ComposeScreenProps> = ({
  mailClient,
  onCancel,
  onSent,
  onQuit,
}) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [currentField, setCurrentField] = useState<Field>('to');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fields: Field[] = ['to', 'subject', 'body'];

  const handleSend = async () => {
    if (!to || !subject) {
      setError('To and Subject are required');
      return;
    }

    setSending(true);
    setError(null);
    try {
      await mailClient.send({ to, subject, body });
      onSent();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send');
      setSending(false);
    }
  };

  useInput((input, key) => {
    if (sending) return;

    if (input === 'q') {
      onQuit();
    } else if (key.escape) {
      onCancel();
    } else if (key.tab) {
      if (key.shift) {
        // Shift+Tab: previous field
        const currentIndex = fields.indexOf(currentField);
        const prevIndex = (currentIndex - 1 + fields.length) % fields.length;
        setCurrentField(fields[prevIndex]!);
      } else {
        // Tab: next field
        const currentIndex = fields.indexOf(currentField);
        const nextIndex = (currentIndex + 1) % fields.length;
        setCurrentField(fields[nextIndex]!);
      }
    } else if (key.ctrl && input === 's') {
      handleSend();
    } else if (key.backspace || key.delete) {
      if (currentField === 'to') {
        setTo((prev) => prev.slice(0, -1));
      } else if (currentField === 'subject') {
        setSubject((prev) => prev.slice(0, -1));
      } else if (currentField === 'body') {
        setBody((prev) => prev.slice(0, -1));
      }
    } else if (key.return && currentField === 'body') {
      setBody((prev) => prev + '\n');
    } else if (input && !key.ctrl && !key.meta) {
      if (currentField === 'to') {
        setTo((prev) => prev + input);
      } else if (currentField === 'subject') {
        setSubject((prev) => prev + input);
      } else if (currentField === 'body') {
        setBody((prev) => prev + input);
      }
    }
  });

  if (sending) {
    return (
      <Box flexDirection="column">
        <Box paddingX={2} paddingY={1}>
          <Text color="yellow">Sending message...</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      <Box borderStyle="single" paddingX={1}>
        <Text bold color="cyan">
          ✉️  Compose New Message
        </Text>
      </Box>

      <Box flexDirection="column" paddingX={2} paddingY={1} flexGrow={1}>
        {error && (
          <Box marginBottom={1}>
            <Text color="red">Error: {error}</Text>
          </Box>
        )}

        <Box marginBottom={1}>
          <Text bold color={currentField === 'to' ? 'green' : 'white'}>
            To: {currentField === 'to' && '█'}
          </Text>
          <Text>{to}</Text>
        </Box>

        <Box marginBottom={1}>
          <Text bold color={currentField === 'subject' ? 'green' : 'white'}>
            Subject: {currentField === 'subject' && '█'}
          </Text>
          <Text>{subject}</Text>
        </Box>

        <Box marginBottom={1}>
          <Text bold color={currentField === 'body' ? 'green' : 'white'}>
            Body: {currentField === 'body' && '█'}
          </Text>
        </Box>

        <Box borderStyle="single" paddingX={1} paddingY={1} flexDirection="column">
          {body.split('\n').map((line, i) => (
            <Text key={i}>{line || ' '}</Text>
          ))}
        </Box>
      </Box>

      <KeyHints
        hints={[
          { key: 'Tab/Shift+Tab', description: 'Switch field' },
          { key: 'Ctrl+S', description: 'Send' },
          { key: 'Esc', description: 'Cancel' },
          { key: 'q', description: 'Quit' },
        ]}
      />
    </Box>
  );
};

