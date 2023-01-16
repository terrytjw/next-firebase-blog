import { ChangeEvent, useState } from "react";
import { auth, storage, STATE_CHANGED } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Loading from "./Loading";

// Uploads images to Firebase Storage
export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    // Get the file
    const file: any = Array.from(e.target.files!)[0];
    const extension = file.type.split("/")[1];

    // Makes reference to the storage bucket location
    const fileRef = ref(
      storage,
      `uploads/${auth.currentUser!.uid}/${Date.now()}.${extension}` // using Date.now as a timestamp to create a unique file name for each upload
    );
    setUploading(true);

    // Starts the upload
    const task = uploadBytesResumable(fileRef, file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(parseInt(pct));
    });

    // Get downloadURL AFTER task resolves (Note: this is not a native Promise)
    task
      .then((d) => getDownloadURL(fileRef))
      // for this line below, it is a promise
      .then((url: any) => {
        setDownloadURL(url);
        setUploading(false);
      });
  };

  return (
    <div className="flex space-x-4">
      {uploading && <Loading />}
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <div className="py-4">
          <div className="form-control w-full max-w-xs">
            <label className="btn" htmlFor="img-file">
              📸 Upload Image
            </label>
            <input
              type="file"
              id="img-file"
              className="file-input file-input-bordered w-full max-w-xs hidden"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </div>
        </div>
      )}

      <div className="flex items-center p-4 max-w-3xl break-all border border-gray-300 dark:border-white/20 rounded">
        {downloadURL ? (
          <code className="">{`![alt](${downloadURL})`}</code>
        ) : (
          <p className="italic opacity-60">
            Markdown version of image URL will appear here
          </p>
        )}
      </div>
    </div>
  );
}
