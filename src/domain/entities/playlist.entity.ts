import { ToolId } from '../value-objects/tool-id.vo'
import { PlaylistCreated } from '../events/playlist-created.event'
import { ToolAdded } from '../events/tool-added.event'

export class PlaylistEntity {
  private readonly _id: string
  private _name: string
  private _icon: string
  private _description?: string
  private readonly _toolIds: Set<ToolId>
  private _createdAt: Date;
  private _updatedAt: Date
  private readonly _userId?: string
  private _isPublic: boolean
  private _domainEvents: any[] = []

  constructor(
    id: string,
    name: string,
    icon: string,
    userId?: string,
    isPublic: boolean = true
  ) {
    this.validateName(name)
    this.validateIcon(icon)
    
    this._id = id
    this._name = name
    this._icon = icon
    this._userId = userId
    this._isPublic = isPublic
    this._toolIds = new Set()
    this._createdAt = new Date()
    this._updatedAt = new Date()
    
    // Emitir evento de dominio
    this._domainEvents.push(
      new PlaylistCreated(this._id, this._name, this._userId, this._createdAt)
    )
  }

  // Getters
  get id(): string { return this._id }
  get name(): string { return this._name }
  get icon(): string { return this._icon }
  get description(): string | undefined { return this._description }
  get toolCount(): number { return this._toolIds.size }
  get toolIds(): ToolId[] { return Array.from(this._toolIds) }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }
  get userId(): string | undefined { return this._userId }
  get isPublic(): boolean { return this._isPublic }
  get domainEvents(): any[] { return [...this._domainEvents] }

  // Business logic methods
  updateName(newName: string): void {
    this.validateName(newName)
    this._name = newName
    this.touch()
  }

  updateIcon(newIcon: string): void {
    this.validateIcon(newIcon)
    this._icon = newIcon
    this.touch()
  }

  setDescription(description: string): void {
    this._description = description.trim()
    this.touch()
  }

  addTool(toolId: ToolId): void {
    if (this._toolIds.has(toolId)) {
      throw new Error(`Tool ${toolId.value} is already in playlist ${this._name}`)
    }
    
    this._toolIds.add(toolId)
    this.touch()
    
    // Emitir evento de dominio
    this._domainEvents.push(
      new ToolAdded(this._id, toolId.value, new Date())
    )
  }

  removeTool(toolId: ToolId): void {
    if (!this._toolIds.has(toolId)) {
      throw new Error(`Tool ${toolId.value} is not in playlist ${this._name}`)
    }
    
    this._toolIds.delete(toolId)
    this.touch()
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

  // Private methods
  private validateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('Playlist name must have at least 2 characters')
    }
    if (name.length > 100) {
      throw new Error('Playlist name cannot exceed 100 characters')
    }
  }

  private validateIcon(icon: string): void {
    if (!icon || icon.trim().length === 0) {
      throw new Error('Playlist must have an icon')
    }
  }

  private touch(): void {
    this._updatedAt = new Date()
  }

  // Factory methods
  static create(
    name: string,
    icon: string,
    userId?: string,
    description?: string
  ): PlaylistEntity {
    const id = crypto.randomUUID()
    const playlist = new PlaylistEntity(id, name, icon, userId)
    
    if (description) {
      playlist.setDescription(description)
    }
    
    return playlist
  }

  static fromPersistence(data: {
    id: string
    name: string
    icon: string
    description?: string
    userId?: string
    isPublic?: boolean
    toolIds?: string[]
    createdAt: Date
    updatedAt: Date
  }): PlaylistEntity {
    const playlist = new PlaylistEntity(
      data.id,
      data.name,
      data.icon,
      data.userId,
      data.isPublic ?? true
    )
    
    // Set private fields directly (bypass validation for persistence)
    if (data.description) playlist._description = data.description
    playlist._createdAt = data.createdAt
    playlist._updatedAt = data.updatedAt
    
    // Add tool IDs
    if (data.toolIds) {
      data.toolIds.forEach(toolId => {
        playlist._toolIds.add(new ToolId(toolId))
      })
    }
    
    // Clear creation events for persistence reconstruction
    playlist._domainEvents = []
    
    return playlist
  }
}