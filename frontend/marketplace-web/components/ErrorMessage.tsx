import { Alert, Button, Flex, Text } from '@/components/green';

interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <Flex padding="l" justify-content="center">
      <Alert variant="negative">
        <Flex flex-direction="column" gap="m" align-items="start">
          <Text>{message}</Text>
          {retry && (
            <Button size="small" onClick={retry}>
              Retry
            </Button>
          )}
        </Flex>
      </Alert>
    </Flex>
  );
}
