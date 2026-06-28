import multer from "multer";

// STORAGE CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/papers");
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// ALLOWED FILE TYPES
const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/jpg",
    "image/png"
];

// FILE FILTER
const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed"
            ),
            false
        );
    }
};


export const PaperUploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});