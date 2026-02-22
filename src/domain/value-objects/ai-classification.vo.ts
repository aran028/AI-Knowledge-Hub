export class AIClassification {
  private readonly _category: string
  private readonly _subcategory?: string
  private readonly _toolsDetected: Set<string>
  private readonly _confidence: number
  private readonly _reasoning: string

  constructor(
    category: string,
    confidence: number,
    reasoning: string,
    subcategory?: string,
    toolsDetected?: string[]
  ) {
    this.validateCategory(category)
    this.validateConfidence(confidence)
    this.validateReasoning(reasoning)
    
    this._category = category
    this._subcategory = subcategory?.trim()
    this._toolsDetected = new Set(toolsDetected?.map(tool => tool.trim()) || [])
    this._confidence = confidence
    this._reasoning = reasoning.trim()
  }

  // Getters
  get category(): string { return this._category }
  get subcategory(): string | undefined { return this._subcategory }
  get toolsDetected(): string[] { return Array.from(this._toolsDetected) }
  get confidence(): number { return this._confidence }
  get reasoning(): string { return this._reasoning }

  // Query methods
  hasCategory(category: string): boolean {
    return this._category.toLowerCase() === category.toLowerCase()
  }

  hasSubcategory(subcategory: string): boolean {
    return this._subcategory?.toLowerCase() === subcategory.toLowerCase()
  }

  detectsTool(toolName: string): boolean {
    return Array.from(this._toolsDetected).some(tool => 
      tool.toLowerCase().includes(toolName.toLowerCase())
    )
  }

  hasHighConfidence(): boolean {
    return this._confidence >= 0.8
  }

  hasMediumConfidence(): boolean {
    return this._confidence >= 0.5 && this._confidence < 0.8
  }

  hasLowConfidence(): boolean {
    return this._confidence < 0.5
  }

  equals(other: AIClassification): boolean {
    return (
      this._category === other._category &&
      this._subcategory === other._subcategory &&
      Math.abs(this._confidence - other._confidence) < 0.001 &&
      this._reasoning === other._reasoning &&
      this.toolsDetected.length === other.toolsDetected.length &&
      this.toolsDetected.every(tool => other._toolsDetected.has(tool))
    )
  }

  // Serialization
  toJson(): object {
    return {
      category: this._category,
      subcategory: this._subcategory,
      tools_detected: this.toolsDetected,
      confidence: this._confidence,
      reasoning: this._reasoning
    }
  }

  toString(): string {
    const tools = this.toolsDetected.length > 0 
      ? ` (${this.toolsDetected.join(', ')})` 
      : ''
    
    const subcategory = this._subcategory ? ` - ${this._subcategory}` : ''
    const confidence = `(${(this._confidence * 100).toFixed(1)}%)`
    
    return `${this._category}${subcategory}${tools} ${confidence}`
  }

  // Private validation methods
  private validateCategory(category: string): void {
    if (!category || category.trim().length === 0) {
      throw new Error('Category cannot be empty')
    }
    
    const allowedCategories = [
      'IA/ML',
      'Diseño',
      'Desarrollo',
      'Productividad',
      'Data Science',
      'DevOps',
      'Mobile',
      'Web',
      'Gaming',
      'Security',
      'Education',
      'Other'
    ]
    
    if (!allowedCategories.some(cat => cat.toLowerCase() === category.toLowerCase())) {
      console.warn(`Category '${category}' is not in the predefined list`)
    }
  }

  private validateConfidence(confidence: number): void {
    if (confidence < 0 || confidence > 1) {
      throw new Error('Confidence must be between 0 and 1')
    }
    
    if (isNaN(confidence)) {
      throw new Error('Confidence must be a valid number')
    }
  }

  private validateReasoning(reasoning: string): void {
    if (!reasoning || reasoning.trim().length < 5) {
      throw new Error('Reasoning must have at least 5 characters')
    }
    
    if (reasoning.length > 500) {
      throw new Error('Reasoning cannot exceed 500 characters')
    }
  }

  // Factory methods
  static create(
    category: string,
    confidence: number,
    reasoning: string,
    subcategory?: string,
    toolsDetected?: string[]
  ): AIClassification {
    return new AIClassification(category, confidence, reasoning, subcategory, toolsDetected)
  }

  static fromPersistence(data: any): AIClassification {
    if (typeof data === 'string') {
      data = JSON.parse(data)
    }
    
    return new AIClassification(
      data.category,
      data.confidence,
      data.reasoning,
      data.subcategory,
      data.tools_detected || data.toolsDetected
    )
  }

  // Predefined categories for common cases
  static createAIML(subcategory: string, confidence: number, reasoning: string, tools?: string[]): AIClassification {
    return new AIClassification('IA/ML', confidence, reasoning, subcategory, tools)
  }

  static createDesign(subcategory: string, confidence: number, reasoning: string, tools?: string[]): AIClassification {
    return new AIClassification('Diseño', confidence, reasoning, subcategory, tools)
  }

  static createDevelopment(subcategory: string, confidence: number, reasoning: string, tools?: string[]): AIClassification {
    return new AIClassification('Desarrollo', confidence, reasoning, subcategory, tools)
  }

  static createProductivity(subcategory: string, confidence: number, reasoning: string, tools?: string[]): AIClassification {
    return new AIClassification('Productividad', confidence, reasoning, subcategory, tools)
  }
}