import multer from 'multer';
import path from 'path';
import crypto from "crypto";
import { Request } from 'express';

interface File {
  mimetype: string,
}

export const storage= multer.diskStorage({
  destination: path.resolve(__dirname, '..', '..', 'uploads'),
  filename(request, file,  callback) {
    const hash = crypto.randomBytes(6).toString('hex');

    const filename = `${hash}-${file.originalname}`;

    callback(null, filename);
  }
})

export const fileFilter = (request: Request, file: File, callback: Function) => {
  if (
    !file.mimetype.includes("jpeg") &&
    !file.mimetype.includes("jpg") &&
    !file.mimetype.includes("png") &&
    !file.mimetype.includes("gif")
  ) {
    return callback(null, false, new Error("Only images are allowed"));
  }
  callback(null, true);
};