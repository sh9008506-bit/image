const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    imageCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Slug လုပ်ခြင်း
tagSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .replace(/[^\w\s]/gi, '')
            .replace(/\s+/g, '-');
    }
    next();
});

module.exports = mongoose.model('Tag', tagSchema);