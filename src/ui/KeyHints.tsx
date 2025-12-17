import React from 'react';
import { Box, Text } from 'ink';

interface KeyHintsProps {
  hints: Array<{ key: string; description: string }>;
}

export const KeyHints: React.FC<KeyHintsProps> = ({ hints }) => {
  return (
    <Box borderStyle="single" borderTop paddingX={1} marginTop={1}>
      <Text dimColor>
        {hints.map((hint, i) => (
          <React.Fragment key={hint.key}>
            {i > 0 && ' | '}
            <Text bold color="cyan">
              {hint.key}
            </Text>
            {': '}
            {hint.description}
          </React.Fragment>
        ))}
      </Text>
    </Box>
  );
};

