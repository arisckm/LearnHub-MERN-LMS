const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    content: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    duration: { type: Number, default: 0 }, // minutes
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: 2000,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Web Development',
        'Data Science',
        'Mobile Development',
        'AI & Machine Learning',
        'Design',
        'Business',
        'Other',
      ],
      default: 'Other',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    lessons: [lessonSchema],
    isPublished: {
      type: Boolean,
      default: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

courseSchema.virtual('totalDuration').get(function () {
  return this.lessons.reduce((sum, l) => sum + (l.duration || 0), 0);
});

courseSchema.set('toJSON', { virtuals: true });
courseSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
