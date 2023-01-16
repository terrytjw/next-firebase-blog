import {
  doc,
  getFirestore,
  getDoc,
  collectionGroup,
  getDocs,
  limit,
  query,
} from "firebase/firestore";
import { NextPage } from "next";
import Link from "next/link";
import React, { useContext } from "react";
import AuthCheck from "../../components/AuthCheck";
import Metatags from "../../components/Metatags";
import PostContent from "../../components/PostContent";
import { UserContext } from "../../lib/context";
import { docToJSON, getUserWithUsername } from "../../lib/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

// Public facing post page of a specific user
const PostPage: NextPage = ({ post, path }: any) => {
  const postRef = doc(getFirestore(), path);
  const [realtimePost] = useDocumentData(postRef);

  const latestPost = realtimePost || post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className="flex justify-center items-center">
      <Metatags title={latestPost.title} description={latestPost.title} />

      <div className="mt-20 p-10 w-2/3 shadow-md dark:shadow-slate-800">
        <PostContent post={latestPost} />

        <div className="flex items-center gap-x-4 mt-10">
          <AuthCheck
            fallback={
              <Link href="/login">
                <button>💗 Sign Up</button>
              </Link>
            }
          >
            {/* <HeartButton postRef={postRef} /> */}
            <button className="btn btn-secondary">Heart</button>
          </AuthCheck>

          {currentUser?.uid === latestPost.uid && (
            <Link href={`/admin/${latestPost.slug}`}>
              <button className="btn btn-outline">Edit Post</button>
            </Link>
          )}
          <p className="ml-auto">{latestPost.heartCount || 0} 🤍</p>
        </div>
      </div>
    </main>
  );
};

export default PostPage;

export async function getStaticProps({ params }: any) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = doc(getFirestore(), userDoc.ref.path, "posts", slug);
    post = docToJSON(await getDoc(postRef));

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 900,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const q = query(collectionGroup(getFirestore(), "posts"), limit(20));
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: "blocking",
  };
}
