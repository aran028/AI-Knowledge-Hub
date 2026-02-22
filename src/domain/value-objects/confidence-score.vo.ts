export class ConfidenceScore {
  private readonly _value: number

  constructor(value: number) {
    this.validate(value)
    this._value = value
  }

  get value(): number {
    return this._value
  }

  get percentage(): number {
    return this._value * 100
  }

  get level(): 'low' | 'medium' | 'high' {
    if (this._value < 0.5) return 'low'
    if (this._value < 0.8) return 'medium'
    return 'high'
  }

  isHigh(): boolean {
    return this._value >= 0.8
  }

  isMedium(): boolean {
    return this._value >= 0.5 && this._value < 0.8
  }

  isLow(): boolean {
    return this._value < 0.5
  }

  isAbove(threshold: number): boolean {
    return this._value >= threshold
  }

  equals(other: ConfidenceScore): boolean {
    return Math.abs(this._value - other._value) < 0.001 // Allow small floating point differences
  }

  toString(): string {
    return `${this.percentage.toFixed(1)}%`
  }

  private validate(value: number): void {
    if (value < 0 || value > 1) {
      throw new Error('Confidence score must be between 0 and 1')
    }
    
    if (isNaN(value)) {
      throw new Error('Confidence score must be a valid number')
    }
  }

  static low(): ConfidenceScore {
    return new ConfidenceScore(0.3)
  }

  static medium(): ConfidenceScore {
    return new ConfidenceScore(0.65)
  }

  static high(): ConfidenceScore {
    return new ConfidenceScore(0.9)
  }

  static fromPercentage(percentage: number): ConfidenceScore {
    return new ConfidenceScore(percentage / 100)
  }
}