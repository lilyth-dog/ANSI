// 단순화된 로거 (Google Cloud Logging 제거)
export type LogLevel = "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL"

export interface LogEntry {
  message: string
  level: LogLevel
  userId?: string
  sessionId?: string
  metadata?: Record<string, any>
  timestamp?: Date
}

export class Logger {
  private logName: string
  private defaultMetadata: Record<string, any>

  constructor(logName: string, defaultMetadata: Record<string, any> = {}) {
    this.logName = logName
    this.defaultMetadata = defaultMetadata
  }

  async log(entry: LogEntry): Promise<void> {
    try {
      // 콘솔 로깅으로 대체
      const timestamp = entry.timestamp || new Date()
      const logMessage = `[${entry.level}] ${this.logName}: ${entry.message}`

      console.log(logMessage, {
        timestamp,
        userId: entry.userId,
        sessionId: entry.sessionId,
        metadata: entry.metadata,
        ...this.defaultMetadata,
      })
    } catch (error) {
      console.error("Failed to write log:", error)
    }
  }

  async debug(message: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    await this.log({ message, level: "DEBUG", metadata, userId })
  }

  async info(message: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    await this.log({ message, level: "INFO", metadata, userId })
  }

  async warning(message: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    await this.log({ message, level: "WARNING", metadata, userId })
  }

  async error(message: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    await this.log({ message, level: "ERROR", metadata, userId })
  }

  async critical(message: string, metadata?: Record<string, any>, userId?: string): Promise<void> {
    await this.log({ message, level: "CRITICAL", metadata, userId })
  }
}

// Pre-configured loggers for different parts of the application
export const authLogger = new Logger("silvercare-auth", { component: "auth" })
export const apiLogger = new Logger("silvercare-api", { component: "api" })
export const emotionLogger = new Logger("silvercare-emotion", { component: "emotion-analysis" })
export const systemLogger = new Logger("silvercare-system", { component: "system" })

// Audit logging for sensitive operations
export class AuditLogger extends Logger {
  constructor() {
    super("silvercare-audit", { component: "audit" })
  }

  async logUserAction(
    action: string,
    userId: string,
    targetResource?: string,
    details?: Record<string, any>,
  ): Promise<void> {
    await this.info(
      `User action: ${action}`,
      {
        action,
        targetResource,
        ...details,
      },
      userId,
    )
  }

  async logSystemEvent(event: string, details?: Record<string, any>): Promise<void> {
    await this.info(`System event: ${event}`, {
      event,
      ...details,
    })
  }

  async logSecurityEvent(event: string, userId?: string, details?: Record<string, any>): Promise<void> {
    await this.warning(
      `Security event: ${event}`,
      {
        event,
        ...details,
      },
      userId,
    )
  }
}

export const auditLogger = new AuditLogger()

// Helper function to create request-scoped logger
export function createRequestLogger(requestId: string, userId?: string) {
  return new Logger("silvercare-request", {
    requestId,
    ...(userId && { userId }),
  })
}

// Error logging helper
export async function logError(
  error: Error,
  context: string,
  userId?: string,
  metadata?: Record<string, any>,
): Promise<void> {
  const logger = new Logger("silvercare-errors", { component: "error-handler" })

  await logger.error(
    `Error in ${context}: ${error.message}`,
    {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      context,
      ...metadata,
    },
    userId,
  )
}

// Performance logging
export class PerformanceLogger extends Logger {
  constructor() {
    super("silvercare-performance", { component: "performance" })
  }

  async logApiCall(
    endpoint: string,
    method: string,
    duration: number,
    statusCode: number,
    userId?: string,
  ): Promise<void> {
    await this.info(
      `API call: ${method} ${endpoint}`,
      {
        endpoint,
        method,
        duration,
        statusCode,
      },
      userId,
    )
  }

  async logDatabaseQuery(collection: string, operation: string, duration: number, userId?: string): Promise<void> {
    await this.debug(
      `Database query: ${operation} on ${collection}`,
      {
        collection,
        operation,
        duration,
      },
      userId,
    )
  }
}

export const performanceLogger = new PerformanceLogger()
