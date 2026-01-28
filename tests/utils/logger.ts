import winston from 'winston';
import path from 'path';

/**
 * Enterprise-grade Logger using Winston
 */

const logLevel = process.env.LOG_LEVEL || 'info';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format with colors
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create winston logger instance
const winstonLogger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    // Console transport
    new winston.transports.Console({
      format: consoleFormat,
    }),
    // File transport for all logs
    new winston.transports.File({
      filename: path.join('logs', 'test-execution.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport for errors only
    new winston.transports.File({
      filename: path.join('logs', 'errors.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

/**
 * Logger class with convenience methods
 */
export class Logger {
  private context: string;

  constructor(context: string = 'TestExecution') {
    this.context = context;
  }

  /**
   * Log info level message
   */
  info(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.info(message, { context: this.context, ...meta });
  }

  /**
   * Log warning level message
   */
  warn(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.warn(message, { context: this.context, ...meta });
  }

  /**
   * Log error level message
   */
  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>): void {
    const errorMeta =
      error instanceof Error ? { error: error.message, stack: error.stack } : { error };
    winstonLogger.error(message, { context: this.context, ...errorMeta, ...meta });
  }

  /**
   * Log debug level message
   */
  debug(message: string, meta?: Record<string, unknown>): void {
    winstonLogger.debug(message, { context: this.context, ...meta });
  }

  /**
   * Log test start
   */
  testStart(testName: string): void {
    this.info(`🚀 Test Started: ${testName}`);
  }

  /**
   * Log test completion
   */
  testComplete(testName: string, status: 'passed' | 'failed' | 'skipped'): void {
    const emoji = status === 'passed' ? '✅' : status === 'failed' ? '❌' : '⏭️';
    this.info(`${emoji} Test ${status.toUpperCase()}: ${testName}`, { status });
  }

  /**
   * Log step execution
   */
  step(stepName: string, details?: Record<string, unknown>): void {
    this.info(`📍 Step: ${stepName}`, details);
  }

  /**
   * Log action execution
   */
  action(actionName: string, details?: Record<string, unknown>): void {
    this.debug(`🔧 Action: ${actionName}`, details);
  }

  /**
   * Log assertion
   */
  assertion(description: string, result: boolean): void {
    const emoji = result ? '✓' : '✗';
    this.info(`${emoji} Assertion: ${description}`, { result });
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default logger
export default logger;
