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

// Index for better search performance
WordSchema.index({ word: 1 })
WordSchema.index({ category: 1 })
WordSchema.index({ numLetters: 1 })
WordSchema.index({ numSyllables: 1 })

export default mongoose.models.word || mongoose.model<Word>('word', WordSchema)
