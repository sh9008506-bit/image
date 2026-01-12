const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    filename: {
        type: String,
        required: true
    },
    filepath: {
        type: String,
        required: true
    },
    thumbpath: {
        type: String,
        default: ''
    },
    fileSize: {
        type: Number,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    dimensions: {
        width: Number,
        height: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    isPublic: {
        type: Boolean,
        default: true
    },
    views: {
        type: Number,
        default: 0
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downloads: {
        type: Number,
        default: 0
    },
    metadata: {
        camera: String,
        location: String,
        takenAt: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// ပုံတင်သည့်အခါ user ရဲ့ upload count ကို update လုပ်ခြင်း
imageSchema.pre('save', async function(next) {
    if (this.isNew) {
        const User = mongoose.model('User');
        await User.findByIdAndUpdate(this.user, {
            $inc: { 
                uploadCount: 1,
                totalStorageUsed: this.fileSize
            }
        });
    }
    next();
});

// ပုံဖျက်သည့်အခါ user ရဲ့ upload count ကို update လုပ်ခြင်း
imageSchema.pre('remove', async function(next) {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(this.user, {
        $inc: { 
            uploadCount: -1,
            totalStorageUsed: -this.fileSize
        }
    });
    next();
});

module.exports = mongoose.model('Image', imageSchema);