import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type FirebaseStorage,
} from "firebase/storage";

const UPLOAD_TIMEOUT_MS = 30_000; // 30 s — fail fast instead of hanging forever

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`[storageUtils] ${label} timed out after ${ms / 1000}s`)),
      ms,
    );
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); },
    );
  });
}

export async function uploadImage(storage: FirebaseStorage, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const storageRef = ref(storage, `public/uploads/${name}`);

  await withTimeout(
    uploadBytes(storageRef, file, { contentType: file.type }),
    UPLOAD_TIMEOUT_MS,
    "uploadBytes",
  );

  return withTimeout(
    getDownloadURL(storageRef),
    UPLOAD_TIMEOUT_MS,
    "getDownloadURL",
  );
}

export async function deleteImageByUrl(storage: FirebaseStorage, url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // ignore — file may have been deleted already or URL may be external
  }
}
