// lib/fileUpload.ts
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure upload directory exists
export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// Validate file type
export function isValidImageType(file: File): boolean {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  return validTypes.includes(file.type);
}

// Validate file size (max 5MB)
export function isValidFileSize(file: File): boolean {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
}

// Generate unique filename
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = path.extname(originalName);
  return `${timestamp}-${randomString}${extension}`;
}

// Upload file and return path
export async function uploadFile(file: File): Promise<{
  success: boolean;
  filePath?: string;
  publicUrl?: string;
  error?: string;
}> {
  try {
    // Validate file type
    if (!isValidImageType(file)) {
      return {
        success: false,
        error:
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
      };
    }

    // Validate file size
    if (!isValidFileSize(file)) {
      return { success: false, error: "File too large. Maximum size is 5MB." };
    }

    // Ensure upload directory exists
    await ensureUploadDir();

    // Generate unique filename
    const fileName = generateFileName(file.name);
    const filePath = path.join(UPLOAD_DIR, fileName);
    const publicUrl = `/uploads/${fileName}`;

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    return {
      success: true,
      filePath,
      publicUrl,
    };
  } catch (error) {
    console.error("File upload error:", error);
    return { success: false, error: "Failed to upload file" };
  }
}

// Delete file (for cleanup)
export async function deleteFile(filePath: string): Promise<boolean> {
  try {
    const fs = require("fs").promises;
    const fullPath = path.join(process.cwd(), "public", filePath);
    await fs.unlink(fullPath);
    return true;
  } catch (error) {
    console.error("File deletion error:", error);
    return false;
  }
}
