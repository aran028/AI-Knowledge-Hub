export class PlaylistCreated {
  public readonly eventName = 'PlaylistCreated'
  public readonly eventVersion = '1.0'
  public readonly occurredOn: Date

  constructor(
    public readonly playlistId: string,
    public readonly playlistName: string,
    public readonly userId?: string,
    occurredOn?: Date
  ) {
    this.occurredOn = occurredOn ?? new Date()
  }

  isPublic(): boolean {
    return !this.userId
  }

  toJson(): object {
    return {
      eventName: this.eventName,
      eventVersion: this.eventVersion,
      playlistId: this.playlistId,
      playlistName: this.playlistName,
      userId: this.userId,
      occurredOn: this.occurredOn.toISOString()
    }
  }
}