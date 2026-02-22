export class YoutubeContentAnalyzed {
  public readonly eventName = 'YoutubeContentAnalyzed'
  public readonly eventVersion = '1.0'
  public readonly occurredOn: Date

  constructor(
    public readonly contentId: string,
    public readonly videoId: string,
    public readonly aiCategory: string,
    public readonly confidenceScore: number,
    public readonly toolsDetected: string[],
    occurredOn?: Date
  ) {
    this.occurredOn = occurredOn ?? new Date()
  }

  hasHighConfidence(): boolean {
    return this.confidenceScore >= 0.8
  }

  toJson(): object {
    return {
      eventName: this.eventName,
      eventVersion: this.eventVersion,
      contentId: this.contentId,
      videoId: this.videoId,
      aiCategory: this.aiCategory,
      confidenceScore: this.confidenceScore,
      toolsDetected: this.toolsDetected,
      occurredOn: this.occurredOn.toISOString()
    }
  }
}