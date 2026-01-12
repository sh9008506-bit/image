// Check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ 
        success: false, 
        message: 'Please login to access this resource' 
    });
};

// Check if user is admin
exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
    });
};

// Check if user can change username
exports.canChangeUsername = (req, res, next) => {
    if (req.user.canChangeUsername()) {
        return next();
    }
    res.status(400).json({ 
        success: false, 
        message: `Username can only be changed once every 7 days. You can change in ${req.user.daysUntilChange()} days` 
    });
};