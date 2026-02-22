import { ToolId } from '../value-objects/tool-id.vo'
import { AIClassification } from '../value-objects/ai-classification.vo'
import { ConfidenceScore } from '../value-objects/confidence-score.vo'

export class YouTubeContentEntity {
  private readonly _id: string
  private readonly _videoId: string
  private _title: string
  private _description?: string
  private _channelName: string
  private _channelUrl?: string
  private readonly _videoUrl: string
  private _thumbnailUrl?: string
  private _duration?: string
  private _publishedAt?: Date
  private _viewCount: number
  private _likeCount: number
  private _aiClassification: AIClassification
  private _confidenceScore: ConfidenceScore
  private _relatedTools: Set<ToolId>
  private _playlistId?: string
  private _tags: Set<string>
  private _aiSummary?: string
  private _aiKeyPoints: string[]
  private _createdAt: Date;
  private _updatedAt: Date
  private _userId?: string
  private _domainEvents: any[] = []

  constructor(
    id: string,
    videoId: string,
    title: string,
    channelName: string,
    videoUrl: string,
    aiClassification: AIClassification,
    confidenceScore: ConfidenceScore,
    userId?: string
  ) {
    this.validateVideoId(videoId)
    this.validateTitle(title)
    this.validateChannelName(channelName)
    this.validateVideoUrl(videoUrl)
    
    this._id = id
    this._videoId = videoId
    this._title = title
    this._channelName = channelName
    this._videoUrl = videoUrl
    this._aiClassification = aiClassification
    this._confidenceScore = confidenceScore
    this._userId = userId
    this._viewCount = 0
    this._likeCount = 0
    this._relatedTools = new Set()
    this._tags = new Set()
    this._aiKeyPoints = []
    this._createdAt = new Date()
    this._updatedAt = new Date()
  }

