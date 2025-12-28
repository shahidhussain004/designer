import pino from 'pino';
import { appConfig } from './app.config.js';

const isDevelopment = appConfig.env === 'development';

export const logger = pino({
  level: appConfig.logLevel,
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: {
    service: 'content-service',
    env: appConfig.env,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export type Logger = typeof logger;
