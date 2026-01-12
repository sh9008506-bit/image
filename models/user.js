const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: '/assets/default-avatar.png'
    },
    bio: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    lastUsernameChange: {
        type: Date,
        default: null
    },
    uploadCount: {
        type: Number,
        default: 0
    },
    totalStorageUsed: {
        type: Number,
        default: 0
    },
    maxStorage: {
        type: Number,
        default: 100 * 1024 * 1024 // 100MB
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
});

// Password hash လုပ်ခြင်း
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Password စစ်ဆေးခြင်း
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Username ပြောင်းလဲနိုင်မလား စစ်ဆေးခြင်း
userSchema.methods.canChangeUsername = function() {
    if (!this.lastUsernameChange) return true;
    
    const now = new Date();
    const lastChange = new Date(this.lastUsernameChange);
    const daysDiff = Math.floor((now - lastChange) / (1000 * 60 * 60 * 24));
    
    return daysDiff >= 7;
};

// Storage နေရာကျန်မကျန် စစ်ဆေးခြင်း
userSchema.methods.hasStorageSpace = function(fileSize) {
    return (this.totalStorageUsed + fileSize) <= this.maxStorage;
};

module.exports = mongoose.model('User', userSchema);