import { ToolId } from '../value-objects/tool-id.vo'
import { AIClassification } from '../value-objects/ai-classification.vo'

export class ToolEntity {
  private readonly _id: ToolId
  private _title: string
  private _summary: string
  private _description?: string
  private _category: string
  private _imageUrl: string
  private _websiteUrl: string
  private _tags: Set<string>
  private _aiClassification?: AIClassification
  private _createdAt: Date;
  private _updatedAt: Date
  private _userId?: string
  private _isPublic: boolean
  private _viewCount: number
  private _favoriteCount: number
  private _domainEvents: any[] = []

  constructor(
    id: string,
    title: string,
    summary: string,
    category: string,
    imageUrl: string,
    websiteUrl: string,
    userId?: string
  ) {
    this.validateTitle(title)
    this.validateSummary(summary)
    this.validateCategory(category)
    this.validateUrl(websiteUrl)
    
    this._id = new ToolId(id)
    this._title = title
    this._summary = summary
    this._category = category
    this._imageUrl = imageUrl
    this._websiteUrl = websiteUrl
    this._userId = userId
    this._isPublic = true
    this._tags = new Set()
    this._viewCount = 0
    this._favoriteCount = 0
    this._createdAt = new Date()
    this._updatedAt = new Date()
  }

  // Getters
  get id(): ToolId { return this._id }
  get title(): string { return this._title }
  get summary(): string { return this._summary }
  get description(): string | undefined { return this._description }
  get category(): string { return this._category }
  get imageUrl(): string { return this._imageUrl }
  get websiteUrl(): string { return this._websiteUrl }
  get tags(): string[] { return Array.from(this._tags) }
  get aiClassification(): AIClassification | undefined { return this._aiClassification }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }
  get userId(): string | undefined { return this._userId }
  get isPublic(): boolean { return this._isPublic }
  get viewCount(): number { return this._viewCount }
  get favoriteCount(): number { return this._favoriteCount }
  get domainEvents(): any[] { return [...this._domainEvents] }

  // Business logic methods
  updateTitle(newTitle: string): void {
    this.validateTitle(newTitle)
    this._title = newTitle
    this.touch()
  }

  updateSummary(newSummary: string): void {
    this.validateSummary(newSummary)
    this._summary = newSummary
    this.touch()
  }

  setDescription(description: string): void {
    this._description = description.trim()
    this.touch()
  }

  updateCategory(newCategory: string): void {
    this.validateCategory(newCategory)
    this._category = newCategory
    this.touch()
  }

  updateImageUrl(newImageUrl: string): void {
    this._imageUrl = newImageUrl
    this.touch()
  }

  updateWebsiteUrl(newWebsiteUrl: string): void {
    this.validateUrl(newWebsiteUrl)
    this._websiteUrl = newWebsiteUrl
    this.touch()
  }

  addTag(tag: string): void {
    if (!tag || tag.trim().length === 0) {
      throw new Error('Tag cannot be empty')
    }
    
    const normalizedTag = tag.toLowerCase().trim()
    if (this._tags.has(normalizedTag)) {
      throw new Error(`Tag '${tag}' already exists`)
    }
    
    this._tags.add(normalizedTag)
    this.touch()
  }

  removeTag(tag: string): void {
    const normalizedTag = tag.toLowerCase().trim()
    if (!this._tags.has(normalizedTag)) {
      throw new Error(`Tag '${tag}' does not exist`)
    }
    
    this._tags.delete(normalizedTag)
    this.touch()
  }

  setAIClassification(classification: AIClassification): void {
    this._aiClassification = classification
    this.touch()
  }

  incrementViewCount(): void {
    this._viewCount++
    this.touch()
  }

  incrementFavoriteCount(): void {
    this._favoriteCount++
    this.touch()
  }

  decrementFavoriteCount(): void {
    if (this._favoriteCount > 0) {
      this._favoriteCount--
      this.touch()
    }
  }

  makePrivate(): void {
    this._isPublic = false
    this.touch()
  }

  makePublic(): void {
    this._isPublic = true
    this.touch()
  }

  clearEvents(): void {
    this._domainEvents = []
  }

  // Search and filter logic
  matchesSearch(query: string): boolean {
    const searchTerm = query.toLowerCase()
    return (
      this._title.toLowerCase().includes(searchTerm) ||
      this._summary.toLowerCase().includes(searchTerm) ||
      this._description?.toLowerCase().includes(searchTerm) ||
      this._category.toLowerCase().includes(searchTerm) ||
      Array.from(this._tags).some(tag => tag.includes(searchTerm))
    )
  }

  hasTag(tag: string): boolean {
    return this._tags.has(tag.toLowerCase().trim())
  }

  isInCategory(category: string): boolean {
    return this._category.toLowerCase() === category.toLowerCase()
  }

  // Private methods
  private validateTitle(title: string): void {
    if (!title || title.trim().length < 2) {
      throw new Error('Tool title must have at least 2 characters')
    }
    if (title.length > 100) {
      throw new Error('Tool title cannot exceed 100 characters')
    }
  }

  private validateSummary(summary: string): void {
    if (!summary || summary.trim().length < 10) {
      throw new Error('Tool summary must have at least 10 characters')
    }
    if (summary.length > 500) {
      throw new Error('Tool summary cannot exceed 500 characters')
    }
  }

  private validateCategory(category: string): void {
    if (!category || category.trim().length === 0) {
      throw new Error('Tool must have a category')
    }
  }

  private validateUrl(url: string): void {
    if (!url || url.trim().length === 0) {
      throw new Error('Tool must have a website URL')
    }
    
    try {
      new URL(url)
    } catch {
      throw new Error('Invalid URL format')
    }
  }

  private touch(): void {
    this._updatedAt = new Date()
  }

  // Factory methods
  static create(
    title: string,
    summary: string,
    category: string,
    imageUrl: string,
    websiteUrl: string,
    userId?: string,
    description?: string,
    tags?: string[]
  ): ToolEntity {
    const id = crypto.randomUUID()
    const tool = new ToolEntity(id, title, summary, category, imageUrl, websiteUrl, userId)
    
    if (description) {
      tool.setDescription(description)
    }
    
    if (tags) {
      tags.forEach(tag => tool.addTag(tag))
    }
    
    return tool
  }

  static fromPersistence(data: {
    id: string
    title: string
    summary: string
    description?: string
    category: string
    imageUrl: string
    websiteUrl: string
    tags?: string[]
    userId?: string
    isPublic?: boolean
    viewCount?: number
    favoriteCount?: number
    aiClassification?: any
    createdAt: Date
    updatedAt: Date
  }): ToolEntity {
    const tool = new ToolEntity(
      data.id,
      data.title,
      data.summary,
      data.category,
      data.imageUrl,
      data.websiteUrl,
      data.userId
    )
    
    // Set private fields directly (bypass validation for persistence)
    if (data.description) tool._description = data.description
    tool._isPublic = data.isPublic ?? true
    tool._viewCount = data.viewCount ?? 0
    tool._favoriteCount = data.favoriteCount ?? 0
    tool._createdAt = data.createdAt
    tool._updatedAt = data.updatedAt
    
    // Add tags
    if (data.tags) {
      data.tags.forEach(tag => {
        tool._tags.add(tag.toLowerCase().trim())
      })
    }
    
    // Set AI classification
    if (data.aiClassification) {
      tool._aiClassification = AIClassification.fromPersistence(data.aiClassification)
    }
    
    // Clear creation events for persistence reconstruction
    tool._domainEvents = []
    
    return tool
  }
}