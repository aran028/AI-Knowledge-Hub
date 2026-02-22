export class ToolCreated {
  public readonly eventName = 'ToolCreated'
  public readonly eventVersion = '1.0'
  public readonly occurredOn: Date

  constructor(
    public readonly toolId: string,
    public readonly toolTitle: string,
    public readonly category: string,
    public readonly userId?: string,
    occurredOn?: Date
  ) {
    this.occurredOn = occurredOn ?? new Date()
  }

  toJson(): object {
    return {
      eventName: this.eventName,
      eventVersion: this.eventVersion,
      toolId: this.toolId,
      toolTitle: this.toolTitle,
      category: this.category,
      userId: this.userId,
      occurredOn: this.occurredOn.toISOString()
    }
  }
}