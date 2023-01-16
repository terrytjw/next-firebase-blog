import {
  doc,
  getFirestore,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import "highlight.js/styles/github.css";
import AuthCheck from "../../components/AuthCheck";
import ImageUploader from "../../components/ImageUploader";
import { auth } from "../../lib/firebase";

const AdminPostEditPage: NextPage = (props: any) => {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
};

export default AdminPostEditPage;

function PostManager() {
  const [preview, setPreview] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  // @ts-ignore
  const postRef = doc(
    getFirestore(),
    "users",
    auth.currentUser!.uid,
    "posts",
    slug
  );
  const [post] = useDocumentDataOnce(postRef);

  return (
    <div className="p-8">
      {post && (
        <div className="">
          <div>
            <h1 className="py-2 text-2xl font-bold">{post.title}</h1>
            <p>
              Post slug: <span className="italic opacity-70">{post.slug}</span>
            </p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              preview={preview}
            />
          </div>

          <div className="flex space-x-2 py-2">
            <button
              className="btn btn-outline"
              onClick={() => setPreview(!preview)}
            >
              {preview ? "Edit" : "Preview"}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn btn-outline">Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </div>
        </div>
      )}
    </div>
  );
}

function PostForm({ defaultValues, postRef, preview }: any) {
  const { register, handleSubmit, formState, reset, watch } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty, errors } = formState;

  const updatePost = async ({ content, published }: any) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="py-8">
          <ReactMarkdown
            className="prose prose-slate"
            rehypePlugins={
              [
                /*e.g. syntax highlighting**/
              ]
            }
          >
            {watch("content")}
          </ReactMarkdown>
        </div>
      )}

      <div className={preview ? "hidden" : ""}>
        <ImageUploader />

        <textarea
          className="textarea textarea-bordered mt-6 w-2/3"
          rows={12}
          {...register("content", {
            maxLength: { value: 20000, message: "content is too long" },
            minLength: { value: 10, message: "content is too short" },
            required: { value: true, message: "content is required" },
          })}
        />
        <div className="text-red-600">
          <ErrorMessage errors={errors} name="content" />
        </div>

        <div className="flex items-center mb-8">
          <input
            id="default-checkbox"
            type="checkbox"
            {...register("published")}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="default-checkbox"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Published
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }: any) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm("are you sure!");
    if (doIt) {
      await deleteDoc(postRef);
      router.push("/admin");
      toast("post annihilated ", { icon: "🗑️" });
    }
  };

  return (
    <button className="btn btn-outline btn-error" onClick={deletePost}>
      Delete
    </button>
  );
}
