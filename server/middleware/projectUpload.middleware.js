import multer from "multer";

// STORAGE CONFIG
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/projects");
    },

    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

// ALLOWED FILE TYPES (archives and reports are both common for a project)
const allowedMimeTypes = [
    "application/pdf",
    "application/zip",
    "application/x-zip-compressed",
    "application/x-compressed",
    "application/x-rar-compressed",
    "application/vnd.rar",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
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
                "Only PDF, DOC, DOCX, PPT, PPTX, ZIP, RAR, JPG, JPEG, PNG files are allowed"
            ),
            false
        );
    }
};

export const projectUploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB
    }
});
