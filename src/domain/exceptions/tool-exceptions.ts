import { DomainException } from './domain-exception'

export class ToolNotFoundException extends DomainException {
  constructor(toolId: string) {
    super(
      `Tool with ID '${toolId}' was not found`,
      { toolId }
    )
  }
}

export class DuplicateToolUrlException extends DomainException {
  constructor(url: string, existingToolId?: string) {
    super(
      `A tool with URL '${url}' already exists${existingToolId ? ` (ID: ${existingToolId})` : ''}`,
      { url, existingToolId }
    )
  }
}

export class ToolValidationException extends DomainException {
  constructor(field: string, value: any, reason: string) {
    super(
      `Tool validation failed for field '${field}': ${reason}`,
      { field, value, reason }
    )
  }
}

export class ToolWebsiteNotAccessibleException extends DomainException {
  constructor(url: string, statusCode?: number) {
    super(
      `Tool website '${url}' is not accessible${statusCode ? ` (HTTP ${statusCode})` : ''}`,
      { url, statusCode }
    )
  }
}