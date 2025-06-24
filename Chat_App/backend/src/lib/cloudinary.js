import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY, // Fixed this line
    api_secret: process.env.CLOUDINARY_API_SECRET, // And this one
});

export default cloudinary;
