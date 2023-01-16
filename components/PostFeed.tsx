import Link from "next/link";
import React from "react";
import { Post } from "../types";

type PostItemProps = {
  post: Post;
  admin?: boolean;
};
const PostItem = ({ post, admin = false }: PostItemProps) => {
  // Naive method to calc word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="flex justify-center">
      <Link
        href={`/${post.username}/${post.slug}`}
        className="py-4 w-1/3 group cursor-pointer"
      >
        <div className="card w-full bg-stone-100 group-hover:bg-stone-200/70 border border-stone-200 shadow-md shadow-stone-100 transition-all">
          <div className="card-body">
            <h2 className="card-title px-2">{post.title}</h2>
            <p className="px-2 italic">
              Written by <span className="text-gray-500">@{post.username}</span>
            </p>
            <div className="flex space-x-6 mt-4 px-2">
              <span>{wordCount} words</span>
              <span>{minutesToRead} min read</span>
              <span className="">💗 {post.heartCount || 0} Hearts</span>
            </div>
          </div>
        </div>
      </Link>

      {/* If admin view, show extra controls for user */}
      {admin && (
        <div className="flex items-center gap-x-2 ml-4 relative">
          <Link href={`/admin/${post.slug}`}>
            <button className="btn btn-sm btn-outline">Edit</button>
          </Link>

          {post.published ? (
            <p
              className="tooltip tooltip-right tooltip-accent text-success text-sm absolute left-1 bottom-12 px-2 py-1 bg-green-300/10 rounded-lg"
              data-tip="This article is viewable by the public."
            >
              Live
            </p>
          ) : (
            <p
              className="tooltip tooltip-right tooltip-error text-error text-sm absolute left-1 bottom-12 px-2 py-1 bg-red-300/10 rounded-lg"
              data-tip="This article is not yet published."
            >
              Unpublished
            </p>
          )}
        </div>
      )}
    </div>
  );
};

type PostFeedProps = {
  posts: any;
  admin?: boolean;
};
const PostFeed = ({ posts, admin }: PostFeedProps) => {
  return posts
    ? posts.map((post: any) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
};

export default PostFeed;