  // Getters
  get id(): string { return this._id }
  get videoId(): string { return this._videoId }
  get title(): string { return this._title }
  get description(): string | undefined { return this._description }
  get channelName(): string { return this._channelName }
  get channelUrl(): string | undefined { return this._channelUrl }
  get videoUrl(): string { return this._videoUrl }
  get thumbnailUrl(): string | undefined { return this._thumbnailUrl }
  get duration(): string | undefined { return this._duration }
  get publishedAt(): Date | undefined { return this._publishedAt }
  get viewCount(): number { return this._viewCount }
  get likeCount(): number { return this._likeCount }
  get aiClassification(): AIClassification { return this._aiClassification }
  get confidenceScore(): ConfidenceScore { return this._confidenceScore }
  get relatedTools(): ToolId[] { return Array.from(this._relatedTools) }
  get playlistId(): string | undefined { return this._playlistId }
  get tags(): string[] { return Array.from(this._tags) }
  get aiSummary(): string | undefined { return this._aiSummary }
  get aiKeyPoints(): string[] { return [...this._aiKeyPoints] }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }
  get userId(): string | undefined { return this._userId }
  get domainEvents(): any[] { return [...this._domainEvents] }

  // Business logic methods
  updateTitle(newTitle: string): void {
    this.validateTitle(newTitle)
    this._title = newTitle
    this.touch()
  }

  setDescription(description: string): void {
    this._description = description.trim()
    this.touch()
  }

  setChannelUrl(channelUrl: string): void {
    this._channelUrl = channelUrl
    this.touch()
  }

  setThumbnailUrl(thumbnailUrl: string): void {
    this._thumbnailUrl = thumbnailUrl
    this.touch()
  }

  setDuration(duration: string): void {
    this._duration = duration
    this.touch()
  }

  setPublishedAt(publishedAt: Date): void {
    this._publishedAt = publishedAt
    this.touch()
  }

  updateViewCount(viewCount: number): void {
    if (viewCount < 0) {
      throw new Error('View count cannot be negative')
    }
    this._viewCount = viewCount
    this.touch()
  }

  updateLikeCount(likeCount: number): void {
    if (likeCount < 0) {
      throw new Error('Like count cannot be negative')
    }
    this._likeCount = likeCount
    this.touch()
  }

  updateAIClassification(classification: AIClassification, confidence: ConfidenceScore): void {
    this._aiClassification = classification
    this._confidenceScore = confidence
    this.touch()
  }

  addRelatedTool(toolId: ToolId): void {
    this._relatedTools.add(toolId)
    this.touch()
  }

  removeRelatedTool(toolId: ToolId): void {
    this._relatedTools.delete(toolId)
    this.touch()
  }

  assignToPlaylist(playlistId: string): void {
    this._playlistId = playlistId
    this.touch()
  }

  removeFromPlaylist(): void {
    this._playlistId = undefined
    this.touch()
  }

  addTag(tag: string): void {
    if (!tag || tag.trim().length === 0) {
      throw new Error('Tag cannot be empty')
    }
    
    const normalizedTag = tag.toLowerCase().trim()
    this._tags.add(normalizedTag)
    this.touch()
  }

  removeTag(tag: string): void {
    const normalizedTag = tag.toLowerCase().trim()
    this._tags.delete(normalizedTag)
    this.touch()
  }

  setAISummary(summary: string): void {
    this._aiSummary = summary.trim()
    this.touch()
  }

  setAIKeyPoints(keyPoints: string[]): void {
    this._aiKeyPoints = keyPoints.filter(point => point && point.trim().length > 0)
    this.touch()
  }

  addAIKeyPoint(keyPoint: string): void {
    if (!keyPoint || keyPoint.trim().length === 0) {
      throw new Error('Key point cannot be empty')
    }
    
    this._aiKeyPoints.push(keyPoint.trim())
    this.touch()
  }

  clearEvents(): void {
    this._domainEvents = []
  }

  // Query methods
  matchesSearch(query: string): boolean {
    const searchTerm = query.toLowerCase()
    return (
      this._title.toLowerCase().includes(searchTerm) ||
      this._description?.toLowerCase().includes(searchTerm) ||
      this._channelName.toLowerCase().includes(searchTerm) ||
      this._aiSummary?.toLowerCase().includes(searchTerm) ||
      Array.from(this._tags).some(tag => tag.includes(searchTerm)) ||
      this._aiKeyPoints.some(point => point.toLowerCase().includes(searchTerm))
    )
  }

  hasTag(tag: string): boolean {
    return this._tags.has(tag.toLowerCase().trim())
  }

  isInCategory(category: string): boolean {
    return this._aiClassification.category.toLowerCase() === category.toLowerCase()
  }

  hasConfidenceAbove(threshold: number): boolean {
    return this._confidenceScore.value >= threshold
  }

  // Private validation methods
  private validateVideoId(videoId: string): void {
    if (!videoId || videoId.trim().length === 0) {
      throw new Error('Video ID cannot be empty')
    }
    // YouTube video IDs are typically 11 characters
    if (videoId.length !== 11) {
      throw new Error('Invalid YouTube video ID format')
    }
  }

  private validateTitle(title: string): void {
    if (!title || title.trim().length < 2) {
      throw new Error('Video title must have at least 2 characters')
    }
    if (title.length > 200) {
      throw new Error('Video title cannot exceed 200 characters')
    }
  }

  private validateChannelName(channelName: string): void {
    if (!channelName || channelName.trim().length === 0) {
      throw new Error('Channel name cannot be empty')
    }
  }

  private validateVideoUrl(videoUrl: string): void {
    if (!videoUrl || videoUrl.trim().length === 0) {
      throw new Error('Video URL cannot be empty')
    }
    
    try {
      const url = new URL(videoUrl)
      if (!['youtube.com', 'www.youtube.com', 'youtu.be'].includes(url.hostname)) {
        throw new Error('URL must be a valid YouTube URL')
      }
    } catch (error) {
      throw new Error('Invalid video URL format')
    }
  }

  private touch(): void {
    this._updatedAt = new Date()
  }

  // Factory methods
  static create(
    videoId: string,
    title: string,
    channelName: string,
    videoUrl: string,
    aiClassification: AIClassification,
    confidenceScore: ConfidenceScore,
    userId?: string
  ): YouTubeContentEntity {
    const id = crypto.randomUUID()
    return new YouTubeContentEntity(
      id,
      videoId,
      title,
      channelName,
      videoUrl,
      aiClassification,
      confidenceScore,
      userId
    )
  }

  static fromPersistence(data: {
    id: string
    videoId: string
    title: string
    description?: string
    channelName: string
    channelUrl?: string
    videoUrl: string
    thumbnailUrl?: string
    duration?: string
    publishedAt?: Date
    viewCount?: number
    likeCount?: number
    aiClassification: any
    confidenceScore: number
    relatedTools?: string[]
    playlistId?: string
    tags?: string[]
    aiSummary?: string
    aiKeyPoints?: string[]
    userId?: string
    createdAt: Date
    updatedAt: Date
  }): YouTubeContentEntity {
    const aiClassification = AIClassification.fromPersistence(data.aiClassification)
    const confidenceScore = new ConfidenceScore(data.confidenceScore)
    
    const content = new YouTubeContentEntity(
      data.id,
      data.videoId,
      data.title,
      data.channelName,
      data.videoUrl,
      aiClassification,
      confidenceScore,
      data.userId
    )
    
    // Set private fields directly (bypass validation for persistence)
    if (data.description) content._description = data.description
    if (data.channelUrl) content._channelUrl = data.channelUrl
    if (data.thumbnailUrl) content._thumbnailUrl = data.thumbnailUrl
    if (data.duration) content._duration = data.duration
    if (data.publishedAt) content._publishedAt = data.publishedAt
    content._viewCount = data.viewCount ?? 0
    content._likeCount = data.likeCount ?? 0
    if (data.playlistId) content._playlistId = data.playlistId
    if (data.aiSummary) content._aiSummary = data.aiSummary
    content._aiKeyPoints = data.aiKeyPoints ?? []
    content._createdAt = data.createdAt
    content._updatedAt = data.updatedAt
    
    // Add related tools
    if (data.relatedTools) {
      data.relatedTools.forEach(toolId => {
        content._relatedTools.add(new ToolId(toolId))
      })
    }
    
    // Add tags
    if (data.tags) {
      data.tags.forEach(tag => {
        content._tags.add(tag.toLowerCase().trim())
      })
    }
    
    // Clear creation events for persistence reconstruction
    content._domainEvents = []
    
    return content
  }
}