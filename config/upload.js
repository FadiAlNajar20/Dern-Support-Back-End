import multer from "multer";
import path from "path";

// Storage engine setup
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    const filename = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, filename);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

