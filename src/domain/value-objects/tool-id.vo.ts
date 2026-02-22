export class ToolId {
  private readonly _value: string

  constructor(value: string) {
    this.validate(value)
    this._value = value
  }

  get value(): string {
    return this._value
  }

  equals(other: ToolId): boolean {
    return this._value === other._value
  }

  toString(): string {
    return this._value
  }

  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('Tool ID cannot be empty')
    }
    
    // UUID v4 format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(value)) {
      throw new Error('Tool ID must be a valid UUID v4')
    }
  }

  static generate(): ToolId {
    return new ToolId(crypto.randomUUID())
  }
}