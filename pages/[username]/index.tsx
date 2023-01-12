import {
  collection,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { NextPage } from "next";
import React from "react";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { docToJSON, getUserWithUsername } from "../../lib/firebase";

const UserProfilePage: NextPage = ({ user, posts }: any) => {
  return (
    <main>
      <UserProfile user={user} />
      <br /> <br />
      <PostFeed posts={posts} />
    </main>
  );
};

export default UserProfilePage;

export async function getServerSideProps({ query: urlQuery }: any) {
  const { username } = urlQuery;

  const userDoc = await getUserWithUsername(username);

  // If no user, short circuit to 404 page
  if (!userDoc) {
    return {
      notFound: true,
    };
  }

  // JSON serializable data
  let user = null;
  let posts = null;

  if (userDoc) {
    user = userDoc.data();

    const postsQuery = query(
      collection(getFirestore(), userDoc.ref.path, "posts"),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    posts = (await getDocs(postsQuery)).docs.map(docToJSON);
  }

  return {
    props: { user, posts }, // will be passed to the page component as props
  };
}
