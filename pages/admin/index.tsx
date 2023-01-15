import AuthCheck from "../../components/AuthCheck";
import PostFeed from "../../components/PostFeed";
import { UserContext } from "../../lib/context";
import { auth } from "../../lib/firebase";
import {
  serverTimestamp,
  query,
  collection,
  orderBy,
  getFirestore,
  setDoc,
  doc,
} from "firebase/firestore";
import { FormEvent, useContext, useState } from "react";
import { useRouter } from "next/router";
import { useCollection } from "react-firebase-hooks/firestore";
import { kebabCase } from "lodash";
import toast from "react-hot-toast";

export default function AdminPostsPage(props: any) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  // const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
  // const query = ref.orderBy('createdAt');

  const ref = collection(
    getFirestore(),
    "users",
    auth.currentUser!.uid, // can use non-null assertion here because authcheck ensures user is logged in before this component renders
    "posts"
  );
  const postQuery = query(ref, orderBy("createdAt"));

  const [querySnapshot] = useCollection(postQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1 className="p-12 text-3xl font-semibold text-center">
        Manage your Posts
      </h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // encodeURI ensures slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser!.uid;
    const ref = doc(getFirestore(), "users", uid, "posts", slug);

    // Tip: give all fields a default value here
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    router.push(`/admin/${slug}`);
  };

  return (
    <div className="flex justify-center">
      <form onSubmit={createPost} className="mt-20 p-4 w-1/2">
        <div>
          <label
            htmlFor="articleTitle"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Article title
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="articleTitle"
              id="articleTitle"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Awesome Article!"
            />
          </div>
          <p
            className="mt-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-400"
            id="article-slug"
          >
            Slug:{" "}
            {slug ? (
              slug
            ) : (
              <span className="font-light italic opacity-60">
                your slug will appear here
              </span>
            )}
          </p>
        </div>
        <button type="submit" disabled={!isValid} className="btn btn-sm mt-8">
          Create New Post
        </button>
      </form>
    </div>
  );
}
