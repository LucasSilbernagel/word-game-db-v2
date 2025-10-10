import mongoose, { Document, Schema } from 'mongoose'

type Word = Document & {
  word: string
  category: string
  numLetters: number
  numSyllables: number
  hint: string
}

const WordSchema = new Schema<Word>(
  {
    word: {
      type: String,
      lowercase: true,
      required: true,
    },
    category: {
      type: String,
      lowercase: true,
      required: true,
    },
    numLetters: {
      type: Number,
      required: true,
    },
    numSyllables: {
      type: Number,
      required: true,
    },
    hint: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

// Single field indexes
WordSchema.index({ word: 1 })
WordSchema.index({ category: 1 })
WordSchema.index({ numLetters: 1 })
WordSchema.index({ numSyllables: 1 })
WordSchema.index({ createdAt: -1 }) // For sorting by creation date

// Compound indexes for common query patterns
WordSchema.index({ category: 1, numLetters: 1 })
WordSchema.index({ category: 1, numSyllables: 1 })
WordSchema.index({ numLetters: 1, numSyllables: 1 })
WordSchema.index({ category: 1, createdAt: -1 })

// Text index for search functionality
WordSchema.index({ word: 'text', hint: 'text' })

export default mongoose.models.word || mongoose.model<Word>('word', WordSchema)
