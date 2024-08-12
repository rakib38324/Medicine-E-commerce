import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

export const deleteImage = (path: string) => {
  if (fs.existsSync(path)) {
    fs.unlink(path, (error) => {
      if (error) {
        return { message: 'Opps! Something went wrong, Try again.' };
      } else {
        console.log('File is deleted');
        return { message: 'Image deleted Successfully.' };
      }
    });
  } else {
    return { message: 'Image not found' };
  }
};
