import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { extname, join } from "path";
import { v2 as cloudinary } from "cloudinary";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

@Injectable()
export class UploadService {
  private cloudinaryReady = false;

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.cloudinaryReady = true;
    }
  }

  async uploadImage(file?: Express.Multer.File) {
    if (!file?.buffer?.length) {
      throw new BadRequestException("Image file is required");
    }
    if (!ALLOWED.has(file.mimetype)) {
      throw new BadRequestException("Only JPEG, PNG, WebP, or GIF images");
    }
    if (file.size > MAX_BYTES) {
      throw new BadRequestException("Image must be 5MB or smaller");
    }

    if (this.cloudinaryReady) {
      const url = await new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "mg-jewelry",
            resource_type: "image",
          },
          (err, result) => {
            if (err || !result?.secure_url) {
              reject(err || new Error("Cloudinary upload failed"));
              return;
            }
            resolve(result.secure_url);
          },
        );
        stream.end(file.buffer);
      });
      return { url, provider: "cloudinary" as const };
    }

    const uploadDir =
      process.env.UPLOAD_DIR || join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });
    const ext = extname(file.originalname || "").toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)
      ? ext
      : ".jpg";
    const filename = `${randomUUID()}${safeExt}`;
    await writeFile(join(uploadDir, filename), file.buffer);

    const publicBase = (
      process.env.API_PUBLIC_URL ||
      process.env.API_URL ||
      `http://localhost:${process.env.PORT || process.env.API_PORT || 4000}`
    ).replace(/\/$/, "");
    return {
      url: `${publicBase}/api/uploads/${filename}`,
      provider: "local" as const,
    };
  }

  requireConfigured() {
    if (!this.cloudinaryReady && !process.env.UPLOAD_DIR && !process.env.API_PUBLIC_URL) {
      // local disk always works; only warn via provider
    }
    if (!this.cloudinaryReady && process.env.REQUIRE_CLOUDINARY === "1") {
      throw new ServiceUnavailableException(
        "Cloudinary is not configured (CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET)",
      );
    }
  }
}
