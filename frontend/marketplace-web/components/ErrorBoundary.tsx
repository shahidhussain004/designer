'use client';

import { Alert, Button, Flex, Text } from '@/components/green';
import logger from '@/lib/logger';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error Boundary caught error', error, { componentStack: errorInfo.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Flex padding="l" justify-content="center">
            <Alert variant="negative">
              <Flex flex-direction="column" gap="m">
                <Text font-weight="book">Something went wrong</Text>
                <Text font-size="body-s" color="secondary">
                  {this.state.error?.message}
                </Text>
                <Button
                  size="small"
                  onClick={() => this.setState({ hasError: false, error: null })}
                >
                  Try again
                </Button>
              </Flex>
            </Alert>
          </Flex>
        )
      );
    }

    return this.props.children;
  }
}
