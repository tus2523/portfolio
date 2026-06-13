import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload
 * @param path The destination path in the storage bucket (e.g., 'profile/avatar.png')
 * @param onProgress Callback receiving the progress percentage (0-100)
 * @returns Promise resolving to the download URL
 */
export function uploadImage(
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => resolve(downloadURL))
          .catch((error) => reject(error));
      }
    );
  });
}

/**
 * Deletes a file from Firebase Storage using its full download URL.
 * @param url The full download URL of the file
 */
export async function deleteImageByUrl(url: string): Promise<void> {
  if (!url || !url.startsWith("http")) return;
  // Ensure the URL is a Firebase Storage URL to prevent accidental deletions of external assets
  if (!url.includes("firebasestorage.googleapis.com")) {
    console.warn("URL is not a Firebase Storage URL, skipping delete:", url);
    return;
  }
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error: any) {
    // If the file was already deleted or not found, we don't throw an error to keep flow smooth
    if (error?.code === "storage/object-not-found") {
      console.warn("Storage object not found, ignoring deletion error:", url);
      return;
    }
    throw error;
  }
}

/**
 * Deletes a file from Firebase Storage using its storage path.
 * @param path The path in the storage bucket
 */
export async function deleteImageByPath(path: string): Promise<void> {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error: any) {
    if (error?.code === "storage/object-not-found") {
      return;
    }
    throw error;
  }
}
