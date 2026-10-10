import multer from "multer";

// STORAGE CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/avatars");
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// A profile picture is always an image, so nothing else is accepted.
const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp"
];

// FILE FILTER
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Only JPG, JPEG, PNG, GIF, WEBP images are allowed"),
            false
        );
    }
};

export const profileUploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB, matching the hint shown in Settings
    }
});

// Wraps the single `avatar` upload so a rejected file answers with the same
// JSON shape the rest of the API uses instead of Express' default HTML error.
// Shared by the student profile route and the admin console's own route.
export const uploadAvatar = (req, res, next) => {
    profileUploadMiddleware.single('avatar')(req, res, (error) => {
        if (!error) return next()

        return res.status(400).json({
            success: false,
            message: error.message || 'Profile image upload failed'
        })
    })
}