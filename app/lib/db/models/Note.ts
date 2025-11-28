import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    default: "Untitled Meeting"
  },
  content: { // The generated minutes
    type: String,
    required: true,
  },
  transcript: {
    type: String, // Full transcript
  },
  source: {
    type: String, // 'live' or 'upload'
    default: 'live'
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
