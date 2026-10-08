import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const makeUpload = (folder) =>
    multer({
        storage: new CloudinaryStorage({
            cloudinary,
            params: {
                folder,
                allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
            }
        })
    });

export const uploadCategory = makeUpload('category');
export const uploadProduct = makeUpload('product');
export const uploadProfile = makeUpload('profile');
export const uploadSubcategory = makeUpload('subcategory');
export { cloudinary };