import cloudinary from "cloudinary";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const deleteMediaFromCloudinary = async (mediaUrl, contentType) => {
  try {
    if (!mediaUrl) return { success: false, message: "No media URL provided" };

    // Extract the public ID from the media URL
    const urlParts = mediaUrl.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1]; // Get the last part (filename.extension)
    const publicId = `peopulse/${publicIdWithExtension.split(".")[0]}`; // Remove file extension

    // Determine resource type (video or image)
    const isVideo = contentType?.includes("video");

    console.log("Deleting from Cloudinary:", publicId, isVideo ? "video" : "image");

    // Delete media from Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(publicId, {
      resource_type: isVideo ? "video" : "image",
    });

    if (cloudinaryResult.result !== "ok") {
      console.error("Error deleting media from Cloudinary:", cloudinaryResult);
      return { success: false, message: "Failed to delete media from Cloudinary" };
    }

    return { success: true, message: "Media deleted successfully" };
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    return { success: false, message: "Error processing media deletion" };
  }
};

