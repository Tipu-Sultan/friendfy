import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.MY_CLOUD_NAME,
  api_key: process.env.MY_API_KEY,
  api_secret: process.env.MY_API_SECRET,
});

/**
 * Uploads media to Cloudinary and returns details.
 * @param {Buffer} buffer - The file buffer to upload.
 * @param {string} contentType - The content type of the file (e.g., image/jpeg, video/mp4).
 * @param {string} folder - The folder name in Cloudinary to store the file.
 * @returns {Promise<object>} - The upload result with media details.
 */
export const uploadMedia = async (buffer, contentType, folder = "peopulse") => {
  try {
    const resourceType = contentType.startsWith("video") ? "video" : "image";

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: resourceType,
          folder,
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result);
        }
      ).end(buffer);
    });

    return {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      resource_type: uploadResult.resource_type,
      size: uploadResult.bytes,
      format: uploadResult.format,
    };
  } catch (error) {
    throw new Error(`Cloudinary Upload Error: ${error.message}`);
  }
};
