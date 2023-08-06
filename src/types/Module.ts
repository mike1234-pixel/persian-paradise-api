export interface Registers {
  informal: string
  formal: string
}

export interface Phrase {
  en: string
  fa: string[] | Registers
  emoji?: string
  hint?: string
}

export interface CourseModule {
  title: string
  subtitle?: string
  emoji?: string
  phrases: Phrase[]
}

export type ModulesList = CourseModule[]
