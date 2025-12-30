/**
 * Logger utility for frontend application
 * Provides consistent logging with levels, timestamps, and context
 * Can be extended to send logs to backend or external service
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  [key: string]: unknown;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private enableConsole = true;
  private logHistory: Array<{
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: {
      name: string;
      message: string;
      stack?: string;
    };
  }> = [];
  private maxHistorySize = 100;

  /**
   * Format timestamp for logs
   */
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString();
  }

  /**
   * Get color for console output based on level
   */
  private getColor(level: LogLevel): string {
    const colors = {
      debug: '#6B7280',
      info: '#3B82F6',
      warn: '#F59E0B',
      error: '#EF4444',
    };
    return colors[level];
  }

  /**
   * Safely stringify data for logging (avoids throwing on circular structures)
   */
  private safeStringify(value: unknown, maxLen = 200): string | undefined {
    if (value === undefined || value === null) return undefined;
    try {
      const str = typeof value === 'string' ? value : JSON.stringify(value);
      return str.length > maxLen ? str.substring(0, maxLen) : str;
    } catch (e) {
      try {
        return String(value).substring(0, maxLen);
      } catch {
        return '[unserializable]';
      }
    }
  }

  /**
   * Create formatted log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: LogContext;
    error?: { name: string; message: string; stack?: string };
  } {
    const entry = {
      timestamp: this.getTimestamp(),
      level,
      message,
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    // Add to history
    this.logHistory.push(entry);
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift();
    }

    return entry;
  }

  /**
   * Output to console with formatting
   */
  private outputToConsole(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ) {
    if (!this.enableConsole) return;

    // Protect logging from throwing (e.g., circular structures, console issues)
    try {
      const timestamp = this.getTimestamp();
      const color = this.getColor(level);
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[level];

      const prefix = `%c${emoji} [${level.toUpperCase()}] ${timestamp}`;
      const style = `color: ${color}; font-weight: bold;`;

      // Provide a safe, short string for context when available
      const safeContext = context ? this.safeStringify(context, 500) : '';

      // Build a single safe output string to avoid console formatting issues
      const safeErrorString = error ? `${error.name}: ${error.message}\n${error.stack || ''}` : '';
      const output = `${emoji} [${level.toUpperCase()}] ${timestamp} - ${message} ${safeContext || ''} ${safeErrorString}`;

      try {
        if (level === 'error') {
          if (typeof console !== 'undefined' && console.error) console.error(output);
        } else if (level === 'warn') {
          if (typeof console !== 'undefined' && console.warn) console.warn(output);
        } else if (level === 'debug' && this.isDevelopment) {
          if (typeof console !== 'undefined' && console.debug) console.debug(output);
        } else if (level === 'info') {
          if (typeof console !== 'undefined' && console.info) console.info(output);
        }
      } catch (e) {
        // If console methods themselves throw, fallback to basic console.log when available
        try {
          if (typeof console !== 'undefined' && console.log) console.log(output);
        } catch {
          // ignore
        }
      }
    } catch (e) {
      // Swallow logging errors to avoid impacting application flow
      try {
        if (typeof console !== 'undefined' && console.error) {
          console.error('Logger output failed:', e);
        }
      } catch {
        // final fallback: nothing we can do
      }
    }
  }

  /**
   * Debug level logging (only in development)
   */
  debug(message: string, context?: LogContext) {
    const entry = this.createLogEntry('debug', message, context);
    this.outputToConsole('debug', message, context);
    return entry;
  }

  /**
   * Info level logging
   */
  info(message: string, context?: LogContext) {
    const entry = this.createLogEntry('info', message, context);
    this.outputToConsole('info', message, context);
    return entry;
  }

  /**
   * Warning level logging
   */
  warn(message: string, context?: LogContext) {
    const entry = this.createLogEntry('warn', message, context);
    this.outputToConsole('warn', message, context);
    return entry;
  }

  /**
   * Error level logging
   */
  error(message: string, error?: Error, context?: LogContext) {
    const entry = this.createLogEntry('error', message, context, error);
    this.outputToConsole('error', message, context, error);
    
    // In production, you could send errors to a monitoring service here
    if (!this.isDevelopment) {
      // Example: sendToErrorTrackingService(entry);
    }
    
    return entry;
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, data?: unknown) {
    this.info(`API Request: ${method} ${url}`, {
      component: 'API',
      action: 'request',
      method,
      url,
      data: this.safeStringify(data, 200),
    });
  }

  /**
   * Log API response
   */
  apiResponse(method: string, url: string, status: number, duration: number) {
    const context: LogContext = {
      component: 'API',
      action: 'response',
      method,
      url,
      status,
      duration: `${duration}ms`,
    };
    
    if (status >= 400) {
      this.error(`API Response: ${method} ${url} - ${status}`, undefined, context);
    } else if (status >= 300) {
      this.warn(`API Response: ${method} ${url} - ${status}`, context);
    } else {
      this.info(`API Response: ${method} ${url} - ${status}`, context);
    }
  }

  /**
   * Log API error
   */
  apiError(method: string, url: string, error: Error, statusCode?: number) {
    this.error(`API Error: ${method} ${url}`, error, {
      component: 'API',
      action: 'error',
      method,
      url,
      statusCode,
    });
  }

  /**
   * Log user action
   */
  userAction(action: string, details?: unknown) {
    this.info(`User Action: ${action}`, {
      component: 'User',
      action,
      details,
    });
  }

  /**
   * Log performance metric
   */
  performance(label: string, duration: number, threshold?: number) {
    const level = threshold && duration > threshold ? 'warn' : 'debug';
    this[level](`Performance: ${label} - ${duration}ms`, {
      component: 'Performance',
      label,
      duration: `${duration}ms`,
      threshold: threshold ? `${threshold}ms` : undefined,
    });
  }

  /**
   * Get log history
   */
  getHistory() {
    return [...this.logHistory];
  }

  /**
   * Clear log history
   */
  clearHistory() {
    this.logHistory = [];
  }

  /**
   * Enable/disable console output
   */
  setConsoleEnabled(enabled: boolean) {
    this.enableConsole = enabled;
  }
}

// Export singleton instance
const logger = new Logger();
export default logger;

// Export class for testing or custom instances
export { Logger, type LogContext, type LogLevel };

