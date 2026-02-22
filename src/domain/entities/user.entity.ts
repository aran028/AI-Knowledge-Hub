export class UserEntity {
  private readonly _id: string
  private _email: string
  private _displayName?: string
  private _avatarUrl?: string
  private _isEmailVerified: boolean
  private _role: 'user' | 'admin' | 'moderator'
  private _preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    notifications: boolean
  }
  private _createdAt: Date;
  private _updatedAt: Date
  private _lastLoginAt?: Date
  private _isActive: boolean
  private _domainEvents: any[] = []

  constructor(
    id: string,
    email: string,
    displayName?: string
  ) {
    this.validateEmail(email)
    
    this._id = id
    this._email = email
    this._displayName = displayName
    this._isEmailVerified = false
    this._role = 'user'
    this._preferences = {
      theme: 'auto',
      language: 'es',
      notifications: true
    }
    this._createdAt = new Date()
    this._updatedAt = new Date()
    this._isActive = true
  }

  // Getters
  get id(): string { return this._id }
  get email(): string { return this._email }
  get displayName(): string | undefined { return this._displayName }
  get avatarUrl(): string | undefined { return this._avatarUrl }
  get isEmailVerified(): boolean { return this._isEmailVerified }
  get role(): string { return this._role }
  get preferences(): any { return { ...this._preferences } }
  get createdAt(): Date { return this._createdAt }
  get updatedAt(): Date { return this._updatedAt }
  get lastLoginAt(): Date | undefined { return this._lastLoginAt }
  get isActive(): boolean { return this._isActive }
  get domainEvents(): any[] { return [...this._domainEvents] }

  // Business logic methods
  updateEmail(newEmail: string): void {
    this.validateEmail(newEmail)
    this._email = newEmail
    this._isEmailVerified = false // Reset verification when email changes
    this.touch()
  }

  updateDisplayName(displayName: string): void {
    if (displayName && displayName.trim().length > 100) {
      throw new Error('Display name cannot exceed 100 characters')
    }
    this._displayName = displayName?.trim() || undefined
    this.touch()
  }

  setAvatarUrl(avatarUrl: string): void {
    this._avatarUrl = avatarUrl
    this.touch()
  }

  verifyEmail(): void {
    this._isEmailVerified = true
    this.touch()
  }

  updateTheme(theme: 'light' | 'dark' | 'auto'): void {
    this._preferences.theme = theme
    this.touch()
  }

  updateLanguage(language: string): void {
    this._preferences.language = language
    this.touch()
  }

  toggleNotifications(): void {
    this._preferences.notifications = !this._preferences.notifications
    this.touch()
  }

  promoteToAdmin(): void {
    this._role = 'admin'
    this.touch()
  }

  promoteToModerator(): void {
    this._role = 'moderator'
    this.touch()
  }

  demoteToUser(): void {
    this._role = 'user'
    this.touch()
  }

  recordLogin(): void {
    this._lastLoginAt = new Date()
    this.touch()
  }

  deactivate(): void {
    this._isActive = false
    this.touch()
  }

  activate(): void {
    this._isActive = true
    this.touch()
  }

  clearEvents(): void {
    this._domainEvents = []
  }

  // Query methods
  hasRole(role: string): boolean {
    return this._role === role
  }

  isAdmin(): boolean {
    return this._role === 'admin'
  }

  isModerator(): boolean {
    return this._role === 'moderator' || this._role === 'admin'
  }

  canManageContent(): boolean {
    return this.isModerator()
  }

  canManageUsers(): boolean {
    return this.isAdmin()
  }

  // Private methods
  private validateEmail(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty')
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }
  }

  private touch(): void {
    this._updatedAt = new Date()
  }

  // Factory methods
  static create(
    email: string,
    displayName?: string
  ): UserEntity {
    const id = crypto.randomUUID()
    return new UserEntity(id, email, displayName)
  }

  static fromPersistence(data: {
    id: string
    email: string
    displayName?: string
    avatarUrl?: string
    isEmailVerified?: boolean
    role?: 'user' | 'admin' | 'moderator'
    preferences?: any
    createdAt: Date
    updatedAt: Date
    lastLoginAt?: Date
    isActive?: boolean
  }): UserEntity {
    const user = new UserEntity(data.id, data.email, data.displayName)
    
    // Set private fields directly (bypass validation for persistence)
    if (data.avatarUrl) user._avatarUrl = data.avatarUrl
    user._isEmailVerified = data.isEmailVerified ?? false
    user._role = data.role ?? 'user'
    if (data.preferences) user._preferences = { ...user._preferences, ...data.preferences }
    user._createdAt = data.createdAt
    user._updatedAt = data.updatedAt
    if (data.lastLoginAt) user._lastLoginAt = data.lastLoginAt
    user._isActive = data.isActive ?? true
    
    // Clear creation events for persistence reconstruction
    user._domainEvents = []
    
    return user
  }
}