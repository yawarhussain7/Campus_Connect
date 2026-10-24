import sharp from 'sharp'

export const validateFile = async (buffer, mimeType) => {

    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error('Invalid file buffer')
    }

    if (buffer.subarray(0, 5).toString() === '%PDF-') {
        return {
            mimeType: 'application/pdf',
            fileType: 'pdf',
        }
    }

    const supportedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (mimeType && !supportedImageTypes.includes(mimeType)) {
        throw new Error('Content verification supports PDF, JPEG, PNG, and WEBP files only.');
    }

    // for image 
    const metadata = await sharp(buffer).metadata()

    const allowedImageTypes = ['jpeg', 'png', 'webp']

    if (!allowedImageTypes.includes(metadata.format)) {
        throw new Error(`Invalid image format. Allowed formats: ${allowedImageTypes.join(', ')}`)
    }

    if (
        !metadata.width ||
        !metadata.height ||
        metadata.width < 100 ||
        metadata.height < 100
    ) {
        throw new Error("Image dimensions are too small.");
    }

    return {
        mimeType: {
            jpeg: "image/jpeg",
            png: "image/png",
            webp: "image/webp"
        }[metadata.format],
        fileType: "image"
    };
}
