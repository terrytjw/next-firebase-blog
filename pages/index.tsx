import { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import {
  collectionGroup,
  getFirestore,
  query,
  limit,
  getDocs,
  orderBy,
  startAfter,
  Timestamp,
  where,
} from "firebase/firestore";
import { docToJSON } from "../lib/firebase";
import PostFeed from "../components/PostFeed";
import Metatags from "../components/Metatags";
import Loading from "../components/Loading";
import { Autosave } from "react-autosave";

const LIMIT = 1;
export const LOCAL_STORAGE_KEY = "react-autosave";

const HomePage: NextPage = ({ posts }: any) => {
  const [latestPosts, setLatestPosts] = useState(posts); // need this because we want to fetch additional posts via client-side later
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const [blogText, setBlogText] = useState(() => {
    if (typeof window !== "undefined") {
      return {
        name: localStorage.getItem(LOCAL_STORAGE_KEY) ?? "",
      };
    } else {
      return { name: "" };
    }
  });
  // save to local storage, can replace to writing to db in the future
  const updateBlog = (data: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, data);
  };

  // Get next page in pagination query
  const getMorePosts = async () => {
    setLoading(true);
    const last = latestPosts[latestPosts.length - 1];

    // this is needed becuase the createAt field might be a number or a firebase timestamp, we need the timestamp version
    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const postRef = collectionGroup(getFirestore(), "posts"); // basically whay collectionGroup does is allow us to grab any subcollection with the name of "posts", no matter where it's nested in the tree of documents in firestore
    const postsQuery = query(
      postRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor), // start after the last doc in the current list of posts
      limit(LIMIT)
    );

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());

    setLatestPosts(latestPosts.concat(newPosts));
    setLoading(false);

    // if there are less than LIMIT posts, we know we've reached the end of the DB
    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };
  return (
    <div>
      <main className="p-4">
        <Metatags
          title="Home Page"
          description="Get the latest posts on our site"
        />

        <div className="max-w-3xl m-auto">
          <h1 className="p-4 text-center text-3xl font-bold">
            🔥 Next-Firebase-Blog 🔥
          </h1>
          <p className="p-4">
            Welcome! This app is built with Next.js and Firebase and is loosely
            inspired by Dev.to. Sign up for an 👨‍🎤 account, ✍️ write posts, then
            💞 heart content created by other users. All public content is
            server-rendered and search-engine optimized.
          </p>
        </div>

        <PostFeed posts={latestPosts} />

        <div className="flex justify-center mt-4">
          {!loading && !postsEnd && latestPosts.length > 0 && (
            <button className="btn" onClick={getMorePosts}>
              Load more
            </button>
          )}
          {loading && <Loading />}
          {postsEnd && "You have reached the end!"}
        </div>
        <div className="mt-20">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            React Autosave Demo
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              id="email"
              className="block p-2 w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={blogText?.name}
              placeholder="you@example.com"
              onChange={(e) => setBlogText({ name: e.target.value })}
            />
          </div>
        </div>
        <Autosave data={blogText?.name} onSave={updateBlog} />
      </main>
    </div>
  );
};

export default HomePage;

export async function getServerSideProps() {
  // get post data
  const postRef = collectionGroup(getFirestore(), "posts"); // basically whay collectionGroup does is allow us to grab any subcollection with the name of "posts", no matter where it's nested in the tree of documents in firestore
  const postsQuery = query(
    postRef,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );
  const posts = (await getDocs(postsQuery)).docs.map(docToJSON);

  return {
    props: { posts }, // will be passed to the page component as props
  };
}
