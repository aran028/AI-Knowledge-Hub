export class ToolAdded {
  public readonly eventName = 'ToolAdded'
  public readonly eventVersion = '1.0'
  public readonly occurredOn: Date

  constructor(
    public readonly playlistId: string,
    public readonly toolId: string,
    occurredOn?: Date
  ) {
    this.occurredOn = occurredOn ?? new Date()
  }

  toJson(): object {
    return {
      eventName: this.eventName,
      eventVersion: this.eventVersion,
      playlistId: this.playlistId,
      toolId: this.toolId,
      occurredOn: this.occurredOn.toISOString()
    }
  }
}