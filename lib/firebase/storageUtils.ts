import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type FirebaseStorage,
} from "firebase/storage";

export async function uploadImage(storage: FirebaseStorage, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storageRef = ref(storage, `public/uploads/${name}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  return getDownloadURL(storageRef);
}

export async function deleteImageByUrl(storage: FirebaseStorage, url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore — file may have been deleted already or URL may be external
  }
}
