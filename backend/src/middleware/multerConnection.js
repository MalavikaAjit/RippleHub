// middleware/upload.middleware.js
import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  return extname && mimetype
    ? cb(null, true)
    : cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array("post_image", 10);

export const postImageUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }

    const { caption, privacy } = req.body;
    if (!caption || !privacy) {
      req.files?.forEach((file) => {
        try {
          fs.unlinkSync(file.path);
        } catch (e) {
          console.error("Failed to delete file:", file.path, e);
        }
      });
      return res
        .status(400)
        .json({ error: "Caption and privacy are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    req.imagePaths = req.files.map((file) => file.filename);
    next();
  });
};

export const updateImageUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err instanceof multer.MulterError || err) {
      return res.status(400).json({ error: err.message });
    }

    // Optional: No validation — allow partial update (no caption or images)
    req.imagePaths = req.files?.map((file) => file.filename) || [];
    next();
  });
};
