import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./config";

/**
 * Uploads a file to Firebase Storage under /public/uploads/ and returns its
 * public download URL. Uses a timestamp + random suffix to avoid collisions.
 */
export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storageRef = ref(storage, `public/uploads/${name}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

/**
 * Deletes a file from Firebase Storage by its download URL.
 * Silently ignores errors (e.g. file already deleted).
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore — file may have been deleted already or URL may be external
  }
}
